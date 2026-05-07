import errorClass from "../utils/errorClass.js"
import { addEventData } from "../services/eventService.js"
import { deleteEventData } from "../services/eventService.js"

export const addEvent = async (req, res, next) => {
    try {
        const userData = req.body
        const data = {
            name: userData.name,
            subHeading: userData.subHeading,
            description: userData.description,
            date: new Date(userData.date),
            form: userData.form,
            thumbnail: req.file.path
        }
        return await addEventData(data, req, res, next)
    } catch (error) {
        const err = new errorClass(false, 500, 'Unable To Add Event', `userId:${req.details.userId} add Event failed`, error)
        next(err)
    }
}
export const deleteEvent = async (req, res, next) => {
    try {
        return await deleteEventData(req.body.id, req, res, next)
    } catch (error) {
        const err = new errorClass(false, 500, 'Unable To Delte Event', `userId:${req.details.userId} Delete Event failed`, error)
        next(err)
    }
}