const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
    getFeedbacks,
    createFeedback,
    updateFeedback,
    deleteFeedback,
    getFeedbackById
} = require("../controllers/feedbackController");

router.route("/").get(auth, getFeedbacks).post(auth, createFeedback);
router.route("/:id").get(auth, getFeedbackById).put(auth, updateFeedback).delete(auth, deleteFeedback);
module.exports = router