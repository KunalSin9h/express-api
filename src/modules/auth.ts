import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import config from "../config";

export const comparePassword = (password: string, hashPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashPassword);
}

export const hashPassword = (password: string): Promise<string> => {
    return bcrypt.hash(password, 5);
}

export const createJWT = (user: User) => {
    const token = jwt.sign({
        id: user.id,
        username: user.username,
    }, config.jwt);
    return token;
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;

    if (!bearer) {
        res.status(401).json(
            {
                message: "Not Authorized",
            }
        );
        return;
    }

    const [, token] = bearer.split(" ");

    if (!token){
        res.status(401).json(
            {
                message: "Not Valid Token (1)",
            }
        );
        return;
    }

    try {

        const user = jwt.verify(token, config.jwt)
        // @ts-ignore
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json(
            {
                message: "Not Valid Token (2)",
            }
        );
        return;
    }

};