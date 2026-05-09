import express from 'express'
import roleMiddleware from '../middlewares/roleMiddleware.js'
import { getAccess, getUsers, getTeam, getMentor, getEvents, getProjects, getApplication, getCount } from '../controllers/moderatorContent.js'

const router = express.Router()
router.use(roleMiddleware(["admin", "moderator"]))

router.get('/getAccess', getAccess)
router.get('/count', getCount);
router.get('/users', getUsers)
router.get('/team', getTeam)
router.get('/mentor', getMentor)
router.get('/event', getEvents)
router.get('/project', getProjects)
router.get('/application', getApplication)

export default router