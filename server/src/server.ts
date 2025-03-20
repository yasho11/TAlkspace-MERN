import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connect } from "./libs/db";
import { app , server} from "./libs/socket";

import authRoutes from "./routes/authRoutes";
import messageRoutes from "./routes/message.route";

dotenv.config();





const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


server.listen(PORT, ()=>{
  console.log("server is running on PORT: " + PORT);
  connect();
})
