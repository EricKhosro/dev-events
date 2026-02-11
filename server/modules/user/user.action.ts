"use server";

import { AuthTokenCookieName } from "@/shared/constants/cookie.constant";
import { IUser } from "@/shared/types/auth.types";
import { JwtPayload, verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { UserService } from "./user.service";
import { UserMessages } from "./user.message";
import { AuthError } from "./user.errors";
import { redirect } from "next/navigation";
import { Role } from "@/shared/constants/constant";

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY!;

export const getUserInfo = async (): Promise<IUser & { _id: string }> => {
  const cookiesInstance = await cookies();
  const authToken = cookiesInstance.get(AuthTokenCookieName)?.value.toString();
  if (!authToken) throw new AuthError(UserMessages.Unauthorized, 401);

  let decodedToken: JwtPayload;
  try {
    decodedToken = verify(authToken, JWT_PRIVATE_KEY) as JwtPayload;
  } catch (error) {
    console.log("Token verification failed", error);
    throw new AuthError(UserMessages.Unauthorized, 401);
  }

  if (!decodedToken?.email) {
    throw new AuthError(UserMessages.Unauthorized, 401);
  }

  const user = await UserService.findByEmail(decodedToken.email);
  if (!user) throw new AuthError(UserMessages.NotFound, 401);

  const { _id, email, avatar, username, role } = user;

  return { _id: (_id as any).toString(), email, avatar, username, role };
};

export async function requireAuth(redirectURL?: string): Promise<IUser> {
  const token = (await cookies()).get(AuthTokenCookieName)?.value;
  const destination = redirectURL ? `/auth?redirect=${redirectURL}` : "/auth";
  if (!token) {
    redirect(destination);
  }

  const decoded = verify(token, JWT_PRIVATE_KEY) as IUser | null;

  if (!decoded?.email) {
    redirect(destination);
  }

  const user = await UserService.findByEmail(decoded.email);

  if (!user) {
    redirect(destination);
  }

  return {
    _id: user._id,
    email: user.email,
    username: user.username,
    avatar: user.avatar,
    role: user.role,
  };
}

export const getSafeUserInfo = async (): Promise<IUser | null> => {
  try {
    const user = await getUserInfo();
    return user;
  } catch {
    return null;
  }
};

export const requireAdmin = async () => {
  const token = (await cookies()).get(AuthTokenCookieName)?.value;

  if (!token) {
    throw new AuthError(UserMessages.Unauthorized, 401);
  }

  let payload: { email: string };

  try {
    payload = verify(token, JWT_PRIVATE_KEY) as typeof payload;
  } catch {
    throw new AuthError(UserMessages.Unauthorized, 401);
  }

  const user = await UserService.findByEmail(payload.email);

  if (!user) {
    throw new AuthError(UserMessages.Unauthorized, 401);
  }

  if (user.role !== Role.Admin) {
    throw new AuthError(UserMessages.Forbidden, 403);
  }

  return user;
};
