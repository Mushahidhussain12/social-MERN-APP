import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import MessageRoutes from "./routes/MessageRoutes.js";
import { app, server } from "./socket/socket.js";
dotenv.config();

//limit of data that can be parsed is set to 50mb to avoid payload too large error

app.use(express.json({ limit: "50mb" })); //middleware used to pass JSON data in the request body
app.use(express.urlencoded({ extended: true })); //this middleware is used to parse form data from url in the req
app.use(cookieParser()); //middleware to deal with cookies

//connecting Database with our server

const connect = async() => {
    try {
        const con = await mongoose.connect(
            "mongodb+srv://khokharmushahidhussain:4wnx6Cuw5bs4J6m8@cluster0.42uicdw.mongodb.net/Threads?retryWrites=true&w=majority"
        );
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
connect();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

//it is preferred to keep sensitive info such as tokens or database URLs in the environment file

dotenv.config();
const port = process.env.PORT;

//defining Root Route for our API requests

//middleware to deal with the user related requests
app.use("/api/users", userRoutes);
//middleware to deal with post related requests
app.use("/api/posts", postRoutes);
app.use("/api/messages", MessageRoutes);
server.listen(port, () => {
    console.log("The app is listening on port 5000");
});