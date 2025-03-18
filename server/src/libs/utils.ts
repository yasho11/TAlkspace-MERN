import jwt from 'jsonwebtoken';
import { Response } from 'express';

//this function generates a token for the user
export const generateToken = (Userid: string, res: Response) => {
    const token = jwt.sign({ Userid }, process.env.JWT_SECRET as string, { //this generates the token
        expiresIn: "7d",
    });

    res.cookie("jwt", token, { //this sets the cookie in the browser
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
        httpOnly: true, //prevents client side js from accessing the cookie
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development", //cookie only works in https
    });

    return token
}