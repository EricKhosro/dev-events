import { errorHandler } from "@/server/middlewares/errorHandler";
import { UserMessages } from "@/server/modules/user/user.message";
import { UserService } from "@/server/modules/user/user.service";
import { RegisterSchema } from "@/server/modules/user/user.zod";
import { SharedMessages } from "@/shared/utils/shared.messages";
import createHttpError from "http-errors";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    if (!body) throw createHttpError.BadRequest(SharedMessages.BodyRequired);
    const parsedBody = RegisterSchema.safeParse(body);
    if (!parsedBody.success)
      return NextResponse.json(
        { errors: parsedBody.error.issues.flat() },
        { status: 400 }
      );

    const { email, password, rePassword, username } = parsedBody.data;
    const user = await UserService.register(
      email,
      password,
      rePassword,
      username
    );
    return NextResponse.json(
      { message: UserMessages.Register, user },
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
};
