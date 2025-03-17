import express from "express";
import { getUser, signin, signout, signup, updateProfile, checkAuth } from "../controllers/auth.controller";
import { protectRoute } from "../middleware/auth.middleware";


const router = express.Router();

router.post("/signup", signup);

router.post("/signin", signin);

router.post("/signout", signout);


router.put("/update-profile", protectRoute, updateProfile);

router.get("/view", protectRoute, getUser);

router.get("/check", protectRoute, checkAuth);
export default router;



