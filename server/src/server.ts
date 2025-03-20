import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connect } from "./libs/db";
import { app , server} from "./libs/socket";
import path from "path";

import authRoutes from "./routes/authRoutes";
import messageRoutes from "./routes/message.route";

dotenv.config();





const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req,res)=>{
    res.sendFile(path.join(__dirname,"../client", "dist","index.html"));
  })
}


server.listen(PORT, ()=>{
  console.log("server is running on PORT: " + PORT);
  connect();
})
