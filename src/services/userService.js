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

export const editDetailsByEmail = async (email, obj) => {
    try {
        const details = await User.findOneAndUpdate(
            { email: email },
            { $set: obj },
            { new: true }
        )
        return {
            success: true,
            data: details
        }
    } catch (error) {
        const err = new errorClass(false, 500, 'Something went wrong', `email:${email} Update Failed`, error)
        return {
            success: false,
            data: null,
            error: err
        }
    }
}