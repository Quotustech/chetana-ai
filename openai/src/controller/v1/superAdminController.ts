import { Response, Request, NextFunction } from "express";
import SuperAdmin from "../../model/superAdminModel";
import bcrypt from "bcryptjs";
import Department from "../../model/departmentModel";
import User from "../../model/userModel";
import queue from "../../config/kue";
import { Job } from "kue";
import startEmailProcessing from "../../workers/email_worker";
import { CatchAsyncError } from "../../middleware/catchAsyncError";
import ErrorHandler from "../../utils/ErrorHandler";

export const createSuperAdmin = CatchAsyncError(
  async (req: Request, res: Response , next: NextFunction) => {
      const { email, password, role , name } = req.body;
      const exsitMails = await SuperAdmin.findOne({ email });

      if (exsitMails) {
        const err = new ErrorHandler("User already exists", 400);
        return next(err);
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const superAdmin = new SuperAdmin({
        email,
        password: hashedPassword,
        role,
        name
      });

      await superAdmin.save();
      res.status(201).json({ data: superAdmin, success: true , message: 'Super admin created successfully.' });
  }
);

export const getSuperAdminById = CatchAsyncError(
  async (req: Request, res: Response , next:NextFunction) => {
      const { id } = req.params;
      const superAdmin = await SuperAdmin.findById(id)
      // console.log(superAdmin);

      if (!superAdmin) {
        const err = new ErrorHandler("SuperAdmin not found", 404);
        return next(err);
      }

      res.status(200).json({
        success: true,
        message: "Super Admin retrieved successfully.",
        data: superAdmin
      });
  }
);


export const getSuperAdminByEmail = CatchAsyncError(
  async (req: Request, res: Response , next:NextFunction) => {
      const { email } = req.body;
      // console.log('@@!@!@!!@@!@!@!' , req.body)
      const superAdmin = await SuperAdmin.findOne({email})

      if (!superAdmin) {
        const err = new ErrorHandler("SuperAdmin not found", 404);
        return next(err);
      }

      res.status(200).json({
        success: true,
        message: "Super Admin retrieved successfully.",
        data: superAdmin
      });
  }
);

export const updateSuperAdmin = CatchAsyncError(
  async (req: Request, res: Response , next:NextFunction) => {
      const { id } = req.params;
      const updatedData = req.body;

      const superAdmin = await SuperAdmin.findByIdAndUpdate(id, updatedData, {
        new: true,
      });

      if (!superAdmin) {
        const err = new ErrorHandler("SuperAdmin not found", 404);
        return next(err);
      }

      res.status(200).json({
        success: true,
        message: "Super Admin retrieved successfully.",
        data: superAdmin
      });
  }
);

export const deleteSuperAdmin = CatchAsyncError(
  async (req: Request, res: Response , next:NextFunction) => {
      const { id } = req.params;
      const superAdmin = await SuperAdmin.findByIdAndDelete(id);

      if (!superAdmin) {
        const err = new ErrorHandler("SuperAdmin not found", 404);
        return next(err);
      }

      res.status(200).json({
        success: true,
        message: "Super Admin retrieved successfully.",
        data: superAdmin
      });
  }
);

export const approveDepartment = CatchAsyncError(
  async (req: Request, res: Response ,next:NextFunction) => {
      const { departmentId, apiKey, chatGptModel } = req.body;

      const updatedDepartment = await Department.findByIdAndUpdate(
        { _id: departmentId },
        { status: "approved", apiKey, chatGptModel },
        { new: true }
      );
      if (updatedDepartment) {
        await User.findOneAndUpdate(
          { email: updatedDepartment.email },
          { status: "approved" },
          { new: true }
        );
      }else{
        const err = new ErrorHandler("Department not found", 404);
        return next(err);
      }
      const emailOptions = {
        email: updatedDepartment.email,
        subject: "Techmate Department Account Activated",
        template: "department_approve.ejs",
        data: {updatedDepartment},
      };
      // console.log('updated dept' , updatedDepartment)
      // console.log('emailOptions' , emailOptions)

  
    // Create a job
    const job: Job = queue.create('approveDepartmentEmails', emailOptions);
  
    // Save the job to the queue
    job.save((err: Error) => {
        if (err) {
            console.log('Error in sending the job to the queue:', err);
        } else {
          startEmailProcessing('approveDepartmentEmails');
            console.log('Job enqueued:', job.id);
        }
    });
      res.status(200).json({
        success: true,
        message: "Department approved successfully",
        data: updatedDepartment,
      });

  }
);

export const getPendingDepartments = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
      const pendingDepartments = await Department.find({ status: "pending" });

      res.status(200).json({
        success: true,
        message: "Pending departments retrieved successfully",
        data: pendingDepartments
      });
  }
);
