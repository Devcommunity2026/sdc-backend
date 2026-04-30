import user from '../models/userSchema.js';
import { sendOtp } from './mailController.js';
import { sendToken, sendChangePasswordToken } from './jwtController.js';
import bcrypt from "bcrypt";

const otpStore = new Map();


// ================= REGISTER =================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    const existing = await user.findOne({ email: cleanEmail });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    // 🔥 IMPORTANT: remove old OTP if exists
    otpStore.delete(cleanEmail);

    return sendOtp(
      otpStore,
      cleanEmail,
      password,
      name,
      res,
      null,
      false
    );

  } catch (error) {
    console.log("🔥 REGISTER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: 'Unable to send OTP'
    });
  }
};


// ================= VERIFY USER =================
export const verifyUser = async (req, res) => {
  try {
    const { email, userOtp } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    const data = otpStore.get(cleanEmail);

    console.log("👉 VERIFY CALLED");
    console.log("Email:", cleanEmail);
    console.log("Entered OTP:", `"${userOtp}"`);
    console.log("Stored Data:", data);

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "OTP not found"
      });
    }

    const { password, expiresAt, otp, name } = data;

    console.log("Stored OTP:", `"${otp}"`);

    // 🔥 expiry check
    if (expiresAt < Date.now()) {
      otpStore.delete(cleanEmail);
      return res.status(401).json({
        success: false,
        message: "OTP expired"
      });
    }

    // 🔥 SAFE comparison
    if (String(otp).trim() !== String(userOtp).trim()) {
      return res.status(401).json({
        success: false,
        message: "OTP mismatched"
      });
    }

    // 🔥 hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await user.create({
      name,
      email: cleanEmail,
      password: hashedPassword,
      role: process.env.OWNER_EMAIL === cleanEmail ? "admin" : "user"
    });

    // 🔥 remove OTP after success
    otpStore.delete(cleanEmail);

    return sendToken(res, newUser);

  } catch (error) {
    console.log("🔥 VERIFY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Verification failed"
    });
  }
};


// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    const userData = await user.findOne({ email: cleanEmail });

    if (!userData) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    return sendToken(res, userData);

  } catch (error) {
    console.log("🔥 LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: 'Unable to login'
    });
  }
};


// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    const userData = await user.findOne({ email: cleanEmail });

    if (!userData) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    otpStore.delete(cleanEmail);

    return sendOtp(otpStore, cleanEmail, undefined, undefined, res, null, true);

  } catch (error) {
    console.log("🔥 FORGOT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: 'Unable to send OTP'
    });
  }
};


// ================= VERIFY OTP (FOR PASSWORD RESET) =================
export const verifyOTP = async (req, res) => {
  try {
    const { email, userOtp } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    const data = otpStore.get(cleanEmail);

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "OTP not found"
      });
    }

    const { expiresAt, otp } = data;

    if (expiresAt < Date.now()) {
      otpStore.delete(cleanEmail);
      return res.status(401).json({
        success: false,
        message: "OTP expired"
      });
    }

    if (String(otp).trim() !== String(userOtp).trim()) {
      return res.status(401).json({
        success: false,
        message: "OTP mismatched"
      });
    }

    return sendChangePasswordToken(res, { email: cleanEmail });

  } catch (error) {
    console.log("🔥 VERIFY OTP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: 'Unable to verify OTP'
    });
  }
};


// ================= CHANGE PASSWORD =================
export const changePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.updateOne(
      { email: cleanEmail },
      { $set: { password: hashedPassword } }
    );

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.log("🔥 CHANGE PASSWORD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: 'Unable to change password'
    });
  }
};