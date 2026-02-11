import { Role } from "@/shared/constants/constant";
import { IUser } from "@/shared/types/auth.types";
import {
  Document,
  HydratedDocument,
  InferSchemaType,
  model,
  models,
  Schema,
} from "mongoose";

export interface UserSchema extends IUser {
  password: string;
}
export type UserLean = InferSchemaType<typeof UserSchema>; // for .lean()
export type UserDoc = HydratedDocument<UserLean>; // for normal .find()

const UserSchema = new Schema<UserSchema>({
  email: {
    type: String,
    required: [true, "email is required"],
    trim: true,
    maxlength: [100, "email cannot exceed 100 characters"],
    index: true,
  },
  username: {
    type: String,
    required: [true, "username is required"],
    trim: true,
    maxlength: [100, "username cannot exceed 100 characters"],
    index: true,
  },
  avatar: {
    type: String,
    required: false,
    default: null,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
    maxlength: [100, "password cannot exceed 100 characters"],
  },
  role: {
    type: String,
    enum: [Role.User, Role.Admin],
    default: Role.User,
  },
});

const User = models.User || model<UserSchema>("User", UserSchema);

export default User;
