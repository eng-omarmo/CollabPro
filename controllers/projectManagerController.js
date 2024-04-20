const mongoose = require("mongoose");
const ProjectManager = require("../models/projectManagerModel");
const User = require("../models/userModel");
const Organization = require("../models/organizationModel");
const Project = require("../models/projectModel");

const getAllProjectManager = async (req, res) => {
  try {


    //query the project all the projects of this organization
    const orgId = req.user.orgId
    const allProject = await Project.find({ 'orgId': orgId })
    if (!allProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // keep only the project ids of this organization
    const projectIds = allProject.map(project => project._id);

    // Query project managers associated with the organization
    const projectManagers = await ProjectManager.find({ 'projectId': { $in: projectIds } })
      .populate({
        path: 'userId',
        select: 'name email orgId',
      })
      .populate({
        path: 'projectId',
        select: 'name description orgId'
      })
      .lean();


    // Check authorization for each project manager
    for (const projectManager of projectManagers) {
      if (
        projectManager.projectId.orgId.toString() !== req.user.orgId.toString() ||
        projectManager.userId.orgId.toString() !== req.user.orgId.toString() && req.user.is_admin
      ) {
        return res.status(401).json({ message: "Unauthorized to access this project manager" });
      }
    }

    // If all checks pass, return project managers
    res.status(200).json(projectManagers);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectManagerById = async (req, res) => {
  try {
    // Check if the provided project manager ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Invalid project manager ID" });
    }

    // Find the project manager by ID and populate the associated user and project
    const projectManager = await ProjectManager.findById(req.params.id)
      .populate({
        path: 'userId',
        select: 'name email orgId',
      })
      .populate({
        path: 'projectId',
        select: 'name description orgId'
      })
      .lean();
    console.log(projectManager)

    // If project manager not found, return 404 error
    if (!projectManager) {
      return res.status(404).json({ message: "Project Manager not found" });
    }

    // Check if the organization of the project manager matches the authenticated user's organization
    if (projectManager.projectId.orgId.toString() !== req.user.orgId.toString() && projectManager.userId.orgId.toString() !== req.user.orgId.toString()) {
      return res.status(401).json({ message: "Unauthorized to access this project manager" });
    }
    // Return the project manager data
    res.status(200).json(projectManager);
  } catch (error) {
    console.error("Error fetching project manager:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const createProjectManager = async (req, res) => {
  try {
    const { project, user, role } = req.body;
    console.log(project, user, role)
    if (!project || !user || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(project) || !mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const authOrgId = req.user.orgId;

    const projectManagerUser = await User.findById(user);
    const projectManagerOrgId = projectManagerUser.orgId;
    if (
      projectManagerOrgId !== authOrgId &&
      !req.user.is_admin
    )
      return res
        .status(401)
        .json({ message: "Unauthorized to access this project manager" });

    const createdProjectManager = await ProjectManager.create({ projectId: project, userId: user, role });

    res
      .status(201)
      .json({ message: "Project Manager created", createdProjectManager });
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
    if (!req.params.id || req.params.id === undefined || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
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

    const deletedProjectManagerInfo = await ProjectManager.findByIdAndDelete(
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
  getAllProjectManager,
  getProjectManagerById,
  createProjectManager,
  updateProjectManager,
  deleteProjectManager,
};
