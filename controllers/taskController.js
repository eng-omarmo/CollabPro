const Task = require("../models/taskModel");
const Project = require("../models/projectModel");
const Team = require("../models/teamModel");
const ProjectManager = require("../models/projectManagerModel");
const ProjectTeamAssignment = require("../models/ProjectTeamAssignmentModel");
const mongoose = require("mongoose");



const getTask = async (req, res) => {
    try {
        //check if the login is user or admin
        const userRole = req.user.is_admin;
        if (userRole) {
            const task = await Task.find();
            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }
            return res.status(200).json({ message: "Task found", task });
        }
        //check if the login is project manager
        const loginUser = req.user.id;
        const projectManagerId = await ProjectManager.findById(req.user.id);
        if (loginUser.toString() !== projectManagerId.userId.toString()) {
            return res.status(401).json({ message: "the login project manager is not the same as the one provided" });
        }
        //check if the project manager and assignedTo belong to the same organization
        const loginUserOrgId = req.user.orgId;
        const projectManagerTeam = await Team.find({ orgId: loginUserOrgId, projectManagerId: projectManagerId._id });
        if (!projectManagerTeam) {
            return res.status(404).json({ message: "the project manager does have team" });
        }
        const projectManagerTeamIds = projectManagerTeam.map(team => team._id);
        const projectTeamAssignment = await ProjectTeamAssignment.find({ project: projectId, team: { $in: projectManagerTeamIds } });
        if (!projectTeamAssignment) {
            return res.status(404).json({ message: "the project manager does have team" });
        }
        const tasks = await Task.find();
        if (!tasks) {
            res.status(404).json({ message: "Tasks not found" });
        }
        res.status(200).json({ message: "Task found", tasks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}


const getTaskById = async (req, res) => {
    try {
        const taskId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(taskId) || !taskId) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const findTask = await Task.findById(taskId);
        if(!findTask) {
            return res.status(404).json({ message: "Task not found" });
        }
    
        //check if the login is user or admin
        const userRole = req.user.is_admin;
        if (userRole && findTask.createdBy == req.user.id || req.user.orgId == findTask.orgId) {
            const task = await Task.findById(taskId);
            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }
            return res.status(200).json({ message: "Task found", task });
        }
        //check if the login is project manager
        const loginUser = req.user.id;
        const projectManagerId = await ProjectManager.findById(req.user.id);
        if (!projectManagerId || loginUser.toString() !== projectManagerId.userId.toString()) {
            return res.status(401).json({ message: "the login project manager is not the same as the one provided" });
        }
        //check if the project manager and assignedTo belong to the same organization
        const loginUserOrgId = req.user.orgId;
        const projectManagerTeam = await Team.find({ orgId: loginUserOrgId, projectManagerId: projectManagerId._id });
        if (!projectManagerTeam) {
            return res.status(404).json({ message: "the project manager does have team" });
        }
        const projectManagerTeamIds = projectManagerTeam.map(team => team._id);
        const projectTeamAssignment = await ProjectTeamAssignment.find({ project: projectId, team: { $in: projectManagerTeamIds } });
        if (!projectTeamAssignment) {
            return res.status(404).json({ message: "the project manager does have team" });
        }
        const tasks = await Task.findById(taskId);
        if (!tasks) {
            res.status(404).json({ message: "Tasks not found" });
        }
        res.status(200).json({ message: "Task found", tasks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}
const createTask = async (req, res) => {
    try {
        const { title, description, projectId, assignedTo, dueDate } = req.body;
        // Check if required fields are provided
        if (!req.body.createdBy || !mongoose.Types.ObjectId.isValid(req.body.createdBy)) {
            return res.status(400).json({ message: "Invalid user ID" })
        }
        // Check if required fields are provided
        if (!title || !description || !projectId) {
            return res.status(400).json({ message: "Title, description, and project ID are required fields" });
        }
        //check if the login in user is project manager 
        const loginUser = req.user.id;
        const projectManagerId = await ProjectManager.findById(req.body.createdBy);
        console.log(projectManagerId.userId, "this is the project manager id", loginUser);
        if (loginUser.toString() !== projectManagerId.userId.toString()) {
            return res.status(401).json({ message: "the login project manager is not the same as the one provided" });
        }
        //check  if the project manager and assignedTo belong to the same organization
        const loginUserOrgId = req.user.orgId;

        const projectManagerTeam = await Team.find({ orgId: loginUserOrgId, projectManagerId: projectManagerId._id });
        if (!projectManagerTeam) {
            return res.status(404).json({ message: "the project manager does have team" });
        }
        const projectManagerTeamIds = projectManagerTeam.map(team => team._id);
        const projectTeamAssignment = await ProjectTeamAssignment.find({ project: projectId, team: { $in: projectManagerTeamIds } });
        if (!projectTeamAssignment) {
            return res.status(404).json({ message: "the project manager does have team" });
        }

        //Create the task
        const createdBy = req.user._id;
        const newTask = await Task.create({
            title,
            description,
            project: projectId,
            assignedTo,
            dueDate,
            createdBy
        });

        res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const { title, description, projectId, assignedTo, dueDate } = req.body;
        // Check if required fields are provided
        if (!req.body.createdBy || mongoose.Types.ObjectId.isValid(req.body.createdBy) === false) {
            return res.status(400).json({ message: "Invalid user ID" })
        }
        // Check if required fields are provided
        if (!title || !description || !projectId) {
            return res.status(400).json({ message: "Title, description, and project ID are required fields" });
        }
        //check if the login in user is project manager 
        const loginUser = req.user.id;
        const expectedProjectManager= req.body.createdBy;

        console.log("this is the login user id",loginUser , "this is the project manager id",expectedProjectManager );
        
        if (loginUser!== expectedProjectManager) {
            return res.status(401).json({ message: "the login project manager is not the same as the one provided" });
        }
        //check  if the project manager and assignedTo belong to the same organization
        const loginUserOrgId = req.user.orgId;

        const projectManagerTeam = await Team.find({ orgId: loginUserOrgId, projectManagerId: projectManagerId._id });
        if (!projectManagerTeam) {
            return res.status(404).json({ message: "the project manager does have team" });
        }
        const projectManagerTeamIds = projectManagerTeam.map(team => team._id);
        const projectTeamAssignment = await ProjectTeamAssignment.find({ project: projectId, team: { $in: projectManagerTeamIds } });
        if (!projectTeamAssignment) {
            return res.status(404).json({ message: "the project manager does have team" });
        }
           //update the task
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, {
            title,
            description,
            project: projectId,
            assignedTo,
            dueDate
        }, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task updated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const findTask = await Task.findById(taskId);

        //check if the login is user or admin
        const userRole = req.user.is_admin;
        if (findTask || userRole && findTask.createdBy==req.user.id || req.user.orgId == findTask.orgId) {
            const task = await Task.findById(taskId);
            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }
            const deletedTask = await Task.findByIdAndDelete(taskId);
            res.status(200).json({ message: "Task deleted", deletedTask });
        }
        //check if the login is project manager
        const loginUser = req.user.id;
        const projectManagerId = await ProjectManager.findById(req.user.id);
        if (loginUser.toString() !== projectManagerId.userId.toString()) {
            return res.status(401).json({ message: "the login project manager is not the same as the one provided" });
        }
        //check if the project manager and assignedTo belong to the same organization
        const loginUserOrgId = req.user.orgId;
        const projectManagerTeam = await Team.find({ orgId: loginUserOrgId, projectManagerId: projectManagerId._id });
        if (!projectManagerTeam) {
            return res.status(404).json({ message: "the project manager does have team" });
        }
        const projectManagerTeamIds = projectManagerTeam.map(team => team._id);
        const projectTeamAssignment = await ProjectTeamAssignment.find({ project: projectId, team: { $in: projectManagerTeamIds } });
        if (!projectTeamAssignment) {
            return res.status(404).json({ message: "the project manager does have team" });
        }

        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task deleted, task: ", task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createTask, getTask, getTaskById, updateTask, deleteTask }