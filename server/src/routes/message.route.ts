import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { getUsersForSidebar, getMessages } from "../controllers/message.controller";

//this file is redirection to the message controller with appropriate routes
const router = express.Router();

router.get("/user", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, getMessages);
export default router;