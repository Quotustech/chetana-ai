import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import Department from "../../model/departmentModel";
import Organization from "../../model/organizationModel";
import User from "../../model/userModel";
import queue from "../../config/kue";
import { Job } from "kue";
import startEmailProcessing from "../../workers/email_worker";
import { CatchAsyncError } from "../../middleware/catchAsyncError";
import ErrorHandler from "../../utils/ErrorHandler";

export const createDepartment = CatchAsyncError(
  async (req: Request, res: Response , next:NextFunction) => {
      const {
        deptHeadName,
        email,
        password,
        description,
        name,
        organization
      } = req.body;

      const org = await Organization.findById(organization);
      if(!org){
        const err = new ErrorHandler("Provided orgnization does not exits.", 404);
        return next(err);
      }

      const existingDepartment = await Department.findOne({ email , organization});
      const existingDepartmentByName = await Department.findOne({ name , organization});

      if (existingDepartment) {
        const err = new ErrorHandler("Department with this email already exists.", 404);
        return next(err);
      }

      if (
        existingDepartmentByName &&
        existingDepartmentByName.organization === org._id
      ) {
        const err = new ErrorHandler("Department with this dept name already exists in this Organization.", 404);
        return next(err);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const department = new Department({
        deptHeadName,
        email,
        password: hashedPassword,
        description,
        name,
        organization: org._id,
      });
      await department.save();

      res.status(201).json({
        message: "Department created successfully",
        data: department.populate('organization'),
        success: true,
      });
  }
);

export const getAllDepartments = CatchAsyncError(
  async (req: Request, res: Response , next:NextFunction) => {
      const departments = await Department.find().populate('organization');
      res.status(200).json({
        success: true,
        message: 'Departments retrieved successfully.',
        data: departments
      });
  }
);

export const getDepartmentById = CatchAsyncError(
  async (req: Request, res: Response , next:NextFunction) => {
      const department = await Department.findById(req.params.id);
      if (department) {
        res.status(200).json({
          success: true,
          message: "Department retrieved successfully.",
          data: department
        });
      } else {
        const err = new ErrorHandler("Department not found", 404);
        return next(err);
      }
  }
);

export const getDepartmentByEmail = CatchAsyncError(
  async (req: Request, res: Response , next:NextFunction) => {
      const {email} = req.body;
      const department = await Department.findOne({email});
      if (department) {
        res.status(200).json({
          success: true,
          message: "Department retrieved successfully.",
          data: department
        });
      } else {
        const err = new ErrorHandler("Department not found", 404);
        return next(err);
      }
  }
);

export const getDepartmentsByOrganization = CatchAsyncError(
  async (req: Request, res: Response , next:NextFunction) => {
      const orgId = req.params.orgId;

      const organization = await Organization.findById(orgId);

      if (!organization) {
        const err = new ErrorHandler("Organization not found", 404);
        return next(err);
      }

      const departments = await Department.find({ organization: orgId }).populate('organization');

      res.status(200).json({
        success: true,
        message: "Departments retrieved successfully.",
        data: departments
      });
  }
);

export const updateDepartmentById = CatchAsyncError(
  async (req: Request, res: Response , next:NextFunction) => {
      const updatedDepartment = await Department.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (updatedDepartment) {
        res.status(200).json({
          success: true,
          data: updatedDepartment,
          message: "Department updated successfuly.",
        });
      } else {
        const err = new ErrorHandler("Department not found", 404);
        return next(err);
      }
  }
);

export const deleteDepartmentById = CatchAsyncError(
  async (req: Request, res: Response , next: NextFunction) => {
      const deletedDepartment = await Department.findByIdAndRemove(
        req.params.id
      );
      if (deletedDepartment) {
        await User.findOneAndDelete({ email: deletedDepartment.email });
        res.status(200).json({
          succcess: true,
          message: "Department deleted successfully",
          data: deletedDepartment,
        });
      } else {
        const err = new ErrorHandler("Department not found", 404);
        return next(err);
      }
  }
);

export const approveUser = CatchAsyncError(
  async (req: Request, res: Response , next:NextFunction) => {
      const { userId , deptId , orgId } = req.body;
      // console.log('!!!!!!!!' , { userId , deptId , orgId })
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId, department: deptId, organization: orgId },
        { status: "approved" },
        { new: true }
      ).populate('organization').populate('department');

        if (!updatedUser) {
          const err = new ErrorHandler("User not found", 404);
          return next(err);
        }

        const emailOptions = {
          email: updatedUser.email,
          subject: "Techmate Account Activated",
          template: "activation-mail.ejs",
          data:  updatedUser ,
          
        };

        //   // Create a job
        const job: Job = queue.create("approveUserEmails", emailOptions);

        // Save the job to the queue
        job.save((err: Error) => {
          if (err) {
            console.log("Error in sending the job to the queue:", err);
          } else {
            startEmailProcessing("approveUserEmails");
            console.log("Job enqueued:", job.id);
          }
        });

        return res.status(200).json({
          success: true,
          data: updatedUser,
          message: "User approved successfully and Activation email sent",
        });
  }
);
