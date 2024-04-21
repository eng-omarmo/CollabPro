const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {
    getTask,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,

} = require("../controllers/taskController");

router.route("/").get(auth, getTask).post(auth, createTask);
router.route("/:id").get(auth, getTaskById).put(auth, updateTask).delete(auth, deleteTask);
//search a task and sort tasks end points
router.route("/search").get(auth, getTaskById);
router.route("/sort").get(auth, getTaskById);

module.exports = router