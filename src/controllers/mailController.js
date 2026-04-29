import transporter from '../config/mailer.js'
import logger from '../config/logger.js';
// changePassword is used to know weather the sendOtp is called from the forgot passowrd or the register route

export const sendOtp = async (otpStore, email, password, name, res, next, changePassword) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000);
        const info = await transporter.sendMail(
            {
                from: `"SDC Team" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "Your OTP Code",
                text: (changePassword) ? `Your OTP to reset password is ${otp}. It expires in 5 minute. And reset the password within 10 minutes` : `Your OTP is ${otp}. It expires in 5 minute.`
            }
        );
        if (info.accepted.length > 0) {
            if (!changePassword) {
                otpStore.set(email, {
                    password: password,
                    name: name,
                    otp: otp,
                    createdAt: Date.now(),
                    expiresAt: Date.now() + 5 * 60 * 1000
                });
            }
            else {
                otpStore.set(email, {
                    otp: otp,
                    createdAt: Date.now(),
                    expiresAt: Date.now() + 5 * 60 * 1000
                });
            }

            return res.status(200).json({
                success: true,
                message: 'OTP sent successfully'
            })
        } else {
            res.status(500).json({
                success: false,
                message: 'unable to send OTP'
            })
        }
    }
    catch (error) {
        logger.error('Failed to send Email', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'unable to send OTP'
        })
    }
}