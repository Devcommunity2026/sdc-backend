import user from '../models/userSchema.js'
import counter from '../models/counterSchema.js';
import { sendOtp } from './mailController.js'
import { sendToken, sendChangePasswordToken, decodeToken } from './jwtController.js';
import bcrypt from "bcrypt";
import logger from '../config/logger.js'


const otpStore = new Map()  // this map will store the otp for the user and will expire after the expiryTime

export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        let exisiting = await user.findOne({ email })
        if (exisiting) {
            return res.status(409).json(
                {
                    success: false,
                    message: "User already exists"
                }
            )
        }
        return sendOtp(otpStore, email, password, name, res, next, false)
    } catch (error) {
        logger.error('User registy failed', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Unable to send OTP'
        })
    }
}

export const verifyUser = async (req, res, next) => {
    try {
        const { email, userOtp } = req.body;

        const data = otpStore.get(email);

        if (!data) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });
        }

        const { password, expiresAt, otp, name } = data;

        if (expiresAt < Date.now()) {
            return res.status(401).json({
                success: false,
                message: "OTP expired"
            });
        }

        if (otp != userOtp) {
            return res.status(401).json({
                success: false,
                message: "OTP mismatched"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await user.create({
            name,
            email,
            password: hashedPassword,
            role: process.env.OWNER_EMAIL === email ? "admin" : "user"
        });

        if (newUser) {
            otpStore.delete(email);
            logger.info(`userId:${newUser.userId} registed`)
        }

        return sendToken(res, newUser);
    } catch (error) {
        logger.error('User OTP verification failed', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Unable to create ID'
        })
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const userData = await user.findOne({ email })

        if (!userData) {
            return res.status(401).json({
                success: false,
                message: 'Wrong password'
            })
        }

        const isMatch = await bcrypt.compare(
            password,
            userData.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        return sendToken(res, userData)

    } catch (error) {
        logger.error('User login failed', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'unable to login'
        });
    }
}

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body

        const userData = await user.findOne({ email })

        if (!userData) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            })
        }


        return sendOtp(otpStore, email, undefined, undefined, res, next, changePassword)
    } catch (error) {
        logger.error('User forgot password failed', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Unable to send OTP'
        });
    }
}

export const verifyOTP = async (req, res, next) => {
    try {
        const { email, userOtp } = req.body

        const userData = await user.findOne({ email })

        if (!userData) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            })
        }

        const data = otpStore.get(email);

        if (!data) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });
        }

        const { expiresAt, otp } = data;

        if (expiresAt < Date.now()) {
            return res.status(401).json({
                success: false,
                message: "OTP expired"
            });
        }
        if (String(otp) !== String(userOtp)) {
            return res.status(401).json({
                success: false,
                message: "OTP mismatched"
            });
        }
        // starting 10 minutes session

        return sendChangePasswordToken(res, userData)

    } catch (error) {
        logger.error('User forgotPassword otp verification failed', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Unable to verify OTP'
        })
    }
}

export const changePassword = async (req, res, next) => {
    try {
        const cookies = req.cookies
        const { email, newPassword } = req.body

        if (!cookies.passToken) {
            return res.status(401).json({
                success: false,
                message: 'Tokens Expired'
            })
        }
        const decode = await decodeToken(cookies.passToken)

        if (!decode.success) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Token'
            })
        }

        if (decode.data.email != email) {
            return res.status(401).json({
                success: false,
                message: 'token mismatched'
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await user.updateOne({ email: email }, { $set: { password: hashedPassword } })

        logger.info(`userId:${updatedUser.userId} changed Password`)

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        })
    }
    catch (error) {
        logger.error('User changePassword failed', {
            message: error.message,
            stack: error.stack
        });
        return res.status(500).json({
            success: false,
            message: 'Unable to change password'
        })
    }
}