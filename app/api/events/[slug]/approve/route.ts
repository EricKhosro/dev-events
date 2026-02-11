import connectDB from "@/server/db/mongodb";
import Event from "@/server/modules/event/event.model";
import { requireAdmin } from "@/server/modules/user/user.action";
import { EventMessages } from "@/server/modules/event/event.messages";
import createHttpError from "http-errors";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

type RouteParam = {
  slug: string;
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<RouteParam> }
) {
  const { slug } = await params;

  try {
    await connectDB();
    await requireAdmin();

    const event = await Event.findOne({ slug });

    if (!event) {
      throw new createHttpError.NotFound(EventMessages.NotFound);
    }

    if (!event.approved) {
      event.approved = true;
      await event.save();
    }

    revalidateTag("events", { expire: 0 });
    revalidateTag(slug, { expire: 0 });

    return NextResponse.json(
      { message: "Event approved successfully", event },
      { status: 200 }
    );
  } catch (error) {
    console.error({ error });
    const anyError = error as any;
    const status =
      typeof anyError?.statusCode === "number" ? anyError.statusCode : 500;
    const message =
      error instanceof Error && error.name === "HttpError"
        ? error.message
        : "Internal Server Error";

    return NextResponse.json({ message }, { status });
  }
}
