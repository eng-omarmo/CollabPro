const Project = require("../models/projectModel");
const mongoose = require("mongoose");
const getProject = async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json({ message: "Projects found", projects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getProjectById = async (req, res) => {
    try {
        let projectId = req.params.id;
  
       
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(404).json({ message: "Invalid project ID" });
        }

        const project = await Project.findById(projectId);
        
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const orgId = req.user.orgId;
        
        if (orgId.toString() !== project.orgId.toString() && req.user.is_admin === true) {
            return res.status(401).json({ message: "Unauthorized to access this project" });
        }

        res.status(200).json({ message: "Project found", project });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createProject = async (req, res) => {
    try {
        const { name, description, orgId } = req.body;
        if (!name || !description, !orgId) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const authOrgId = req.user.orgId;
        if (authOrgId.toString() !== orgId.toString() && req.user.is_admin === true) {
            return res.status(401).json({ message: "Unauthorized to access this organization" });
        }
        const project = await Project.create({ name, description, orgId });
        res.status(201).json({ message: "Project created", project });


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const { name, description, orgId } = req.body;
        if (!name || !description, !orgId) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const authOrgId = req.user.orgId;
        if (authOrgId.toString() !== orgId.toString() && req.user.is_admin === true) {
            return res.status(401).json({ message: "Unauthorized to access this organization" });
        }
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "Project updated", project });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const id = req.params.id;
        const authOrgId = req.user.orgId;
        const projectData = await Project.findById(id);
        if (authOrgId.toString() !== projectData.orgId.toString() && req.user.is_admin === true) {
            return res.status(401).json({ message: "Unauthorized to access this organization" });
        }
        const project = await Project.findByIdAndDelete(id);
        res.status(200).json({ message: "Project deleted", project });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { getProject, getProjectById, createProject, updateProject, deleteProject };