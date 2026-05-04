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
        logger.info(`userId:${details.userId} | Admin page access granted`)
    } catch (error) {
        logger.info(`userId:${details.userId} | Admin page access Denied`)

        const err = new errorClass(false, 500, 'Something went wrong', `userId:${req.details.userId} Admin page access  failed`, error)
        next(err)
    }
}

export const editRole = async (req, res, next) => {
    try {
        const details = req.details
        const role = req.body.role
        const email = req.body.email
        const roleDescription = req.body.roleDescription

        if (!(["admin", "moderator", "mentor", "team", "user"].includes(role))) {
            return res.status(400).json({
                success: false,
                message: "Invalid Input"
            });
        }
        logger.info(email)

        if (!email || (role != "user" && roleDescription.length == 0)) {
            return res.status(400).json({
                success: false,
                message: "please Enter Valid Input"
            });
        }

        if (email === process.env.OWNER_EMAIL) {

            logger.info(`userId:${details.userId} | Try to edited the role of owner`)
            return res.status(400).json({
                success: false,
                message: "something went wrong"
            });
        }
        if (roleDescription.length > 200) {
            return res.status(400).json({
                success: false,
                message: "Role Description is Too Long"
            });
        }

        const updatedData = await editDetailsByEmail(email, {
            role: role,
            roleDescription: (role === "user") ? "" : roleDescription
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

        logger.info(`userId:${details.userId} | Edited the role of ${email} to ${role}`)
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
            logger.info(`userId:${details.userId} | Try to Ban the  owner`)
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

        logger.info(`userId:${details.userId} |  ${operation}ed ban of ${email}`)
    } catch (error) {
        const err = new errorClass(false, 500, 'Something went wrong', `userId:${req.details.userId} Ban edit failed`, error)
        next(err)
    }
}