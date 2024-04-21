const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
    getProjectTeamAssignmentById,
    getProjectTeamAssignment,
    createProjectTeamAssignment,
    updateProjectTeamAssignment,
    deleteProjectTeamAssignment,
} = require("../controllers/projectTeamAssignmentController");
router
    .route("/get-all")
    .get(auth, getProjectTeamAssignment);
  
router.route("/").
    post(auth, createProjectTeamAssignment)

router
    .route("/:id")
    .put(auth, updateProjectTeamAssignment)
    .delete(auth, deleteProjectTeamAssignment)
    .get(auth, getProjectTeamAssignmentById);

module.exports = router;