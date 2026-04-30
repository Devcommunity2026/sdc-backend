import transporter from '../config/mailer.js';
import logger from '../config/logger.js';

// changePassword is used to know whether sendOtp is called from forgot password or register

export const sendOtp = async (
  otpStore,
  email,
  password,
  name,
  res,
  next,
  changePassword
) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);

    // 🔥 Print OTP instead of sending email (for testing)
    console.log("OTP for", email, "is:", otp);

    if (!changePassword) {
      otpStore.set(email, {
        password: password,
        name: name,
        otp: otp,
        createdAt: Date.now(),
        expiresAt: Date.now() + 5 * 60 * 1000,
      });
    } else {
      otpStore.set(email, {
        otp: otp,
        createdAt: Date.now(),
        expiresAt: Date.now() + 5 * 60 * 1000,
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP generated (check console)",
    });

  } catch (error) {
    logger.error("Failed to generate OTP", {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      success: false,
      message: "OTP generation failed",
    });
  }
};