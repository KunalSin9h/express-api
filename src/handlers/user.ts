import prisma from "../db";
import { comparePassword, createJWT, hashPassword } from "../modules/auth";
import { NextFunction, Request, Response } from "express";

export const createNewUser =  async (req: Request , res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await prisma.user.create({
            data: {
                username: req.body.username,
                password: await hashPassword(req.body.password)
            }
        });
        const token = createJWT(user);
        res.status(200);
        res.json({token});
    } catch (e) {
        // @ts-ignore
        e.type = "input";
        next(e);
    }

};

export const signIn = async (req: Request, res: Response): Promise<void> => {
    const user = await prisma.user.findUnique({
        where: {
            username: req.body.username,
        }
    });
    if (!user) {
        res.status(404).json({
            message: "Not Found",
        });
    } else {
        const isValid = await comparePassword(req.body.password, user.password);
        if (!isValid){
            res.status(401).json({
                message: "Not Authorized",
            });
            return;
        }
        const token = createJWT(user);
        res.status(200).json({token});
    }
}