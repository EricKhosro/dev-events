import * as z from "zod";
import { UserMessages } from "./user.message";

export const RegisterSchema = z
  .object({
    email: z.email(UserMessages.InvalidEmail).max(100),
    username: z
      .string(UserMessages.UsernameRequired)
      .trim()
      .min(3, UserMessages.UsernameMin)
      .max(30, UserMessages.UsernameMax),
    password: z
      .string(UserMessages.PasswordRequired)
      .min(3, UserMessages.PasswordMin)
      .max(30, UserMessages.PasswordMax),
    rePassword: z.string(UserMessages.PasswordRequired),
  })
  .refine((data) => data.password === data.rePassword, {
    error: UserMessages.PasswordNotMatch,
  });

export const LoginSchema = z.object({
  username: z.string(UserMessages.UsernameRequired).trim(),
  password: z.string(UserMessages.PasswordRequired),
});
