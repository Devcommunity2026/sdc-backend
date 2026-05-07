import mentor from "../models/mentorSchema.js";
import logger from "../config/logger.js";
import errorClass from "../utils/errorClass.js";


// ================= ADD MENTOR =================

export const addMentorData = async (
    data,
    req,
    res,
    next
) => {

    try {

        const Mentor = new mentor({ ...data });

        await Mentor.save();

        res.status(200).json({
            success: true,
            message: "Mentor Added Successfully"
        });

        logger.info(
            `userId:${req.details.userId} | added mentor ${data.name}`
        );

    } catch (error) {

        const err = new errorClass(
            false,
            500,
            "Unable To Add Mentor",
            `userId:${req.details.userId} add mentor failed`,
            error
        );

        next(err);
    }
};


// ================= REMOVE MENTOR =================

export const removeMentorData = async (
    id,
    req,
    res,
    next
) => {

    try {

        await mentor.findOneAndDelete({ _id: id });

        res.status(200).json({
            success: true,
            message: "Mentor Removed Successfully"
        });

        logger.info(
            `userId:${req.details.userId} | removed mentor ${id}`
        );

    } catch (error) {

        const err = new errorClass(
            false,
            500,
            "Unable To Remove Mentor",
            `userId:${req.details.userId} remove mentor failed`,
            error
        );

        next(err);
    }
};

export const getMentorCount = async () => {
    try {
        const totalMentors = await mentor.countDocuments();
        return totalMentors

    } catch (error) {
        return null
    }
}