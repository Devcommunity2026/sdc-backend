import express from "express";
import { getUsers, getTeam, getMentor, getEvents, getProjects, getCount, handelApply } from "../controllers/publicController.js";

const router = express.Router()

router.get('/stats', getCount)
router.get('/event', getEvents);
router.get('/team', getTeam);
router.get('/mentor', getMentor);
router.get('/project', getProjects);
router.post('/apply', handelApply)

export default router