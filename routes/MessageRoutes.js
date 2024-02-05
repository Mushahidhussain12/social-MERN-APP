import express from "express";
import protect from "../middlewares/protect.js";
import {
    sendMessage,
    getMessages,
    getConversations,
} from "../controllers/messageControllers.js";
const router = express.Router();

router.get("/conversations", protect, getConversations);
router.get("/:otherUserId", protect, getMessages);
router.post("/", protect, sendMessage);

//to get all the messages of the conversation

export default router;