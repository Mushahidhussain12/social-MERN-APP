import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

async function signupUser(req, res) {
    try {
        const { name, email, username, password } = req.body;
        const user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({ error: "user already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //whenever we are sending a response, if its positve then send a message key inside json data and if its not then send error key, that will help us to display toasts in reactAPP according to their nature, NOT NECESSARY BUT A BETTER DEVELOPMENT PRACTICE

        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword,
        });
        await newUser.save();

        //issues a JWT token as a cookie to the user so they become authorized to send particular API requests

        if (newUser) {
            const token = Jwt.sign({ userId: newUser._id }, "tokennnnn", {
                expiresIn: "20d",
            });
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: 15 * 24 * 60 * 1000,
            });
            res.status(201).json({
                message: "user created successfully",
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio: newUser.bio,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ error: "invalid data" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("signupUser error", error.message);
    }
}

async function loginUser(req, res) {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                error: "Such Username Doesnt exist",
            });
        } else {
            const PassCheck = await bcrypt.compare(password, user.password);
            if (!PassCheck) {
                return res.status(400).json({
                    error: "invalid password",
                });
            }
        }
        const token = Jwt.sign({ userId: user._id }, "tokennnnn", {
            expiresIn: "20d",
        });
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 15 * 24 * 60 * 1000,

        });
        res.status(200).json({
            message: "user logged in successfully",
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            profilePic: user.profilePic,
            bio: user.bio,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("loginUser error", error.message);
    }
}

//if the User choose to logout then JWT token will be removed from the cookies and in order to send api requests, User will have to get that token again either throw login or signUp

async function logoutUser(req, res) {
    try {
        res.cookie("jwt", "", { maxAge: 1 });
        res.status(200).json({ message: "logged Out successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("logout error", error.message);
    }
}

const follow = async(req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        //the format of id is string and _id is ObjectId therefore we need to convert both of them into same format to compare them

        //checking if the user is trying to follow itself

        if (id === req.user._id.toString())
            return res
                .status(400)
                .json({ error: "You cannot follow/unfollow yourself" });

        if (!userToModify || !currentUser)
            return res.status(400).json({ error: "User not found" });

        //now checking if the user is already following

        const isFollowing = currentUser.following.includes(id);

        //now if the user is already following then unfollow and if its not then add it to following and followers array of particular users

        if (isFollowing) {
            // Unfollow user
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            // Follow user
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            res.status(200).json({ message: "User followed successfully" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in followUnFollowUser: ", err.message);
    }
};

async function update(req, res) {
    try {
        let { name, email, username, password, bio, profilePic } = req.body;
        const ID = req.user._id;

        //extracting previous data of particular user from database

        let userData = await User.findById(ID);

        if (!userData) {
            return res.status(400).json({
                error: "No such user exists!",
            });
        }

        //this condition will keep a check so that user do not update the information of other users

        if (req.params.id !== ID.toString()) {
            return res.status(400).json({
                error: "you are not allowed to update other Users",
            });
        }

        //now if the user has send password to update, we need to hash the password first and then update
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            userData.password = hashPassword;
        }

        //if the user wants to update the image then we will upload it to cloudinary using upload function and, in response it will return us a object, whose secure_url key is used to access image back, so we will just assign that secure url field to the profilePic and everytime that profilePic will be rendered directly from database using secureURL

        if (profilePic) {
            //if the user is already having a profile pic then to become memory efficient, we will first delete the alreay existing picture from the database

            //extracting image id from profilePic link

            if (userData.profilePic) {
                await cloudinary.uploader.destroy(
                    userData.profilePic.split("/").pop().split(".")[0]
                );
            }
            const upload = await cloudinary.uploader.upload(profilePic);
            profilePic = upload.secure_url;
        }

        //if user want to update these fields and has sent updated values otherwise leave them same

        userData.name = name || userData.name;
        userData.email = email || userData.email;
        userData.username = username || userData.username;
        userData.bio = bio || userData.bio;
        userData.profilePic = profilePic || userData.profilePic;

        //save edited data as the new data to the database

        userData = await userData.save();

        res
            .status(200)
            .json({...userData._doc, message: "profile details Updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in UpdateUser: ", err.message);
    }
}

async function getProfile(req, res) {
    try {
        //now we have to fetch details from database either by id or by username..
        const { query } = req.params;
        let user;
        if (mongoose.Types.ObjectId.isValid(query)) {
            //then it is a valid objectid so we can use that to find user
            user = await User.findOne({ _id: query })
                .select("-password")
                .select("-updatedAt");
        } else {
            user = await User.findOne({ username: query })
                .select("-password")
                .select("-updatedAt");
        }
        if (!user) {
            return res.status(400).json({ error: "User Not found!" });
        }

        return res.status(200).json(user);
    } catch (err) {
        //will send the data of user except password and updatedAt keyValue
        res.status(500).json({ error: err.message });
        console.log("Error in getting User profile: ", err.message);
    }
}

export { signupUser, loginUser, logoutUser, follow, update, getProfile };