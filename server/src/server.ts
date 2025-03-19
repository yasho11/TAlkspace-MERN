import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; //parse incoming request with cookies
import cors from "cors";

import path from "path";

import { connect } from "./libs/db";

import authRoutes from "./routes/authRoutes";
import messageRoutes from "./routes/message.route";
import {app, server} from "./libs/socket";


dotenv.config();

const port = process.env.PORT || 5000; 
const _dirname = path.resolve();

app.use(express.json({limit:"50mb"})); //parse incoming request with JSON payloads
app.use(express.urlencoded({limit:"50mb", extended: true}));
app.use(cookieParser());//parse incoming request with cookies
//CORS connection:
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/api/auth", authRoutes); //this is the route for the authentication
app.use("/api/messages", messageRoutes); //this is the route for the messages


if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(_dirname,"../frontend/dist")));

  app.get("*", (req, res)=>{
    res.sendFile(path.join(_dirname, "../frontend", "dist", "index.html"));
  });
}


server.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
  connect();
});
