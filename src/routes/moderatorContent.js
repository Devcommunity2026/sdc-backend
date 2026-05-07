import express from 'express'
import roleMiddleware from '../middlewares/roleMiddleware.js'
import { getCount } from '../controllers/moderatorContent.js'
import { getUsers } from '../controllers/moderatorContent.js'

const router = express.Router()
router.use(roleMiddleware(["admin", "moderator"]))

router.get('/count', getCount);
router.get('/users', getUsers)


export default router