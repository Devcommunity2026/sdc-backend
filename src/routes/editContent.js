import express from "express";

import roleMiddleware from "../middlewares/roleMiddleware.js";

import {
    addEvent,
    deleteEvent,

    addProject,
    deleteProject,

    addCoreTeamMember,
    removeCoreTeamMember,

    addMentor,
    removeMentor, editApplication

} from "../controllers/editContent.js";

import { imageParser } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.use(roleMiddleware(['moderator', 'admin']));


// ================= EVENT =================

router.post(
    '/addEvent',
    imageParser.single('image'),
    addEvent
);

router.post(
    '/removeEvent',
    deleteEvent
);


// ================= PROJECT =================

router.post(
    '/addProject',
    imageParser.single('image'),
    addProject
);

router.post(
    '/removeProject',
    deleteProject
);


// ================= CORE TEAM =================

router.post(
    '/addCoreTeamMember',
    imageParser.single('image'),
    addCoreTeamMember
);

router.post(
    '/removeCoreTeamMember',
    removeCoreTeamMember
);


// ================= MENTOR =================

router.post(
    '/addMentor',
    imageParser.single('image'),
    addMentor
);

router.post(
    '/removeMentor',
    removeMentor
);


router.post('/application', editApplication)
export default router;