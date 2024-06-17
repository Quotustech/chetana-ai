import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";


export const checkValidMongoId = (req: Request, res: Response, next: NextFunction) => {
    try {
        const paramId = req.params?.id || req.params?.jobroleid;
        if (!paramId) {
            return res.status(400).json({
                message: "Id missing in request parameter",
                success: false,
                data: null
            })
        }
        if (!mongoose.Types.ObjectId.isValid(paramId)) {
            return res.status(400).json({
                message: "Invalid mongo Id in params",
                success: false,
                data: null
            })
        }
        next();
    } catch (error) {
        console.log("------ Internal server error occurred. ----", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            data: null
        })
    }
}