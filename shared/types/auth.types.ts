import { Types } from "mongoose";
import { Role } from "../constants/constant";

export interface ILoginDTO {
  username: string;
  password: string;
}

export interface IRegisterDTO extends ILoginDTO {
  email: string;
  password: string;
  username: string;
  rePassword: string;
}

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  username: string;
  avatar: string | null;
  role: Role;
}
