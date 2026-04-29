import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

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
        logger.info(`userId:${user.userId} logged In`)
    } catch (error) {
        logger.error('Failed to send authTokens', {
            message: error.message,
            stack: error.stack
        });
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
        logger.error('Failed to send changePassToken', {
            message: error.message,
            stack: error.stack
        });
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
        logger.error('Failed to decode authTokens', {
            message: error.message,
            stack: error.stack
        });
        return {
            success: false,
        }
    }
}