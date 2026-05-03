import errorClass from "../utils/errorClass.js";
import User from "../models/userSchema.js";
export const getUserDetailsByEmail = async (email) => {
    try {
        const details = await User.findOne({
            email: email
        })
        return {
            success: true,
            data: details
        }
    } catch (error) {
        const err = new errorClass(false, 500, 'Something went wrong', `email:${email} Query Failed`, error)
        return {
            success: false,
            data: null,
            error: err
        }
    }
}