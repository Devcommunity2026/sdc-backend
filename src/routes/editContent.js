import express from "express"
import roleMiddleware from "../middlewares/roleMiddleware.js"
import { addEvent } from "../controllers/editContent.js"
import { deleteEvent } from "../controllers/editContent.js"
import { imageParser } from "../middlewares/uploadMiddleware.js"

const router = express.Router()
router.use(roleMiddleware(['moderator', 'admin']))

router.post('/addEvent', imageParser.single('image'), addEvent)
router.post('/removeEvent', deleteEvent)

export default router