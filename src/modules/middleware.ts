import {Request, Response, NextFunction } from "express";
import {validationResult} from "express-validator";

export const  handelInputError = (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if (!error.isEmpty()){
        res.status(400).json({
            "message": "Bad Request",
            "errors": error.array(),
        })
    } else {
        next();
    }
};