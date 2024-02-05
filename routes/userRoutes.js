import express from "express";
import {
    signupUser,
    loginUser,
    logoutUser,
    follow,
    update,
    getProfile,
} from "../controllers/userControllers.js";
import protect from "../middlewares/protect.js";
const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile/:query", getProfile);

// below route will handle both follow and unfollow requests

router.post("/follow/:id", protect, follow);
router.put("/update/:id", protect, update);

export default router;