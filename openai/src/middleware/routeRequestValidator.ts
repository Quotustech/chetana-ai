import ErrorHandler from '../utils/ErrorHandler';
import express, { Request, Response, NextFunction } from 'express';
import Joi, { Schema } from 'joi';

export const validateRouteRequest = ({schema}: {schema:Schema})=>{
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        // console.log('Error from validator' , error)
        if (error) {
            // return res.status(400).json({ error: error.details[0].message });
            const err = new ErrorHandler( error.details[0].message , 400)
            return next(err);
        }
        next();
    };
}