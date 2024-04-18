const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const {
    getProject,
    createProject,
    updateProject,
    deleteProject,
    getProjectById
} = require("../controllers/projectController");

router.get("/", getProject)
    .post("/", auth, createProject);
router
    .route("/:id")
    .get(auth, getProjectById)
    .put(auth, updateProject)
    .delete(auth, deleteProject);



module.exports = router