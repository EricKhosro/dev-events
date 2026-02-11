import { NextRequest, NextResponse } from "next/server";
import { AuthTokenCookieName } from "@/shared/constants/cookie.constant";
import { IUser } from "@/shared/types/auth.types";
import { decode } from "jsonwebtoken";
import { UserService } from "@/server/modules/user/user.service";
import createHttpError from "http-errors";
import { UserMessages } from "@/server/modules/user/user.message";
import { Types } from "mongoose";

export const GET = async (
  req: NextRequest
): Promise<NextResponse<IUser | null>> => {
  const authToken = req.cookies.get(AuthTokenCookieName)?.value.toString();
  if (!authToken) return NextResponse.json(null, { status: 404 });
  const decodedToken: any = decode(authToken);
  const user = await UserService.findByEmail(decodedToken.email);
  if (!user) throw createHttpError.NotFound(UserMessages.NotFound);

  return NextResponse.json({
    email: user.email,
    username: user.username,
    avatar: user.avatar,
    role: user.role,
    _id: user._id as Types.ObjectId,
  });
};
