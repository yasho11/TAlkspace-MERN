import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connect } from "./libs/db";

import authRoutes from "./routes/authRoutes";


dotenv.config();
const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);


app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
    connect();
});
