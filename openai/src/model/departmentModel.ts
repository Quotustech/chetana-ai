import mongoose, { Document, Schema } from "mongoose";
import User, { IUser } from "./userModel";

interface IDepartment extends Document {
  name: string;
  deptHeadName: string;
  email: string;
  password: string;
  apiKey: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  chatGptModel: string;
  organization: mongoose.Schema.Types.ObjectId;
}

const capitalizeName = (name: string) => {
  return name.replace(/\b\w/g, (match) => match.toUpperCase());
};

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const departmentSchema: Schema<IDepartment> = new Schema(
  {
    name: {
      type: String,
      required: true,
      set: capitalizeName,
    },
    deptHeadName: {
      type: String,
      set: capitalizeName,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    apiKey: {
      type: String,
      default: null,
    },
    chatGptModel: {
      type: String,
      default: null,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
  },
  {
    timestamps: true,
  }
);

departmentSchema.pre<IDepartment>("save", async function (next) {
  try {
    const user: IUser = new User({
      email: this.email,
      password: this.password,
      name: this.deptHeadName,
      role: "deptadmin",
      status: this.status,
      deptName: this.name,
      organization: this.organization
    });

    await user.save();
    next();
  } catch (error: any) {
    console.error("User save error:", error);
    next(error);
  }
});

const Department = mongoose.model("Department", departmentSchema);
export default Department;
