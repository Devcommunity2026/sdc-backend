import errorClass from "../utils/errorClass.js";
import {
    addCoreTeamMemberData,
    removeCoreTeamMemberData
} from "../services/coreTeamService.js";

import {
    addMentorData,
    removeMentorData
} from "../services/mentorService.js";

import {
    addEventData,
    deleteEventData
} from "../services/eventService.js";

import {
    addProjectData,
    deleteProjectData
} from "../services/projectService.js";


// ================= ADD EVENT =================

export const addEvent = async (req, res, next) => {
    try {

        const userData = req.body;

        const data = {
            name: userData.name,
            subHeading: userData.subHeading,
            description: userData.description,
            date: new Date(userData.date),
            form: userData.form,
            thumbnail: req.file.path
        };

        return await addEventData(data, req, res, next);

    } catch (error) {

        const err = new errorClass(
            false,
            500,
            'Unable To Add Event',
            `userId:${req.details.userId} add Event failed`,
            error
        );

        next(err);
    }
};


// ================= DELETE EVENT =================

export const deleteEvent = async (req, res, next) => {
    try {

        return await deleteEventData(
            req.body.id,
            req,
            res,
            next
        );

    } catch (error) {

        const err = new errorClass(
            false,
            500,
            'Unable To Delete Event',
            `userId:${req.details.userId} delete Event failed`,
            error
        );

        next(err);
    }
};


// ================= ADD PROJECT =================

export const addProject = async (req, res, next) => {
    try {

        const userData = req.body;

        const data = {
            name: userData.name,
            subHeading: userData.subHeading,
            description: userData.description,
            github: userData.github,
            live: userData.live,
            techStack: JSON.parse(userData.techStack),
            thumbnail: req.file.path
        };

        return await addProjectData(data, req, res, next);

    } catch (error) {

        const err = new errorClass(
            false,
            500,
            'Unable To Add Project',
            `userId:${req.details.userId} add Project failed`,
            error
        );

        next(err);
    }
};


// ================= DELETE PROJECT =================

export const deleteProject = async (req, res, next) => {
    try {

        return await deleteProjectData(
            req.body.id,
            req,
            res,
            next
        );

    } catch (error) {

        const err = new errorClass(
            false,
            500,
            'Unable To Delete Project',
            `userId:${req.details.userId} delete Project failed`,
            error
        );

        next(err);
    }
};

// ================= ADD CORE TEAM MEMBER =================

export const addCoreTeamMember = async (
    req,
    res,
    next
) => {

    try {

        const userData = req.body;

        const data = {
            name: userData.name,
            post: userData.post,
            linkedin: userData.linkedin,
            image: req.file.path
        };

        return await addCoreTeamMemberData(
            data,
            req,
            res,
            next
        );

    } catch (error) {

        const err = new errorClass(
            false,
            500,
            "Unable To Add Core Team Member",
            `userId:${req.details.userId} add core team member failed`,
            error
        );

        next(err);
    }
};


// ================= REMOVE CORE TEAM MEMBER =================

export const removeCoreTeamMember = async (
    req,
    res,
    next
) => {

    try {

        return await removeCoreTeamMemberData(
            req.body.id,
            req,
            res,
            next
        );

    } catch (error) {

        const err = new errorClass(
            false,
            500,
            "Unable To Remove Core Team Member",
            `userId:${req.details.userId} remove core team member failed`,
            error
        );

        next(err);
    }
};

// ================= ADD MENTOR =================

export const addMentor = async (
    req,
    res,
    next
) => {

    try {

        const userData = req.body;

        const data = {
            name: userData.name,
            description: userData.description,
            linkedin: userData.linkedin,
            image: req.file.path
        };

        return await addMentorData(
            data,
            req,
            res,
            next
        );

    } catch (error) {

        const err = new errorClass(
            false,
            500,
            "Unable To Add Mentor",
            `userId:${req.details.userId} add mentor failed`,
            error
        );

        next(err);
    }
};


// ================= REMOVE MENTOR =================

export const removeMentor = async (
    req,
    res,
    next
) => {

    try {

        return await removeMentorData(
            req.body.id,
            req,
            res,
            next
        );

    } catch (error) {

        const err = new errorClass(
            false,
            500,
            "Unable To Remove Mentor",
            `userId:${req.details.userId} remove mentor failed`,
            error
        );

        next(err);
    }
};