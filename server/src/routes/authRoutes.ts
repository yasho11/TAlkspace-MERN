import express from "express";
import { getUser, signin, signout, signup, updateProfile } from "../controllers/auth.controller";
import { protectRoute } from "../middleware/auth.middleware";


const router = express.Router();

router.post("/signup", signup);

router.post("/signin", signin);

router.post("/signout", signout);


router.put("/update-profile", protectRoute, updateProfile);

router.get("/view", protectRoute, getUser);
export default router;



