import mongoose from "mongoose";
import dotenv from "dotenv";


const env = dotenv.config();

export const connect = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string, {
        });
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection failed");
        process.exit(1);
    }
}
