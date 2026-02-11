import { UserService } from "@/server/modules/user/user.service";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import cookie from "cookie";
import { errorHandler } from "@/server/middlewares/errorHandler";
import {
  AuthTokenCookieName,
  CookieOptions,
} from "@/shared/constants/cookie.constant";

export const GET = async (req: NextRequest) => {
  const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY!;
  try {
    const token: any = await getToken({ req, secret: JWT_PRIVATE_KEY });
    if (!token?.email) {
      return NextResponse.redirect("/auth?error=NoEmail");
    }

    const user = await UserService.registerWithOAuth(token.email);

    const appToken = UserService.generateAppToken(user);

    const cookieHeader = cookie.serialize(
      AuthTokenCookieName,
      appToken,
      CookieOptions
    );
    const url = new URL(req.url);
    return NextResponse.redirect(`${url.origin}/`, {
      headers: { "Set-Cookie": cookieHeader },
    });
  } catch (error) {
    return errorHandler(error);
  }
};
