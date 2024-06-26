const mongoose = require('mongoose');

// Define the organization schema
const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['corporation', 'non-profit', 'government agency']
    },
    industry: String,
    address: {
        type: String,
        required: true
    },
    contact: {
        phone: String,
        email: String
    },
    website:{
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending']
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    logo:{
        type: String,
        required: true
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Create the organization model
const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;
