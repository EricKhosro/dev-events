import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { EventService } from "@/server/modules/event/event.service";
import {
  getUserInfo,
  getSafeUserInfo,
} from "@/server/modules/user/user.action";
import { Role } from "@/shared/constants/constant";
import { CreateEventSchema } from "@/server/modules/event/event.zod";

export async function POST(req: NextRequest) {
  try {
    const userInfo = await getUserInfo();
    if (!userInfo) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const rawData = Object.fromEntries(formData.entries());

    const parsed = CreateEventSchema.safeParse(rawData);
    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const file = formData.get("image");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 }
      );
    }

    const { tags, agenda, ...eventData } = parsed.data;

    const createdEvent = await EventService.createEvent(
      eventData,
      file,
      tags,
      agenda,
      userInfo
    );

    revalidateTag("events", { expire: 0 });

    return NextResponse.json(
      { message: "Event Created Successfully", event: createdEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create event failed:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    try {
      const url = new URL(req.url);
      const pendingParam = url.searchParams.get("pending");
      const user = await getSafeUserInfo();
      const isAdmin = !!user && user.role === Role.Admin;
      const filter: Record<string, unknown> = {};
      if (isAdmin) {
        // Admins see all events by default; with ?pending=true they see only not-approved ones
        if (pendingParam === "true") {
          filter.approved = false;
        }
      } else {
        // Non-admins can only see approved events
        filter.approved = true;
      }

      const events = await EventService.fetchEvents(filter);
      return NextResponse.json(events, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          message: "Error in Fetching Events",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
