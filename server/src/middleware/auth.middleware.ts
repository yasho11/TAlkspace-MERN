import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/users.model";
import { Types } from "mongoose";

// ✅ Extend Express Request Type
interface AuthRequest extends Request {
    user?: any;  // You can replace `any` with `UserType` if you have a TypeScript type for User
}

export const protectRoute = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        // 1️⃣ Get the token from cookies
        const token = req.cookies.jwt;
        if (!token) {
            res.status(401).json({ message: "Unauthorized - No Token Provided" });
            return;
        }

        // 2️⃣ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { Userid: string };

        if (!decoded || !decoded.Userid) {
            res.status(401).json({ message: "Unauthorized - Invalid Token" });
            return;
        }

        // 3️⃣ Validate ObjectId
        if (!Types.ObjectId.isValid(decoded.Userid)) {
            res.status(400).json({ message: "Invalid User ID" });
            return;
        }

        // 4️⃣ Convert to ObjectId
        const userObj = new Types.ObjectId(decoded.Userid);

        // 5️⃣ Fetch user from DB (excluding password)
        const user = await User.findById(userObj).select("-password");

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // 6️⃣ Attach user to request object
        req.user = user;

        // 7️⃣ Call next() to continue
        next();
    } catch (error) {
        console.error("Authentication Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
