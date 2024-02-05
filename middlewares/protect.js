import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

//This function runs to verify the Token in cookies and extract payload from it

async function protect(req, res, next) {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            res.status(401).json({ message: "unauthorized!" });
        }
        const VerifyTokenAndDecodeData = jwt.verify(token, "tokennnnn"); //verify and get data from payload
        const user = await User.findById(VerifyTokenAndDecodeData.userId).select(
            "-password"
        );
        req.user = user; // user will be sent along with req to the next function
        next(); //next function on api will be called
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error detected during jwt authorization!");
    }
}

export default protect;