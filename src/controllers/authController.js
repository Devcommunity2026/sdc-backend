import user from '../models/userSchema.js'
import counter from '../models/counterSchema.js';
import { sendOtp } from '../services/mailService.js'
import { sendToken, sendChangePasswordToken, decodeToken } from './jwtController.js';
import bcrypt from "bcrypt";
import logger from '../config/logger.js'
import store from '../utils/memoryStore.js';
import errorClass from '../utils/errorClass.js';

const otpStore = store.otp  // this map will store the otp for the user and will expire after the expiryTime

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
        const err = new errorClass(false, 500, 'Unable to send OTP', 'User registy failed', error)
        next(err)
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
            logger.info(`userId:${newUser.userId} | registed`)
        }

        return sendToken(res, newUser);
    } catch (error) {
        const err = new errorClass(false, 500, 'Unable to create ID', 'User OTP verification failed', error)
        next(err)
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const userData = await user.findOne({ email })

        if (!userData) {
            return res.status(401).json({
                success: false,
                message: 'Email or password not exists'
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
        const err = new errorClass(false, 500, 'unable to login', 'User login failed', error)
        next(err)
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
        const err = new errorClass(false, 500, 'Unable to send OTP', 'User forgot password failed', error)
        next(err)
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
                message: "Something went wrong"
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
        const err = new errorClass(false, 500, 'Unable to verify OTP', 'User forgotPassword otp verification failed', error)
        next(err)
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
                message: 'Something went wrong'
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await user.updateOne({ email: email }, { $set: { password: hashedPassword } })

        logger.info(`userId:${updatedUser.userId} | changed Password`)

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        })
    }
    catch (error) {
        const err = new errorClass(false, 500, 'Unable to change password', 'User changePassword failed', error)
        next(err)
    }
}