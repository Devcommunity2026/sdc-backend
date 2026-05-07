import { getUsesCount } from "../services/userService.js";
import { getMentorCount } from "../services/mentorService.js";
import { getMemberCount } from "../services/coreTeamService.js";
import { getPaginatedUsers } from "../services/userService.js";
import errorClass from "../utils/errorClass.js";

export const getCount = async (req, res, next) => {
    try {
        const userCount = await getUsesCount();
        const mentorCount = await getMentorCount();
        const memberCount = await getMemberCount();

        res.status(200).json({
            success: true,
            data: {
                users: userCount,
                mentors: mentorCount,
                members: memberCount
            }
        });

    } catch (error) {
        const err = new errorClass(
            false,
            500,
            'Unable To Count',
            `userId:${req.details.userId} get Count failed`,
            error
        );

        next(err);
    }
};

export const getUsers = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await getPaginatedUsers(page, limit);

        if (!result.success) {
            return next(result.error);
        }

        res.status(200).json(result);

    } catch (error) {
        const err = new errorClass(
            false,
            500,
            'Unable To Fetch Users',
            `userId:${req.details.userId} fetch users failed`,
            error
        );

        next(err);
    }
};