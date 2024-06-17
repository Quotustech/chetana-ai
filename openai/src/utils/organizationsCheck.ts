import { NextFunction } from "express";
import User from "../model/userModel";
import { Jwt } from "jsonwebtoken";

export const statusChedker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
