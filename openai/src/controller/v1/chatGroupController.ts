import { NextFunction, Request, Response } from "express";
import ChatGroup from "../../model/chatGroupModel";
import { CatchAsyncError } from "../../middleware/catchAsyncError";
import User from "../../model/userModel";
import ErrorHandler from "../../utils/ErrorHandler";

export const createGroup = CatchAsyncError(
  async (req: Request, res: Response, next:NextFunction) => {
      const id = req.params.userId;
      const user = await User.findById(id);
      if (!user) {
        const err = new ErrorHandler("User not found", 404);
        return next(err);
      }
      const group = new ChatGroup({ user: id });
      await group.save();
      res.status(201).json({
        success: true,
        message: "Chat group created successfully.",
        data: group
      });
  }
);
export const getAllGroup = CatchAsyncError(
  async (req: Request, res: Response , next:NextFunction) => {
      const groups = await ChatGroup.find({});
      if (!groups || groups.length === 0) {
        const err = new ErrorHandler("Groups are not found", 404);
        return next(err);
      }
      res.status(200).json({
        success: true,
        message: 'Groups retrieved successfully.',
        data: groups
      });
  }
);

export const getUserGroups = CatchAsyncError(
  async (req: Request, res: Response , next:NextFunction) => {
      const id = req.params.userId;
      const user = await User.findById(id);
      if (!user) {
        const err = new ErrorHandler("User not found", 404);
        return next(err);
      }
      const groups = await ChatGroup.find({ user: id }).sort(
        "-createdAt"
      );
      if (!groups || groups.length === 0) {
        const err = new ErrorHandler("Groups are not found", 404);
        return next(err);
      }
      res.status(200).json({
        success: true,
        message: 'Groups retrieved successfully.',
        data: groups
      });
  }
);
