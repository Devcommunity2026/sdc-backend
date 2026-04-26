import transporter from '../config/mailer.js'

// changePassword is used to know weather the sendOtp is called from the forgot passowrd or the register route

export const sendOtp = async (otpStore, email, password, name, res, next, changePassword) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000);

        // 🔥 Print OTP instead of sending email
        console.log("OTP for", email, "is:", otp);

        if (!changePassword) {
            otpStore.set(email, {
                password: password,
                name: name,
                otp: otp,
                createdAt: Date.now(),
                expiresAt: Date.now() + 5 * 60 * 1000
            });
        } else {
            otpStore.set(email, {
                otp: otp,
                createdAt: Date.now(),
                expiresAt: Date.now() + 5 * 60 * 1000
            });
        }

        return res.status(200).json({
            success: true,
            message: 'OTP generated (check console)'
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'OTP generation failed'
        });
    }
};