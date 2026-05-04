import errorClass from '../utils/errorClass.js'
import { getUserDetailsByEmail, editDetailsByEmail } from '../services/userService.js'

import logger from '../config/logger.js'

export const getAccess = (req, res, next) => {
    try {
        const details = req.details
        res.status(200).json({
            success: true,
            message: 'access provided'
        })
        logger.info(`userId:${details.userId} | Admin page access granted`)
    } catch (err) {
        const err = new errorClass(false, 500, 'Something went wrong', `userId:${req.details.userId} Admin page access  failed`, error)
        next(err)
    }
}

export const editRole = async (req, res, next) => {
    try {
        const details = req.details
        const role = req.body.role
        const email = req.body.operation
        const roleDescription = req.body.roleDescription

        if (!(role in ["admin", "moderator", "mentor", "team", "user"])) {
            return res.status(400).json({
                success: false,
                message: "Invalid Input"
            });
        }

        const updatedData = await editDetailsByEmail({
            role: role,
            roleDescription: roleDescription
        })
        
        res.status(200).json({
            success: true,
            message: 'access provided'
        })

        logger.info(`userId:${details.userId} | Edited the role of `)
    } catch (err) {
        const err = new errorClass(false, 500, 'Something went wrong', `userId:${req.details.userId} Admin page access  failed`, error)
        next(err)
    }
}