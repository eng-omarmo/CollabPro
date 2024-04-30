const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {
    createTodo,
    getTodo,
    getSingleTodo,
    updateTodo,
    deleteTodo

} = require("../controllers/todoController");


router.route("/").get(auth, getTodo).post(auth, createTodo);
router
    .route("/:id")
    .get(auth, getSingleTodo)
    .put(auth, updateTodo)
    .delete(auth, deleteTodo);

module.exports = router