const projectTeamAssignment = require("../models/projectTeamAssignmentModel");
const mongoose = require("mongoose");
const Team = require("../models/teamModel");
const Project = require("../models/projectModel");


const getProjectTeamAssignment = async (req, res) => {
    try {
        const projectTeamAssignment = await projectTeamAssignment.find();
        res.status(200).json(projectTeamAssignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const createProjectTeamAssignment = async (req, res) => {
    if (!req.body.projectId || !req.body.teamId) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(req.body.projectId) || !mongoose.Types.ObjectId.isValid(req.body.teamId)) {
        return res.status(400).json({ message: "Invalid ID" });
    }
    const projectTeamAssignmentInfo = await projectTeamAssignment.findOne({ projectId: req.body.projectId, teamId: req.body.teamId });
    if (projectTeamAssignmentInfo) {
        return res.status(400).json({ message: "Project Team Assignment already exists" });
    }
    //check if the login in user is an admin or project manager
    const userRoles = req.user.is_admin;

    //get the project and team info
    const project = await Project.findById(req.body.projectId);
    const team = await Team.findById(req.body.teamId);

    if (!project || !team) {
        return res.status(404).json({ message: "Project not found or Team not found" });
    }
    //check if the project and team belong to the same organization

    if (project.orgId.toString() !== req.user.orgId.toString() && Team.orgId.toString() !== req.user.orgId.toString()) {
        return res.status(401).json({ message: "The project and team must belong to the same organization" });
    }

    //check n if the user is an admin or project manager of the organization in order to create a project team assignment
    const projectManagerInfo = await ProjectManager.findOne({ userId: req.user._id, projectId: project._id });
    if (!projectManagerInfo && (req.user.orgId.toString() !== project.orgId.toString() && req.user.orgId.toString() !== project.projectManagerId.orgId.toString())) {
        return res.status(401).json({ message: "Unauthorized to access this project" });
    }
    const projectTeamAssignment = new projectTeamAssignment(req.body);
    try {
        await projectTeamAssignment.save();
        res.status(201).json(projectTeamAssignment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
const getProjectTeamAssignmentById = async (req, res) => {
    try {
        const projectTeamAssignment = await projectTeamAssignment.findById(req.params.id);
        if (!projectTeamAssignment) {
            return res.status(404).json({ message: "projectTeamAssignment not found" });
        }
        res.status(200).json(projectTeamAssignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateProjectTeamAssignment = async (req, res) => {
    try {
        const projectTeamAssignment = await projectTeamAssignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!projectTeamAssignment) {
            return res.status(404).json({ message: "projectTeamAssignment not found" });
        }
        res.status(200).json(projectTeamAssignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProjectTeamAssignment = async (req, res) => {
    try {
        const projectTeamAssignment = await projectTeamAssignment.findByIdAndDelete(req.params.id);
        if (!projectTeamAssignment) {
            return res.status(404).json({ message: "projectTeamAssignment not found" });
        }
        res.status(200).json(projectTeamAssignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getProjectTeamAssignment,
    createProjectTeamAssignment,
    getProjectTeamAssignmentById,
    updateProjectTeamAssignment,
    deleteProjectTeamAssignment

}