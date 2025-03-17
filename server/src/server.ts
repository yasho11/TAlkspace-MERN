import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connect } from "./libs/db";

import authRoutes from "./routes/authRoutes";
import messageRoutes from "./routes/message.route";


dotenv.config();
const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cookieParser());
//CORS connection:
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
    connect();
});
