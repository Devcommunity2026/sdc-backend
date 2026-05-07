import express from 'express'
import roleMiddleware from '../middlewares/roleMiddleware.js'
import { getAccess } from '../controllers/adminController.js'
import { editRole } from '../controllers/adminController.js'
import { banEdit } from '../controllers/adminController.js'

const router = express.Router()

router.use(roleMiddleware(["admin"]))
router.get('/getAccess', getAccess)
router.post('/editRole', editRole)
router.post('/banEdit', banEdit)

export default router