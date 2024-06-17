import multer from "multer";
import fs from "fs";
import path from "path";
import { v4 as uuid } from 'uuid';
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export interface MulterRequest extends Request {
    file: any;
}

// multer storage engine & configurations ----
const storage = multer.diskStorage({
    destination: function (req:MulterRequest, file:any, cb:any) {
        // first create directory if not exists
        if (!fs.existsSync("tmp")) {
            fs.mkdirSync("tmp");
        }

        if (!fs.existsSync("tmp/videoUploads")) {
            fs.mkdirSync("tmp/videoUploads");
        }

        if (!fs.existsSync("tmp/extractedAudio")) {
            fs.mkdirSync("tmp/extractedAudio");
        }

        cb(null, 'tmp/videoUploads')
    },
    filename: function (req:MulterRequest, file:any, cb:any) {
        const uniqueFileName = file.fieldname + '-' + Date.now() + "-" + uuid() ;
        req.body.fileName = uniqueFileName;
        cb(null, uniqueFileName + ".webm")
    }
})

const upload = multer({
    storage: storage,
    fileFilter: function (req: MulterRequest, file: any, cb: any) {
        const ext = path.extname(file.originalname);

        if (ext !== ".mkv" && ext !== ".mp4" && ext !== ".webm") {
            return cb(new Error("Invalid video files!"));
        }
        cb(null, true);
    },
}).single("recordedVideo")

export const videoUploadMiddleware = function (req: MulterRequest, res: Response, next: NextFunction) {
    upload(req, res, function (err: any) {
        if (err instanceof multer.MulterError) {
            console.log("--- multer error ---", err);
            const error = new ErrorHandler( "There is problem in uploading video file." , 400)
            return next(error);
        } else if (err) {
            // File related error occurred when uploading.
            console.log("--- Video file upload error ---", err);
            if (err.message === "Invalid video files!") {
                const error = new ErrorHandler("Invalid video formats. .mp4 .webm .mkv are accepted." , 400)
                return next(error);
            }
            const error = new ErrorHandler("Internal Server Error" , 500)
            return next(error);
        }

        // Everything went fine.
        // call next & handover to controller
        next();
    })
}