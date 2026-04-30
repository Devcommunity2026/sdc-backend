import mongoose from "mongoose";
import counter from "./counterSchema.js";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    userId: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "moderator", "mentor", "team", "user"],
        default: "user"
    },
    profileImage: {
        type: String,
    },
    linkedIn: {
        type: String,
    },
    Position: {
        type: String,
    },
    isBanned: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

userSchema.pre('validate', async function () {
    if (this.isNew) {
        const count = await counter.findOneAndUpdate(
            { _id: 'userCounter' },   // ✅ MUST MATCH STRING
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        this.userId = count.seq;
    }
});

const User = mongoose.model("User", userSchema);
export default User;