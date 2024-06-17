import mongoose, { Document, Schema, Types } from "mongoose";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
  _id:  Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "superadmin" | "admin" | "user" | "deptadmin";
  status?: "pending" | "approved" | "rejected";
  organization?: mongoose.Schema.Types.ObjectId;
  department?: mongoose.Schema.Types.ObjectId;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["superadmin", "admin", "user", "deptadmin"],
      default: "superadmin",
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization'
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
