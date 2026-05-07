import event from '../models/eventSchema.js'
import logger from '../config/logger.js'
import errorClass from '../utils/errorClass.js'

export const addEventData = async (data, req, res, next) => {
    try {
        const Event = new event({ ...data })
        await Event.save()
        res.status(200).json({
            success: true,
            message: 'Event Added Successfully'
        })
        logger.info(`userId:${req.details.userId} | added the ${data.name} event`)
    } catch (error) {
        const err = new errorClass(false, 500, 'Unable To Add Event', `userId:${req.details.userId} add Event data to db failed`, error)
        next(err)
    }
}
export const deleteEventData = async (id, req, res, next) => {
    try {
        await event.findOneAndDelete({ _id: id });
        res.status(200).json({
            success: true,
            message: 'Event deleted Successfully'
        })
        logger.info(`userId:${req.details.userId} | removed the event of id ${id} `)
    } catch (error) {
        const err = new errorClass(false, 500, 'Unable To Delete Event', `userId:${req.details.userId} Delete Event data From db failed`, error)
        next(err)
    }
}