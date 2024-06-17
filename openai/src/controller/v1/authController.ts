import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../model/userModel";
import Organization from "../../model/organizationModel";
import crypto from "crypto";
import { CatchAsyncError } from "../../middleware/catchAsyncError";
import queue from "../../config/kue";
import { Job } from "kue";
import startEmailProcessing from "../../workers/email_worker";
import ErrorHandler from "../../utils/ErrorHandler";

const secretKey = process.env.JWT_SECRET_KEY;
const tokenExpiration = 3600;

export const Register = CatchAsyncError(async (req: Request, res: Response , next: NextFunction) => {
    const { name, email, password ,organization , department } =
      req.body;

    const existingOrg = await Organization.findById(organization);
    if (!existingOrg) {
        const err = new ErrorHandler("Invalid organization id", 400);
        return next(err);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const err = new ErrorHandler("User already exists", 400);
      return next(err);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      role: "user",
      password: hashedPassword,
      organization,
      department,
    });

    const savedUser = await newUser.save();

    return res
      .status(201)
      .json({
        success: true,
        data: savedUser, 
        message: "User registered successfully" 
      });
});

export const Login = CatchAsyncError(async (req: Request, res: Response , next:NextFunction) => {
    const { email, password } = req.body;
    // Find the user
    const user = await User.findOne({ email });
    // console.log("user with email",user)
    if (!user) {
      const err = new ErrorHandler("Invalid credentials", 401);
        return next(err);
    } else if (
      user.status !== "approved" &&
      (user.role === "user" || user.role === "deptadmin")
    ) {
      const err = new ErrorHandler("User is not approved", 401);
        return next(err);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      const err = new ErrorHandler("Invalid credentials", 401);
        return next(err);
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      secretKey,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
        success: true,
       data: token, 
       message: "User login successfully" });
});

export const forgetPassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
      const { email } = req.body;

      const user = await User.findOne({ email: email });

      if (!user) {
        const err = new ErrorHandler("User not found", 404);
        return next(err);
      }

      const resetToken = crypto.randomBytes(20).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + tokenExpiration * 1000);

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpiry;
      await user.save();

      const resetLink = `http://techmatebot.com/reset-password/${resetToken}`;
      const emailOptions = {
        email: user.email,
        subject: "Password Reset",
        data: { user, resetLink },
        template: "reset-password.ejs",
      };

      // console.log("Reset Token Expiry:", resetTokenExpiry);
      // console.log("Received Reset Token:", resetToken);

      const job: Job = queue.create("forgotPasswordEmails", emailOptions);

      // Save the job to the queue
      job.save((err: Error) => {
        if (err) {
          console.log("Error in sending the job to the queue:", err);
        } else {
          startEmailProcessing("forgotPasswordEmails");
          console.log("Job enqueued:", job.id);
        }
      });

      return res.status(200).json({
        data: null,
        success: true,
        message: "Reset token send successfully",
      });
    } 
);

export const resetPassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
      const { token, newPassword } = req.body;
      // console.log("Received Reset Token:", token);

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      // console.log("User Found:", user);
      if (!user) {
        console.log("User not found or token expired");
        const err = new ErrorHandler("User not found", 400);
        return next(err);
      }
      // Reset token expiry validation
      const resetTokenExpiry = new Date(user.resetPasswordExpires);

      if (resetTokenExpiry <= new Date()) {
        // console.log("Token expired");
        const err = new ErrorHandler("Invalid or expired token", 400);
        return next(err);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      const emailOptions = {
        email: user.email,
        subject: "Password Reset Successful",
        data: { user },
        template: "reset-success.ejs",
      };
      const job: Job = queue.create(
        "passwordResetSuccessfulEmails",
        emailOptions
      );

      // Save the job to the queue
      job.save((err: Error) => {
        if (err) {
          console.log("Error in sending the job to the queue:", err);
        } else {
          startEmailProcessing("passwordResetSuccessfulEmails");
          console.log("Job enqueued:", job.id);
        }
      });

      return res.status(200).json({success: true, data: null, message: "Password reset successfully" });
  }
);
