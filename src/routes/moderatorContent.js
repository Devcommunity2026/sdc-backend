import express from 'express'
import roleMiddleware from '../middlewares/roleMiddleware.js'
import { getUsers, getTeam, getMentor, getCount } from '../controllers/moderatorContent.js'

const router = express.Router()
router.use(roleMiddleware(["admin", "moderator"]))

router.get('/count', getCount);
router.get('/users', getUsers)
router.get('/team', getTeam)
router.get('/mentor', getMentor)


export default router