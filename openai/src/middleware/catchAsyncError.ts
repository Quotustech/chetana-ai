import { NextFunction, Request, Response } from "express";

export const CatchAsyncError =
  (theFunc: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.resolve(theFunc(req, res, next));
    } catch (error) {
      next(error);
    }
  };
