const Todo = require("../models/todoModel");

//get all todos
const getTodo = async (req, res) => {
    try {
        //login user can see all todos belonging to them
        const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
        if (!todos) {
            return res.status(404).json({ message: "Todos not found" });
        }
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//create todo
const createTodo = async (req, res) => {
    try {
        let { title, description, status } = req.body;
        if (!title || !description || !status) {
            return res.status(400).json({ message: "All fields are required" });
        }
        //check if the login user is project manager 
        const loginUser = req.user.id;
        if (!loginUser) {
            return res.status(400).json({ message: "Login user not found" });
        }
        const checkExist = await Todo.findOne({ title, user: loginUser });
        if (checkExist) {
            return res.status(400).json({ message: "Todo already exists" });
        }
        if(status !== "completed"){
           status =false;
        }
        const todo = await Todo.create({ title, description, status, user: loginUser });
        res.status(201).json({ message: "Todo created", todo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//update todo
const updateTodo = async (req, res) => {
    try {
        let { id } = req.params;
        let { title, description, status } = req.body;
        if (!title || !description || !status) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        if (todo.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if(status !== "completed"){
            status =false;
         }
        //update todo
        const updatedTodo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ message: "Todo updated", updatedTodo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//delete todo
const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        if (todo.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        await Todo.findByIdAndDelete(id);
        res.status(200).json({ message: "Todo deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get single todo
const getSingleTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo,
    getSingleTodo
};
