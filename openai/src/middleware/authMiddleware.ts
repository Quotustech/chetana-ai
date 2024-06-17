import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../model/userModel";
import { IAuthorizedRoles } from "@utils/interfaces/authorizedUser";
import ErrorHandler from "../utils/ErrorHandler";

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
  }
}

const secretKey = process.env.JWT_SECRET_KEY;

export const authCheck = ({roles}:IAuthorizedRoles)=>{
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];
    if (!token) {
      const err = new ErrorHandler( "Missing token" , 401)
        return next(err);
    }
  
    const tokenWithoutBearer = token.split(" ")[1];
  
    try {
      const decoded = (await jwt.verify(
        tokenWithoutBearer,
        secretKey
      )) as JwtPayload;
  
      if (!decoded) {
        // return res.status(401).json({ error: "Invalid token" });
        // console.log(decoded)
        const err = new ErrorHandler( "Invalid token" , 401)
        return next(err);
      }

      if (!roles.includes(decoded.role)) {
        // return res.status(401).json({ error: "User unauthorized" });
        const err = new ErrorHandler( "User unauthorized" , 401)
        return next(err);
      }

      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        // return res.status(401).json({ error: "Token has expired" });
        const err = new ErrorHandler( "Token has expired" , 401)
        return next(err);
      }

      const freshUser: IUser | null = await User.findById(decoded.userId);
  
      if (!freshUser) {
        // return res.status(401).json({ error: "Please verify" });
        const err = new ErrorHandler( "Please verify" , 401)
        return next(err);
      }
    
      req.user = freshUser;
      next();
    } catch (error: any) {
      console.log("error in token verification", error);
      if (error.name === "TokenExpiredError") {
        // return res.status(401).json({ error: "Token has expired" });
        const err = new ErrorHandler( "Token has expired" , 401)
        return next(err);
      }
      // return res.status(401).json({ error: "Token verification failed" });
      const err = new ErrorHandler( "Token verification failed" , 401)
        return next(err);
    }
  };
}

