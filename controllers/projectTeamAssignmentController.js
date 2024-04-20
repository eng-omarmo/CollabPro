const projectTeamAssignment = require("../models/projectTeamAssignmentModel");
const mongoose = require("mongoose");


const getProjectTeamAssignment = async (req, res) => {
    try {
        const projectTeamAssignment = await projectTeamAssignment.find();
        res.status(200).json(projectTeamAssignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const createProjectTeamAssignment = async (req, res) => {
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