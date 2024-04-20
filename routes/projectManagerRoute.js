const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth")

const { getAllProjectManager,
    getProjectManagerById,
    createProjectManager,
    updateProjectManager,
    deleteProjectManager, } = require("../controllers/projectManagerController");
router.
    route("/")
    .post(auth, createProjectManager);

router.route("/get-all").get(auth, getAllProjectManager)

router
    .route("/:id")
    .get(auth, getProjectManagerById)
    .put(auth, updateProjectManager)
    .delete(auth, deleteProjectManager);
module.exports = router
