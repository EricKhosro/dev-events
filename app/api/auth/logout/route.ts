import { NextRequest, NextResponse } from "next/server";
import {
  AuthTokenCookieName,
  CookieOptions,
} from "@/shared/constants/cookie.constant";

export async function POST(req: NextRequest) {
  const expiredCookie = `${AuthTokenCookieName}=; Path=${
    CookieOptions.path
  }; Max-Age=0; HttpOnly; ${
    CookieOptions.secure ? "Secure; " : ""
  }SameSite=Lax`;

  return new NextResponse(null, {
    status: 200,
    headers: {
      "Set-Cookie": expiredCookie,
    },
  });
}
