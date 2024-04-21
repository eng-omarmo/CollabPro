const Task = require("../models/taskModel");
const Project = require("../models/projectModel");
const Team = require("../models/teamModel");
const ProjectManager = require("../models/projectManagerModel");
const ProjectTeamAssignment = require("../models/ProjectTeamAssignmentModel");
const mongoose = require("mongoose");


const createTask = async (req, res) => {
    try {
        res.status(201).json({message: "Task created"});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
 
const getTask = async (req, res) => {
    try {
        res.status(200).json({message: "Task found"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}
const getTaskById = async (req, res) => {
    try {
        res.status(200).json({message: "Task found"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateTask = async (req, res) => {
    try {
        res.status(200).json({message: "Task updated"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteTask = async (req, res) => {
    try {
        res.status(200).json({message: "Task deleted"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = { createTask, getTask, getTaskById, updateTask, deleteTask }