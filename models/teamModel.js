const mongoose = require("mongoose");
const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending']
    },

    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },
  
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Team = mongoose.model("Team", teamSchema);