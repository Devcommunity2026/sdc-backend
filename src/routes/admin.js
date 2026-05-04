import express from 'express'
import adminMiddleware from '../middlewares/adminMiddleware.js'
import { getAccess } from '../controllers/adminController.js'
import { editRole } from '../controllers/adminController.js'

const router = express.Router()

router.use(adminMiddleware)
router.get('/getAccess', getAccess)
router.post('/editRole', editRole)

export default router