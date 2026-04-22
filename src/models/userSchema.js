import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    userId: Number,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ["admin", "moderator", "user"],
        default: "user"
    },
    isBanned: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema); 
