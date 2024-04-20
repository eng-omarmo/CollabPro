const ProjectTeamAssignment = require('../models/ProjectTeamAssignmentModel')
const mongoose = require("mongoose");
const Team = require("../models/teamModel");
const Project = require("../models/projectModel");
const ProjectManager = require("../models/projectManagerModel");
const getProjectTeamAssignment = async (req, res) => {
    try {
        const loginUser = req.user;
        const projectTeamAssignment = await ProjectTeamAssignment.find()
        .populate('project')
        .populate('team')
        .populate('projectManager');
    
        console.log(projectTeamAssignment);
        if (!projectTeamAssignment.length) {
            res.status(404).json({ message: "Project Team Assignment not found" });
        }
        const projectTeamAssignmentInfo =projectTeamAssignment.filter(projectTeamAssignment => projectTeamAssignment.project.orgId.toString() === loginUser.orgId.toString());
        if (!projectTeamAssignmentInfo) {
            return res.status(404).json({ message: "Project Team Assignment not found" });
        }
        //if the login in user is project manager, return only the project team assignment that belongs to the same project

        res.status(200).json(projectTeamAssignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const createProjectTeamAssignment = async (req, res) => {

    try {
        const { projectId, teamId,projectManagerId } = req.body;
        if (!projectId || !teamId || !projectManagerId)  {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(teamId)) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const projectTeamAssignmentInfo = await ProjectTeamAssignment.findOne({ projectId: projectId, teamId: teamId ,projectManagerId:projectManagerId});
        console.log(projectTeamAssignmentInfo)

        if (projectTeamAssignmentInfo) {
            return res.status(400).json({ message: "Project Team Assignment already exists" });
        }
        //check if the login in user is an admin or project manager
        const userRoles = req.user.is_admin;

        //get the project and team info
        const project = await Project.findById(projectId);
        const team = await Team.findById(teamId);

        if (!project || !team) {
            return res.status(404).json({ message: "Project not found or Team not found" });
        }
        //check if the project and team belong to the same organization
        if (project.orgId.toString() !== req.user.orgId.toString() && team.orgId.toString() !== req.user.orgId.toString()) {
            return res.status(401).json({ message: "The project and team must belong to the same organization" });
        }
        //check n if the user is an admin or project manager of the organization in order to create a project team assignment
        const projectManagerInfo = await ProjectManager.findOne({ projectId: projectId })
            .populate({ path: 'userId', select: 'name email orgId' })
            .populate({ path: 'projectId', select: 'name description orgId' })
            .lean();
            console.log(projectManagerInfo)
        if (!projectManagerInfo && !userRoles) {
            return res.status(401).json({ message: "Unauthorized to create project team assignment" });
        }

        //check if the user is an admin or project manager of the organization in order to create a project team assignment
        const newProjectTeamAssignment = await ProjectTeamAssignment.create(
            {
                project: projectId,
                team: teamId,
                projectManager: projectManagerId
            }
        )
        res.status(200).json(newProjectTeamAssignment);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getProjectTeamAssignmentById = async (req, res) => {
    try {
        const projectTeamAssignment = await ProjectTeamAssignment.findById(req.params.id);
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

        const projectAssignmentId = req.params.id;
        const { projectId, teamId } = req.body;
        if (!projectId || !teamId) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!mongoose.Types.ObjectId.isValid(projectAssignmentId) || !mongoose.Types.ObjectId.isValid(req.body.projectId) || !mongoose.Types.ObjectId.isValid(req.body.teamId)) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const projectTeamAssignmentInfo = await ProjectTeamAssignment.findOne({ projectId: projectId, teamId: teamId });

        if (projectTeamAssignmentInfo !== null && projectTeamAssignmentInfo !== undefined) {
            return res.status(400).json({ message: "Project Team Assignment already exists" });
        }
        //check if the login in user is an admin or project manager
        const userRoles = req.user.is_admin;

        //get the project and team info
        const project = await Project.findById(projectId);
        const team = await Team.findById(teamId);
        console.log(project, team);
        if (!project || !team) {
            return res.status(404).json({ message: "Project not found or Team not found" });
        }
        //check if the project and team belong to the same organization
        if (project.orgId.toString() !== req.user.orgId.toString() && team.orgId.toString() !== req.user.orgId.toString()) {
            return res.status(401).json({ message: "The project and team must belong to the same organization" });
        }
        //check n if the user is an admin or project manager of the organization in order to create a project team assignment
        const projectManagerInfo = await ProjectManager.findOne({ projectId: projectId })
            .populate({ path: 'userId', select: 'name email orgId' })
            .populate({ path: 'projectId', select: 'name description orgId' })
            .lean();

        if (!projectManagerInfo && !userRoles) {
            return res.status(401).json({ message: "Unauthorized to create project team assignment" });
        }

        const projectTeamAssignment = await ProjectTeamAssignment.findByIdAndUpdate(projectAssignmentId,
            {
                project: projectId,
                team: teamId
            },
            { new: true });
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
        const projectTeamAssignment = await ProjectTeamAssignment.findByIdAndDelete(req.params.id);
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