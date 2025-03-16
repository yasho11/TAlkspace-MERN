import jwt from 'jsonwebtoken';
import { Response } from 'express';


export const generateToken = (Userid: string, res: Response) => {
    const token = jwt.sign({ Userid }, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, //prevents client side js from accessing the cookie
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
    });

    return token
}