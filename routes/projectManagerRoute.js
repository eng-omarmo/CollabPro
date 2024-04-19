const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
    getProjectManager,
    createProjectManager,
    updateProjectManager,
    deleteProjectManager,
    getProjectManagerById
} = require("../controllers/projectManagerController");
router.route("/").get(auth, getProjectManager).post(auth, createProjectManager);  

router
    .route("/:id")
    .get(auth, getProjectManagerById)
    .put(auth, updateProjectManager)
    .delete(auth, deleteProjectManager);
module.exports = router
