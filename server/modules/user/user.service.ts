import createHttpError from "http-errors";
import { hash, genSalt, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { UserMessages } from "./user.message";
import { UserRepository } from "./user.repository";
import { UserSchema } from "./user.model";

export const UserService = {
  async login(username: string, password: string) {
    const user = await UserRepository.findByUsername(username);

    if (!user) {
      throw createHttpError.NotFound(UserMessages.NotFound);
    }

    const validPassword = await compare(password, user.password);
    if (!validPassword) {
      throw createHttpError.NotFound(UserMessages.InvalidCredentials);
    }

    return this.generateAppToken(user);
  },

  async register(
    email: string,
    password: string,
    rePassword: string,
    username: string,
  ) {
    await this.checkUnique(email, username);

    if (password !== rePassword) {
      throw createHttpError.BadRequest(UserMessages.NotSamePasswords);
    }

    const hashedPassword = await hash(password, await genSalt(10));

    const newUser = await UserRepository.create({
      email,
      username,
      password: hashedPassword,
    });

    return newUser.email;
  },

  async registerWithOAuth(email: string): Promise<UserSchema> {
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) return existingUser;

    return UserRepository.create({ email, password: "" });
  },

  generateAppToken(user: UserSchema) {
    const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
    if (!PRIVATE_KEY) {
      throw createHttpError.InternalServerError();
    }

    const { email, username, _id, role, avatar } = user;

    return sign({ email, username, _id, role, avatar }, PRIVATE_KEY);
  },

  async checkUnique(email: string, username: string) {
    const existing = await UserRepository.findForUniqueness(email, username);

    if (!existing) return true;

    if (existing.email === email) {
      throw createHttpError.Conflict(UserMessages.EmailExists);
    }

    if (existing.username === username) {
      throw createHttpError.Conflict(UserMessages.UsernameExists);
    }
  },

  async findByEmail(email: string) {
    return UserRepository.findByEmail(email);
  },

  async findByUsername(username: string) {
    return UserRepository.findByUsername(username);
  },
};
