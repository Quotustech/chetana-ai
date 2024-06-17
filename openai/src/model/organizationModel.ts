import mongoose, { Document, Schema } from "mongoose";
import User, { IUser } from "./userModel";

interface IOrganization extends Document {
  name: string;
  phoneNumber: number;
  email: string;
  password: string;
}

const capitalizeName = (name: string) => {
  return name.replace(/\b\w/g, (match) => match.toUpperCase());
};

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const organizationSchema: Schema<IOrganization> = new Schema(
  {
    name: {
      type: String,
      required: true,
      set: capitalizeName,
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /^\d{10}$/.test(value);
        },
        message: (props) =>
          `${props.value} is not a valid 10-digit phone number!`,
      },
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
  },
  {
    timestamps: true,
  }
);
organizationSchema.pre<IOrganization>("save", async function (next) {
  try {

    const user: IUser = new User({
      name: this.name,
      email: this.email,
      password: this.password,
      role: "admin",
      status: "approved",
    });

    await user.save();

    next();
  } catch (error: any) {
    await User.deleteOne({ email: this.email });
    console.error("User save error:", error);
    next(error);
  }
});

const Organization = mongoose.model<IOrganization>(
  "Organization",
  organizationSchema
);
export default Organization;
