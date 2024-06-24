const mongoose = require("mongoose");

const ForgetPasswordSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true
    },
    expiration: {
        type: Date,
        required: true
    }
});

const ForgetPassword = mongoose.model("ForgetPassword", ForgetPasswordSchema);

module.exports = ForgetPassword;
