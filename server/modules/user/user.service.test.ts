/** @jest-environment node */
import { compare, hash, genSalt } from "bcrypt";
import { UserMessages } from "./user.message";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { UserSchema } from "./user.model";
import { Types } from "mongoose";
import { Role } from "@/shared/constants/constant";
import { sign } from "jsonwebtoken";

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  genSalt: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

jest.mock("./user.repository", () => ({
  UserRepository: {
    findByEmail: jest.fn(),
    findByUsername: jest.fn(),
    findForUniqueness: jest.fn(),
    create: jest.fn(),
  },
}));

const mockedCompare = compare as jest.MockedFunction<
  (
    data: string | Buffer<ArrayBufferLike>,
    encrypted: string,
  ) => Promise<boolean>
>;

const mockedUserRepository = UserRepository as jest.Mocked<
  typeof UserRepository
>;

const mockedHash = hash as jest.MockedFunction<
  (
    data: string | Buffer<ArrayBufferLike>,
    saltOrRounds: string | number,
  ) => Promise<string>
>;

const mockedGenSalt = genSalt as unknown as jest.MockedFunction<
  (rounds?: number) => Promise<string>
>;
const mockedSign = sign as unknown as jest.MockedFunction<
  (payload: object, secretOrPrivateKey: string) => string
>;

const baseUser: UserSchema = {
  _id: new Types.ObjectId(),
  avatar: null,
  email: "asd@asd.com",
  password: "zxc",
  role: Role.User,
  username: "asd",
};

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_PRIVATE_KEY = "test-private-key";
});

describe("login", () => {
  it("throws notFound on missing user", async () => {
    mockedUserRepository.findByUsername.mockResolvedValue(null);
    await expect(UserService.login("asd", "zxc")).rejects.toMatchObject({
      status: 404,
      message: UserMessages.NotFound,
    });

    expect(mockedUserRepository.findByUsername).toHaveBeenCalledWith("asd");
    expect(mockedCompare).not.toHaveBeenCalled();
    expect(mockedSign).not.toHaveBeenCalled();
  });

  it("throws notFound on invalid credentials", async () => {
    mockedUserRepository.findByUsername.mockResolvedValue(baseUser);
    mockedCompare.mockResolvedValue(false);

    await expect(UserService.login("asd", "zxz")).rejects.toMatchObject({
      status: 404,
      message: UserMessages.InvalidCredentials,
    });

    expect(mockedUserRepository.findByUsername).toHaveBeenCalledWith("asd");
    expect(mockedCompare).toHaveBeenCalledWith("zxz", "zxc");
    expect(mockedSign).not.toHaveBeenCalled();
  });

  it("returns token on valid credentials", async () => {
    mockedUserRepository.findByUsername.mockResolvedValue(baseUser);
    mockedCompare.mockResolvedValue(true);
    mockedSign.mockReturnValue("token");

    await expect(UserService.login("asd", "zxc")).resolves.toBe("token");

    expect(mockedUserRepository.findByUsername).toHaveBeenCalledWith("asd");
    expect(mockedCompare).toHaveBeenCalledWith("zxc", "zxc");
    expect(mockedSign).toHaveBeenCalledWith(
      {
        email: baseUser.email,
        username: baseUser.username,
        _id: baseUser._id,
        role: baseUser.role,
        avatar: baseUser.avatar,
      },
      "test-private-key",
    );
  });
});

describe("register", () => {
  it("throws conflict on exsiting email tries to register", async () => {
    mockedUserRepository.findForUniqueness.mockResolvedValue(baseUser);
    await expect(
      UserService.register(
        baseUser.email,
        baseUser.password,
        baseUser.password,
        "newUser",
      ),
    ).rejects.toMatchObject({
      status: 409,
      message: UserMessages.EmailExists,
    });

    expect(mockedUserRepository.findForUniqueness).toHaveBeenCalledWith(
      baseUser.email,
      "newUser",
    );
    expect(hash).not.toHaveBeenCalled();
    expect(mockedUserRepository.create).not.toHaveBeenCalled();
  });

  it("throws conflict on exsiting username tries to register", async () => {
    mockedUserRepository.findForUniqueness.mockResolvedValue(baseUser);
    await expect(
      UserService.register(
        "newEmail@gmail.com",
        baseUser.password,
        baseUser.password,
        baseUser.username,
      ),
    ).rejects.toMatchObject({
      status: 409,
      message: UserMessages.UsernameExists,
    });

    expect(mockedUserRepository.findForUniqueness).toHaveBeenCalledWith(
      "newEmail@gmail.com",
      baseUser.username,
    );
    expect(hash).not.toHaveBeenCalled();
    expect(mockedUserRepository.create).not.toHaveBeenCalled();
  });

  it("throws BadRequest when users passwords don't match", async () => {
    mockedUserRepository.findForUniqueness.mockResolvedValue(null);
    await expect(
      UserService.register(
        baseUser.email,
        baseUser.password,
        "notSamePass",
        baseUser.username,
      ),
    ).rejects.toMatchObject({
      status: 400,
      message: UserMessages.NotSamePasswords,
    });

    expect(mockedUserRepository.findForUniqueness).toHaveBeenCalledWith(
      baseUser.email,
      baseUser.username,
    );
    expect(hash).not.toHaveBeenCalled();
    expect(mockedUserRepository.create).not.toHaveBeenCalled();
  });

  it("registeres a new user and returns email", async () => {
    mockedUserRepository.findForUniqueness.mockResolvedValue(null);
    mockedGenSalt.mockResolvedValue("salt");
    mockedHash.mockResolvedValue("hashed");
    mockedUserRepository.create.mockResolvedValue({
      email: baseUser.email,
    } as UserSchema);

    await expect(
      UserService.register(
        baseUser.email,
        baseUser.password,
        baseUser.password,
        baseUser.username,
      ),
    ).resolves.toBe(baseUser.email);

    expect(mockedGenSalt).toHaveBeenCalledWith(10);
    expect(mockedHash).toHaveBeenCalledWith(baseUser.password, "salt");
    expect(mockedUserRepository.create).toHaveBeenCalledWith({
      email: baseUser.email,
      username: baseUser.username,
      password: "hashed",
    });
  });
});

describe("generateAppToken", () => {
  it("returns signed token when JWT_PRIVATE_KEY is set", () => {
    mockedSign.mockReturnValue("token");

    const token = UserService.generateAppToken(baseUser);

    expect(token).toBe("token");
    expect(mockedSign).toHaveBeenCalledWith(
      {
        email: baseUser.email,
        username: baseUser.username,
        _id: baseUser._id,
        role: baseUser.role,
        avatar: baseUser.avatar,
      },
      "test-private-key",
    );
  });

  it("throws when JWT_PRIVATE_KEY is missing", () => {
    delete process.env.JWT_PRIVATE_KEY;
    let error: unknown;

    try {
      UserService.generateAppToken(baseUser);
    } catch (err) {
      error = err;
    }

    expect(error).toMatchObject({ status: 500 });
  });
});

describe("checkUnique", () => {
  it("returns when no existing user", async () => {
    mockedUserRepository.findForUniqueness.mockResolvedValue(null);

    await expect(UserService.checkUnique("a@a.com", "user")).resolves.toBe(
      true,
    );

    expect(mockedUserRepository.findForUniqueness).toHaveBeenCalledWith(
      "a@a.com",
      "user",
    );
  });

  it("throws conflict on existing email", async () => {
    mockedUserRepository.findForUniqueness.mockResolvedValue(baseUser);

    await expect(
      UserService.checkUnique(baseUser.email, "newuser"),
    ).rejects.toMatchObject({
      status: 409,
      message: UserMessages.EmailExists,
    });

    expect(mockedUserRepository.findForUniqueness).toHaveBeenCalledWith(
      baseUser.email,
      "newuser",
    );
  });

  it("throws conflict on existing username", async () => {
    mockedUserRepository.findForUniqueness.mockResolvedValue(baseUser);

    await expect(
      UserService.checkUnique("new@email.com", baseUser.username),
    ).rejects.toMatchObject({
      status: 409,
      message: UserMessages.UsernameExists,
    });

    expect(mockedUserRepository.findForUniqueness).toHaveBeenCalledWith(
      "new@email.com",
      baseUser.username,
    );
  });
});

describe("registerWithOAuth", () => {
  it("returns existing user when found", async () => {
    mockedUserRepository.findByEmail.mockResolvedValue(baseUser);

    await expect(UserService.registerWithOAuth(baseUser.email)).resolves.toBe(
      baseUser,
    );

    expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(
      baseUser.email,
    );
    expect(mockedUserRepository.create).not.toHaveBeenCalled();
  });

  it("creates user when not found", async () => {
    mockedUserRepository.findByEmail.mockResolvedValue(null);
    mockedUserRepository.create.mockResolvedValue(baseUser);

    await expect(UserService.registerWithOAuth(baseUser.email)).resolves.toBe(
      baseUser,
    );

    expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(
      baseUser.email,
    );
    expect(mockedUserRepository.create).toHaveBeenCalledWith({
      email: baseUser.email,
      password: "",
    });
  });
});

describe("findByEmail / findByUsername", () => {
  it("passes through to repository", async () => {
    mockedUserRepository.findByEmail.mockResolvedValue(baseUser);
    mockedUserRepository.findByUsername.mockResolvedValue(baseUser);

    await expect(UserService.findByEmail(baseUser.email)).resolves.toBe(
      baseUser,
    );
    await expect(UserService.findByUsername(baseUser.username)).resolves.toBe(
      baseUser,
    );

    expect(mockedUserRepository.findByEmail).toHaveBeenCalledWith(
      baseUser.email,
    );
    expect(mockedUserRepository.findByUsername).toHaveBeenCalledWith(
      baseUser.username,
    );

    expect(hash).not.toHaveBeenCalled();
  });
});
