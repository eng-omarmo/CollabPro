const Feedback = require("../models/feedbackModel");

const mongoose = require("mongoose");
const ProjectManager = require("../models/projectManagerModel");

const getFeedbackById = async (req, res) => {
    try {
        const feedbackId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(feedbackId) || feedbackId === undefined) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const feedback = await Feedback.findById(feedbackId).populate("user project task");
        // check if the login user is admin  and the feedback belongs to the same organization
        const userRole = req.user.is_admin;
        const userOrgId = req.user.orgId;

        if (userRole || userOrgId == feedback.orgId || feedback.project.orgId == userOrgId) {
            if (!feedback) {
                return res.status(404).json({ message: "Feedback not found" });
            }
            return res.status(200).json({ message: "Feedback fetched", feedback });
        }

        //check if the login is project manager 
        const loginUser = req.user.id;
        const projectManagerId = await ProjectManager.findOne({ userId: loginUser, orgId: userOrgId }).populate("userId");
        if (projectManagerId && projectManagerId.userId.orgId == userOrgId) {
            return res.status(200).json({ message: "Feedback fetched", feedback });
        }
        res.status(401).json({ message: "Not authorized" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getFeedbacks = async (req, res) => {
    try {
        // check if the login user is admin
        const userRole = req.user.is_admin;
        if (!userRole) {
            return res.status(401).json({ message: "Not authorized" });
        }
        // get all feedbacks belonging to the same organization
        const feedbacks = await Feedback.find({ orgId: req.user.orgId }).populate("user project task");
        if (!feedbacks) {
            return res.status(404).json({ message: "Feedbacks not found" });
        }
        // check if the login user is a project manager and if the project manager belongs to the same organization and same project
        const loginUser = req.user.id;
        const projectManagerId = await ProjectManager.findOne({ userId: loginUser, orgId: req.user.orgId }).populate("userId");
        if (projectManagerId && projectManagerId.userId.orgId == req.user.orgId) {
            const projectFeedbacks = await Feedback.find({ orgId: req.user.orgId, project: projectManagerId.projectId }).populate("user project task");
            return res.status(200).json({ message: "Feedbacks fetched", feedbacks: projectFeedbacks });
        }
        res.status(200).json({ message: "Feedbacks fetched", feedbacks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createFeedback = async (req, res) => {
    try {
        const { user, project, task, feedbackType, description, status } = req.body;
        // Check if required fields are provided
        if (!user || !project || !task || !feedbackType || !description || !status) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const feedback = await Feedback.create({ user, project, task, feedbackType, description, status });
        res.status(201).json({ message: "Feedback created", feedback });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateFeedback = async (req, res) => {
    try {
        const { user, project, task, feedbackType, description, status } = req.body;
        // Check if required fields are provided
        if (!user || !project || !task || !feedbackType || !description || !status) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "Feedback updated", feedback });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Feedback deleted", feedback });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { createFeedback, updateFeedback, getFeedbacks, getFeedbackById, deleteFeedback }