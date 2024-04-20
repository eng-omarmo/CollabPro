const mongoose = require("mongoose");

// Define the schema for assigning teams to projects
const projectTeamAssignmentSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true
    },
    // Add any additional fields as needed
    assignmentDate: {
        type: Date,
        default: Date.now
    }
});

// Create the model based on the schema
const ProjectTeamAssignment = mongoose.model("ProjectTeamAssignment", projectTeamAssignmentSchema);

// Export the model for use in other parts of the application
module.exports = ProjectTeamAssignment;
