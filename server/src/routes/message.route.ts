import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { getUsersForSidebar, getMessages, SendMessage } from "../controllers/message.controller";

//this file is redirection to the message controller with appropriate routes
const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, SendMessage);
export default router;