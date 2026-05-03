import errorClass from '../utils/errorClass.js'
import logger from '../config/logger.js'

export const shareProfile = async (req, res, next) => {
    try {
        const details = req.details
        res.status(200).json(
            {
                success: true,
                data: {
                    name: details.name,
                    email: details.email,
                    role: 'user',
                    profileImage: details.profileImage,
                    Position: details.Position,
                }
            }
        )
        logger.info(`userId:${details.userId} | Details are shared`)
    } catch (error) {
        const err = new errorClass(false, 500, 'Unable to share the Data', `userId:${req.details.userId} profile sharing failed`, error)
        next(err)
    }
}