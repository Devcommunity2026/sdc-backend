import errorClass from '../utils/errorClass.js'
import { getUserDetailsByEmail, editDetailsByEmail } from '../services/userService.js'
import { filterResponseData } from './profileController.js'
import logger from '../config/logger.js'

export const getAccess = (req, res, next) => {
    try {
        const details = req.details
        res.status(200).json({
            success: true,
            message: 'access provided'
        })
        logger.info(`userId:${req.details.userId} | Admin page access granted`)
    } catch (error) {
        logger.info(`userId:${req.details.userId} | Admin page access Denied`)

        const err = new errorClass(false, 500, 'Something went wrong', `userId:${req.details.userId} Admin page access  failed`, error)
        next(err)
    }
}

export const editRole = async (req, res, next) => {
    try {
        const details = req.details
        const role = req.body.role
        const email = req.body.email

        if (!(["admin", "moderator", "user"].includes(role))) {
            return res.status(400).json({
                success: false,
                message: "Invalid Input"
            });
        }

        logger.info(email)

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "please Enter Valid Input"
            });
        }

        if (email === process.env.OWNER_EMAIL) {
            logger.info(`userId:${req.details.userId} | Try to edit owner role`);

            return res.json({
                success: false,
                message: "You are not allowed to modify the owner account"
            });
        }


        const updatedData = await editDetailsByEmail(email, {
            role: role,
            roleDescription: (["admin", "moderator", "user"].includes(role)) ? "" : roleDescription
        })

        if (!updatedData.success) {
            next(updatedData.error)
        }

        if (!updatedData.data) {
            return res.status(400).json({
                success: false,
                message: "User Not Found"
            });
        }

        res.status(200).json({
            success: true,
            message: 'User Role Updated'
        })

        logger.info(`userId:${req.details.userId} | Edited the role of ${email} to ${role}`)
    } catch (error) {
        const err = new errorClass(false, 500, 'Something went wrong', `userId:${req.details.userId} role edit failed`, error)
        next(err)
    }
}

export const banEdit = async (req, res, next) => {
    try {
        const details = req.details
        const email = req.body.email
        const operation = req.body.operation


        if (!email || !operation || !["add", "remove"].includes(operation)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Input"
            });
        }
        if (email === process.env.OWNER_EMAIL) {
            logger.info(`userId:${req.details.userId} | Try to Ban the  owner`)
            return res.status(400).json({
                success: false,
                message: "something went wrong"
            });
        }
        const updatedData = await editDetailsByEmail(email, {
            isBanned: operation === "add"
        })

        if (!updatedData.success) {
            next(updatedData.error)
        }

        if (!updatedData.data) {
            return res.status(400).json({
                success: false,
                message: "User Not Found"
            });
        }

        res.status(200).json({
            success: true,
            message: `Ban of user is ${operation}ed`
        })

        logger.info(`userId:${req.details.userId} |  ${operation}ed ban of ${email}`)
    } catch (error) {
        const err = new errorClass(false, 500, 'Something went wrong', `userId:${req.details.userId} Ban edit failed`, error)
        next(err)
    }
}