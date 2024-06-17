import { NextFunction, Request, Response } from "express";
import User from "../../model/userModel";
import { CatchAsyncError } from "../../middleware/catchAsyncError";
import bcrypt from "bcryptjs";
import Organization from "../../model/organizationModel";
import Department from "../../model/departmentModel";
import ErrorHandler from "../../utils/ErrorHandler";

export const createUser = CatchAsyncError(
  async (req: Request, res: Response , next:NextFunction) => {
        const { name, email, role, password } = req.body;
        
        const isSuperAdmin = req.user?.role === "superadmin";
        if (!isSuperAdmin) {
          const err = new ErrorHandler("You are not authorized to create user", 401);
          return next(err);
        }
        const user = await User.findOne({email});
        if(user){
          const err = new ErrorHandler("Email is already in use.", 409);
          return next(err);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          name,
          email,
          password: hashedPassword,
          role,
        });
        // console.log(newUser.status, "_____________________");
        newUser.status = isSuperAdmin ? "approved" : "pending";

        const savedUser = await newUser.save();
        res.status(200).json({
          success: true,
          message: "User created successfully",
          data: savedUser,
        });
  }
);

// Update a user
export const updateUser = CatchAsyncError(
  async (req: Request, res: Response , next:NextFunction) => {
      const userId = req.params.id;
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
      });
      if (!updatedUser) {
        const err = new ErrorHandler("User not found", 404);
          return next(err);
      }
      res.status(200).json({
        success: true,
        message: "User updated successfully.",
        data: updatedUser
      });
  }
);

// Delete a user
export const deleteUser = CatchAsyncError(
  async (req: Request, res: Response , next: NextFunction) => {
      const userId = req.params.id;
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        const err = new ErrorHandler("User not found", 404);
          return next(err);
      }
      res.status(200).json({
        success: true,
         message: "User deleted successfully",
        data: deletedUser
      });
  }
);

// Get a specific user
export const getUserById = CatchAsyncError(
  async (req: Request, res: Response , next:NextFunction) => {
      const userId = req.params.id;
      const user = await User.findById(userId).populate('organization').populate('department');
      if (!user) {
        const err = new ErrorHandler("User not found", 404);
          return next(err);
      }
      res.status(200).json({
        success: true,
        message: "User retrieved successfully.",
        data: user
      });
  }
);

// Get all users
export const getAllUsers = CatchAsyncError(
  async (_req: Request, res: Response) => {
      const users = await User.find({role: 'user'}) .populate('organization').populate('department');
      return res.status(200).json({
        success: true,
        message: "Users retrieved successfully.",
        data: users
      });
  }
);

export const getUsersbyOrganization = CatchAsyncError(
  async (req: Request, res: Response , next: NextFunction) => {
      const orgId = req.params.orgId;

      const organization = await Organization.findById(orgId);
      if(!organization){
        const err = new ErrorHandler("Organization not found", 404);
          return next(err);
      }

      const users = await User.find({ organization: orgId , role: 'user' }).populate('organization').populate('department');

      if (users.length === 0) {
        const err = new ErrorHandler("Users not found", 404);
          return next(err);
      }

      res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: users,
      });
  }
);

export const getUsersbyDepartment = CatchAsyncError(
  async (req: Request, res: Response , next: NextFunction) => {
      const deptId = req.params.deptId;

      const department = await Department.findById(deptId);
      if(!department){
        const err = new ErrorHandler("Department not found", 404);
          return next(err);
      }

      const users = await User.find({ department: deptId }).populate('department').populate('organization');

      if (users.length === 0) {
        const err = new ErrorHandler("Users not found", 404);
          return next(err);
      }

      res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: users,
      });
  }
);
