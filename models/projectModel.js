const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
    },
    
    createdAt: {   
        type: Date,
        default: Date.now
    }

});

const Project = mongoose.model("Project", projectSchema)

module.exports = Project