import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";

export const sendToken = async (res, user) => {
    try {

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const token = jwt.sign(
            {
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "16d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000), // 16 days
            sameSite: "lax",
        });

        res.status(200).json({
            success: true,
            message: "Login successful"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'unable to login'
        });
    }
};

export const sendChangePasswordToken = async (res, user) => {
    try {

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const passToken = jwt.sign(
            {
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "10m" }
        );

        res.cookie("passToken", passToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            sameSite: "lax",
        });

        res.status(200).json({
            success: true,
            message: "Session started"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to create session'
        });
    }
};

export const decodeToken = async (token) => {
    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        return {
            success: true,
            data: decoded
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
        }
    }
}