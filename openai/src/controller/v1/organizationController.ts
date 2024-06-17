import { NextFunction, Request, Response } from "express";
import Organization from "../../model/organizationModel";
import bcrypt from "bcryptjs";
import { CatchAsyncError } from "../../middleware/catchAsyncError";
import ErrorHandler from "../../utils/ErrorHandler";

export const createOrganization = CatchAsyncError(
  async (req: Request, res: Response , next:NextFunction) => {
      const { phoneNumber, name, email, password } = req.body;

      const existingOrganizationByEmail = await Organization.findOne({ email });
      const existingOrganizationByName = await Organization.findOne({ name });

      // console.log(existingOrganizationByEmail)

      if (existingOrganizationByEmail) {
        const err = new ErrorHandler("An organization with this email already exists.", 401);
        return next(err);
      }

      if (existingOrganizationByName) {
        const err = new ErrorHandler("An organization with this name already exists.", 401);
        return next(err);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const organization = new Organization({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
      });

      await organization.save();

      return res.status(201).json({
        success: true,
        message: "Organization created successfully",
        data: organization,
      });
  }
);

export const getAllOrganizations = CatchAsyncError(
  async (req: Request, res: Response) => {
      const organizations = await Organization.find();
      res.status(200).json({
        success: true,
        message: "Organizations retrieved successfully.",
        data: organizations
      });
  }
);

export const getOrganizationId = CatchAsyncError(
  async (req: Request, res: Response , next: NextFunction) => {
      const orgId = req.params.id;
      const organization = await Organization.findById(orgId);
      if (!organization) {
        const err = new ErrorHandler("Organization not found", 404);
        return next(err);
      }
      res.status(200).json({
        success: true,
        message: "Organization retrieved successfully.",
        data: organization
      });
  }
);

export const getOrganizationByEmail = CatchAsyncError(
  async (req: Request, res: Response , next:NextFunction) => {
      const {email} = req.body;
      const organization = await Organization.findOne({email});
      if (!organization) {
        const err = new ErrorHandler("Organization not found", 404);
        return next(err);
      }
      res.status(200).json({
        success: true,
        message: "Organization retrieved successfully",
        data: organization
      });
  }
);

export const deleteOrganization = CatchAsyncError(
  async (req: Request, res: Response,next: NextFunction) => {
      const orgID = req.params.id;
      const organization = await Organization.findByIdAndDelete(orgID);
      if (!organization) {
        const err = new ErrorHandler("Organization not found", 404);
        return next(err);
      }
      res.status(200).json({ 
        success: true,
        data: organization,
        message: "Organization deleted successfully" 
      });
  }
);
