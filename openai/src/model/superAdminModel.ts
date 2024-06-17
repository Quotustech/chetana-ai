import mongoose, { Document, Schema } from "mongoose";
import User, { IUser } from "./userModel";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ISuperAdmin extends Document {
  email: string;
  password: string;
  name: string;
  role: "superadmin";
}

const superadminSchema: Schema<ISuperAdmin> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
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
      enum: ["superadmin"],
      default: "superadmin",
    },
  },
  {
    timestamps: true,
  }
);

superadminSchema.pre<ISuperAdmin>("save", async function (next) {
  try {
    const user: IUser = new User({
      email: this.email,
      password: this.password,
      role: this.role,
      name: this.name,
      status: "approved",
    });

    await user.save();
    next();
  } catch (error: any) {
    console.error("User save error:", error);
    next(error);
  }
});

const SuperAdmin = mongoose.model<ISuperAdmin>("SuperAdmin", superadminSchema);
export default SuperAdmin;
