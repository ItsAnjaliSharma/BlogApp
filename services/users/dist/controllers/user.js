import User from "../model/User.js";
import Jwt from "jsonwebtoken";
import TryCatch from "../utils/trycatch.js";
import getBuffer from "../utils/dataUri.js";
import { v2 as cloudinary } from "cloudinary";
export const loginUser = TryCatch(async (req, res) => {
    const { email, name, image } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({ name, email, image });
    }
    const token = Jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "5d" });
    res.status(200).json({
        message: "User logged in successfully",
        user,
        token,
    });
});
export const myProfile = TryCatch(async (req, res) => {
    const user = req.user;
    res.json(user);
});
export const getUserProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404).json({
            message: "User not found with this id",
        });
        return;
    }
    res.json(user);
});
export const getAllUsers = TryCatch(async (req, res) => {
    const users = await User.find();
    res.json(users);
});
export const updateUser = TryCatch(async (req, res) => {
    const { name, instagram, facebook, linkedin, bio } = req.body;
    const user = await User.findByIdAndUpdate(req.user?._id, { name, instagram, facebook, linkedin, bio }, { new: true });
    const token = Jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "5d" });
    if (!user) {
        res.status(404).json({
            message: "User not found with this id",
        });
        return;
    }
    res.json({
        message: "User updated successfully",
        user,
        token,
    });
});
//update user profile image
export const updateUserImage = TryCatch(async (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(400).json({
            message: "No file uploaded",
        });
        return;
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
        res.status(400).json({
            message: "Error in file buffer",
        });
        return;
    }
    const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
        folder: "blogs",
    });
    const user = await User.findByIdAndUpdate(req.user?._id, { image: cloud.secure_url }, { new: true });
    const token = Jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "5d" });
    res.json({
        message: "User image updated successfully",
        user,
        token,
    });
});
