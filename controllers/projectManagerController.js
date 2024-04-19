const mongoose = require("mongoose");
const ProjectManager = require("../models/projectManagerModel");

const User = require("../models/userModel");

const getProjectManager = async (req, res) => {
  try {
    const projectManager = await ProjectManager.find();
    res.status(200).json(projectManager);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getProjectManagerById = async (req, res) => {
  try {
    const projectManager = await ProjectManager.findById(req.params.id);
    if (!projectManager)
      return res.status(404).json({ message: "Project Manager not found" });

    const authOrgId = req.user.orgId;
    const projectManagerUser = await User.findById(projectManager.userId);
    const projectManagerOrgId = projectManagerUser.orgId;

    if (
      projectManagerOrgId.toString() !== authOrgId.toString() &&
      !req.user.is_admin
    )
      return res
        .status(401)
        .json({ message: "Unauthorized to access this project manager" });

    res.status(200).json(projectManager);
  } catch (error) {
    console.error("Error fetching project manager:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createProjectManager = async (req, res) => {
  try {
    const { project, user, role } = req.body;
    if (!project || !user || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const authOrgId = req.user.orgId;
    const projectManagerUser = await User.findById(user);
    const projectManagerOrgId = projectManagerUser.orgId;
    if (
      projectManagerOrgId.toString() !== authOrgId.toString() &&
      !req.user.is_admin
    )
      return res
        .status(401)
        .json({ message: "Unauthorized to access this project manager" });

    const projectManager = await ProjectManager.create({ project, user, role });
    res
      .status(201)
      .json({ message: "Project Manager created", projectManager });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProjectManager = async (req, res) => {
  try {
    const { project, user, role } = req.body;
    if (!project || !user || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const authOrgId = req.user.orgId;
    const projectManagerUser = await User.findById(user);
    const projectManagerOrgId = projectManagerUser.orgId;
    if (
      projectManagerOrgId.toString() !== authOrgId.toString() &&
      !req.user.is_admin
    )
      return res
        .status(401)
        .json({ message: "Unauthorized to access this project manager" });

    const projectManager = await ProjectManager.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Project Manager updated", projectManager });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProjectManager = async (req, res) => {
  try {
    const authOrgId = req.user.orgId;
    const projectManager = await ProjectManager.findById(req.params.id);
    if (!projectManager)
      return res.status(404).json({ message: "Project Manager not found" });
    const projectManagerOrgId = projectManager.user.orgId;
    if (
      projectManagerOrgId.toString() !== authOrgId.toString() &&
      !req.user.is_admin
    )
      return res
        .status(401)
        .json({ message: "Unauthorized to access this project manager" });

    const deletedProjectManager = await ProjectManager.findByIdAndDelete(
      req.params.id
    );
    res
      .status(200)
      .json({ message: "Project Manager deleted", projectManager });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjectManager,
  getProjectManagerById,
  createProjectManager,
};
