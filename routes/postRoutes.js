import express from "express";
import {
    createPost,
    getPost,
    deletePost,
    likeUnlike,
    reply,
    getUserPosts,
    feed,
} from "../controllers/postControllers.js";
import protect from "../middlewares/protect.js";

const router = express.Router();

//we can do the same stuff with only using post but we are creating different rest apis for delete and get so that we dont have to include delete and get specifically in the routes name..we will directly send request to the required route using id..its the convention

//feed route should be kept at the start because if you tried to put it after getpost route then it will try to handle the the request and the it will consider your "feed" route as the dynamic id leaving an invalid id format error

router.get("/feed", protect, feed);
router.post("/create", protect, createPost);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);

router.delete("/:id", protect, deletePost);
router.put("/like/:id", protect, likeUnlike);
router.put("/reply/:id", protect, reply);

export default router;