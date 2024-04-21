const mongoose = require("mongoose");
const Team = require("../models/teamModel");
const Project = require("../models/projectModel");
const User = require("../models/userModel");
const getTeam = async (req, res) => {
    try {
        const authOrgId = req.user.orgId;

        // Check if the user is an admin
        const isAdmin = req.user.is_admin;

        // If user is admin, they can retrieve all teams
        if (isAdmin) {
            const teams = await Team.find({ orgId: authOrgId });
            if (!teams || teams.length === 0) {
                return res.status(404).json({ message: "No teams found for the organization" });
            }
            return res.status(200).json({ message: "Teams found", teams });
        }

        // If user is not admin, check if they are a project manager of any project
        const projectManager = await ProjectManager.findOne({ userId: req.user._id });
        if (!projectManager) {
            return res.status(401).json({ message: "Unauthorized: Only project managers or admins can access team information" });
        }

        // Get the projects managed by the user
        const projects = await Project.find({ projectManagerId: projectManager._id });

        // Get teams associated with the projects managed by the user
        const teams = await Team.find({ orgId: authOrgId, projectId: { $in: projects.map(project => project._id) } });

        if (!teams || teams.length === 0) {
            return res.status(404).json({ message: "No teams found for the projects managed by the user" });
        }

        res.status(200).json({ message: "Teams found", teams });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        const authOrgId = req.user.orgId;
        //also check if user is admin or project manager of the team
        if (authOrgId.toString() !== team.orgId.toString() && req.user.is_admin === true) {
            return res.status(401).json({ message: "Unauthorized to access this organization" });
        }
        res.status(200).json({ message: "Team found", team });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const createTeam = async (req, res) => {
    try {
        const { name, description, orgId } = req.body;
        if (!name || !description || !orgId) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const checkTeam = await Team.findOne({ name });
        if (checkTeam) {
            return res.status(400).json({ message: "Team already exists" });
        }
        const authOrgId = req.user.orgId;
        if (authOrgId.toString() !== orgId.toString() && req.user.is_admin === true) {
            return res.status(401).json({ message: "Unauthorized to access this organization" });
        }
        const team = await Team.create({ name, description, orgId });
        res.status(201).json({ message: "Team created", team });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTeam = async (req, res) => {
    try {
        const { name, description, orgId } = req.body;
        if (!name || !description || !orgId) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const authOrgId = req.user.orgId;
        if (authOrgId.toString() !== orgId.toString() && req.user.is_admin === true) {
            return res.status(401).json({ message: "Unauthorized to access this organization" });
        }
        const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "Team updated", team });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};



const deleteTeam = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const authOrgId = req.user.orgId;
        const teamData = await Team.findById(id);
        if (!teamData) {
            return res.status(404).json({ message: "Team not found" });
        }
        if (authOrgId.toString() !== teamData.orgId.toString() && req.user.is_admin === true) {
            return res.status(401).json({ message: "Unauthorized to access this organization" });
        }
        const team = await Team.findByIdAndDelete(id);
        res.status(200).json({ message: "Team deleted", team });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};


module.exports = { createTeam, getTeam, getTeamById, updateTeam, deleteTeam }