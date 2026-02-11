/** @jest-environment node */

import { UserMessages } from "./user.message";
import { RegisterSchema } from "./user.zod";

describe("user.zod validation", () => {
  it("checks valid response on invalid email", () => {
    const validation = RegisterSchema.safeParse({
      email: "invalidEmail",
      username: "testUsetname",
      password: "asd123",
      rePassword: "asd123",
    });
    expect(validation.success).toBe(false);
    expect(validation.error).toBeDefined();
    expect(validation.error?.issues[0].message).toBe(UserMessages.InvalidEmail);
  });

  it("checks username error under min char count", () => {
    const validation = RegisterSchema.safeParse({
      email: "asd@asd.com",
      username: "as",
      password: "asd123",
      rePassword: "asd123",
    });

    expect(validation.success).toBe(false);
    expect(validation.error).toBeDefined();
    expect(validation.error?.issues[0].message).toBe(UserMessages.UsernameMin);
  });

  it("checks username error over max char count", () => {
    const validation = RegisterSchema.safeParse({
      email: "asd@asd.com",
      username: "asasasasasasasasasasasasasasasas",
      password: "asd123",
      rePassword: "asd123",
    });

    expect(validation.success).toBe(false);
    expect(validation.error).toBeDefined();
    expect(validation.error?.issues[0].message).toBe(UserMessages.UsernameMax);
  });

  it("checks passwords to be same", () => {
    const validation = RegisterSchema.safeParse({
      email: "asd@asd.com",
      username: "asd",
      password: "asd12",
      rePassword: "asd123",
    });

    expect(validation.error).toBeDefined();
    expect(validation.error?.issues[0].message).toBe(
      UserMessages.PasswordNotMatch,
    );
  });
});
