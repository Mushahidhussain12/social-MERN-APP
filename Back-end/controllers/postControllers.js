import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import Post from "../models/PostModel.js";
async function createPost(req, res) {
    try {
        let { postedBy, text, img } = req.body;

        //we are not checking for img since it is optional

        if (!postedBy || !text) {
            return res.status(400).json({ error: "Please provide all fields" });
        }
        const user = await User.findById(postedBy);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        //checking if the user is trying to post through anyone else's username

        if (user._id.toString() !== req.user._id.toString()) {
            return res
                .status(400)
                .json({ error: "You can only post on your own profile" });
        }

        //now all these conditions that are i have specified here, are also specified in our front end. so its a type of double checking, frontend is highly unlikely to send more than 300 texts, but even if does, it will get error from server!

        const maxLength = 300;
        if (text.length > maxLength) {
            return res
                .status(400)
                .json({ error: `Text must be less than ${maxLength} characters` });
        }

        if (img) {
            const uploaded = await cloudinary.uploader.upload(img);
            img = uploaded.secure_url;
        }

        //now if the request manage to escape all above conditions only then it will be added to the database

        const newPost = new Post({ postedBy, text, img });
        res.status(201).json(newPost);

        await newPost.save();
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error creating post");
    }
}

async function getPost(req, res) {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "post not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error getting post");
    }
}

async function deletePost(req, res) {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res
                .status(404)
                .json({ error: "post that you want to delete doesnt exist!" });
        }
        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res
                .status(401)
                .json({ error: "you can only delete your own posts" });
        }

        //if the post has an image, it will be removed from cloudinary database

        if (post.img) {
            const image_id = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(image_id);
        }
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "post deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error getting post");
    }
}

async function likeUnlike(req, res) {
    try {
        const { id } = req.params;
        const userLikingThePost = req.user._id;
        const post = await Post.findById(id);
        if (!post) {
            return res
                .status(404)
                .json({ error: "Post you want to like doesnt exist" });
        }

        //checking if the user has already liked the post

        const CheckUserLike = post.likes.includes(userLikingThePost);

        //now if the user already has already liked the post, we will remove it from liked list, if not then we will add to the liked list

        if (CheckUserLike) {
            await Post.updateOne({ _id: id }, { $pull: { likes: userLikingThePost } });
            return res.status(200).json({ message: "unliked Post" });
        } else {
            await Post.updateOne({ _id: id }, { $push: { likes: userLikingThePost } });
            return res.status(200).json({ message: "liked Post" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error getting post");
    }
}

async function reply(req, res) {
    try {
        const { id } = req.params;
        const { text } = req.body;

        const replyText = text;

        //extracting this data because we will have to use them in comment component

        const userId = req.user._id;
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;

        if (!replyText) {
            return res.status(400).json({
                error: "cannot send empty comment",
            });
        }
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                error: "The Post to which you want to reply doesnt exist!",
            });
        }
        const reply = { userId, replyText, userProfilePic, username };
        post.replies.push(reply);
        await post.save();

        res.status(200).json(reply);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error posting reply");
    }
}

async function feed(req, res) {
    try {
        const userID = req.user._id;
        const userData = await User.findById(userID);
        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }
        const followingList = userData.following;

        //this will include only those posts from Post collection whose postedBy key matches to userIds stored in following list of the user
        const postsToshow = await Post.find({
            postedBy: { $in: followingList },
        }).sort({ createdAt: -1 });

        //sort({createdAt : -1}) is used to show the latest posts first

        res.status(200).json(postsToshow);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error getting feed posts");
    }
}

async function getUserPosts(req, res) {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "user not found" });
        }
        const posts = await Post.find({ postedBy: user._id }).sort({
            createdAt: -1,
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export {
    getUserPosts,
    createPost,
    reply,
    getPost,
    deletePost,
    likeUnlike,
    feed,
};