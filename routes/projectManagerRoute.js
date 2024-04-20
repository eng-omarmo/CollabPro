const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { 
    getAllProjectManager,
    getProjectManagerById,
    createProjectManager,
    updateProjectManager,
    deleteProjectManager
} = require("../controllers/projectManagerController");

router.post("/", auth, createProjectManager);

router.get("/get-all", auth, getAllProjectManager);

router
    .route("/:id")
    .get(auth, getProjectManagerById)
    .put(auth, updateProjectManager)
    .delete(auth, deleteProjectManager);

module.exports = router;