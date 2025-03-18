import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; //parse incoming request with cookies
import cors from "cors";
import { connect } from "./libs/db";

import authRoutes from "./routes/authRoutes";
import messageRoutes from "./routes/message.route";


dotenv.config();
const app = express();
const port = process.env.PORT || 5000;


app.use(express.json({limit:"50mb"})); //parse incoming request with JSON payloads
app.use(express.urlencoded({limit:"50mb", extended: true}));
app.use(cookieParser());//parse incoming request with cookies
//CORS connection:
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/api/auth", authRoutes); //this is the route for the authentication
app.use("/api/messages", messageRoutes); //this is the route for the messages

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
    connect();
});
