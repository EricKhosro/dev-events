import connectDB from "@/server/db/mongodb";
import User, { UserLean, UserSchema } from "./user.model";

export const UserRepository = {
  async findByEmail(email: string) {
    await connectDB();
    return User.findOne({ email });
  },

  async findByUsername(username: string) {
    await connectDB();
    return User.findOne({ username });
  },

  async findForUniqueness(email: string, username: string) {
    await connectDB();
    return User.findOne({
      $or: [{ email }, { username }],
    }).lean<UserLean>();
  },

  async create(data: Partial<UserSchema>) {
    await connectDB();
    return User.create(data);
  },
};
