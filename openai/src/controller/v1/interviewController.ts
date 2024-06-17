import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../../middleware/catchAsyncError";
import { MulterRequest } from "../../middleware/uploadMulterMiddleware";
import { convertToAudio } from "../../utils/interview/videoToAudioConvertor";
import { audioToText, IAudioToText } from "../../utils/interview/audioToText";
import { deleteFiles } from "../../utils/interview/deleteMediaFiles";
import Job from "../../model/jobRoleModel";
import Question from "../../model/questionModel";
import ErrorHandler from "../../utils/ErrorHandler";

// import { audioToText } from "@utils/interview/audioToText";
import mongoose from "mongoose";


export const submitVideo = CatchAsyncError(
    async (req: MulterRequest, res: Response, next: NextFunction) => {
        const fileName = req.body.fileName;
        const isAudio = await convertToAudio(fileName);
        if (!isAudio) {
            console.log("Audio extract failed");
            const err = new ErrorHandler("Submit audio failed", 403)
            return next(err);
        }
        // audio extracted successfully & now send to whisper to extract text
        const data: IAudioToText = await audioToText(fileName);
        if (!data.isTextConverted) {
            const err = new ErrorHandler("Failed in extracting text from  audio.", 403)
            return next(err);
        }

        res.status(200).json({ success: true, message: "Text extracted successfully", text: `${data.text}` });

        // text extraction done & now delete files (both audio & video)
        deleteFiles(fileName);
    }
)


export const createJobRole = CatchAsyncError(
    async (req: Request, res: Response, next:NextFunction) => {
        const { jobName, description } = req.body;
            const jobRole = jobName.replace(/[^a-zA-Z]/g, '') // Remove special characters
                .replace(/\s+/g, '')      // Remove spaces
                .toLowerCase();
            const isRoleExists = await Job.findOne({jobRole});
            if (isRoleExists) {
                const err = new ErrorHandler("Job role already exists", 400)
                return next(err);
            }
            const newJobRole = new Job({
                jobName,
                jobRole,
                description : description || ""
            });
            await newJobRole.save()
            return res.json({
                message: "New job role created",
                success: true,
                data: newJobRole
            })
    }
)


export const getAllJobRoles = CatchAsyncError(
    async (req: Request, res: Response) => {
        const jobRoles = await Job.find();
        return res.status(200).json({
            message: "All job roles sent",
            success: true,
            data: jobRoles
        })
    }
)

export const getJobRoleById = CatchAsyncError(
    async (req: Request, res: Response, next:NextFunction) => {
        const jobRoleId = req.params.id;
        const jobRole = await Job.findById(jobRoleId)

        if (!jobRole) {
            const err = new ErrorHandler("Job role not found", 409)
            return next(err);
        }

        return res.status(200).json({
            message: "Job role sent successfully",
            success: true,
            data: jobRole
        })
    }
)

export const updateJobRole = CatchAsyncError(
    async (req: Request, res: Response, next:NextFunction) => {
        const jobRoleId = req.params.id;
        let { jobName, description } = req.body;
        if (!jobName && !description) {
            const err = new ErrorHandler("Job name or description is missing.", 400)
            return next(err)
        }

        const updatedJobRole = await Job.findByIdAndUpdate(jobRoleId, req.body, { new: true });
        if (!updatedJobRole) {
            const err = new ErrorHandler("Job role not found.", 409)
            return next(err);
        }

        return res.status(200).json({
            message: "Job role updated successfully",
            success: true,
            data: updatedJobRole
        })
    }
)

export const deleteJobRoleById = CatchAsyncError(
    async (req: Request, res: Response, next:NextFunction) => {
        const jobId = req.params.id;
        const deletedJobRole = await Job.findByIdAndDelete(jobId);
        await Question.deleteMany({job: jobId})
        
        if (!deletedJobRole) {
            const err = new ErrorHandler("Job role not found", 409)
            return next(err)
        }

        return res.json({
            message: "Job role deleted successfully",
            success: true,
            data: deletedJobRole
        })
    }
)

export const createQuestion = CatchAsyncError(
    async (req: Request, res: Response, next:NextFunction) => {
        const jobRoleId = req.body.jobRoleId;
        const question = req.body.question;

        if (!mongoose.Types.ObjectId.isValid(jobRoleId)) {
            const err = new ErrorHandler("Invalid mongo Id", 400)
            return next(err);
        }
        // make sure that job role id exists before creating any questions
        const findJobRole = await Job.findById(jobRoleId);
        if (!findJobRole) {
            const err = new ErrorHandler("Job role not found", 409)
            return next(err);
        }
        const newQuestion = new Question({
            job: jobRoleId,
            question
        });
        await newQuestion.save();
        return res.status(200).json({
            message: "Question created successfully.",
            success: true,
            data: newQuestion
        })
    }
)

export const getAllQuestionByJobId = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        const jobRoleId = req.params.jobroleid;
        const jobDetails = await Job.findById(jobRoleId);
        
        if (!jobDetails) {
            const err = new ErrorHandler("Job not found", 409)
            return next(err)
        }
        const questions = await Question.find({ job: jobRoleId });

        if (!questions) {
            const err = new ErrorHandler("Question not found", 409)
            return next(err)
        }
        return res.status(200).json({
            message: "Question sent successfully.",
            success: true,
            data: questions
        })
    }
)

export const deleteQuestionById = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        const questionId = req.params.id;
        const deletedQuestion = await Question.findByIdAndDelete(questionId);

        if (!deletedQuestion) {
            const err = new ErrorHandler("Question not found", 409)
            return next(err)
        }
        return res.status(200).json({
            message: "Question deleted successfully.",
            success: true,
            data: deletedQuestion
        })
    }
)