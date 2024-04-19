const mongoose = require("mongoose");

const projectManagerSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    role: {
        type: String,
        default: "Project Manager"
    }
});

const ProjectManager = mongoose.model("ProjectManager", projectManagerSchema);

module.exports = ProjectManager;
