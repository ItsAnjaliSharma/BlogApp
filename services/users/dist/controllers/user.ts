import {Request, Response} from 'express';
import User from "../model/User.js";


export const loginUser = async (req, res) => {
    try {
        const { email, name, image } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name,
                email,
                image,
            });
        }
        const token = user.generateAuthToken();
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                instagram: user.instagram,
                facebook: user.facebook,
                linkedin: user.linkedin,
                bio: user.bio,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
