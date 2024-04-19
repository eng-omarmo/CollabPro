const express = require("express");

const router = express.Router();
const { getTeam, createTeam, updateTeam, deleteTeam, getTeamById } = require("../controllers/teamController");
const auth = require("../middleware/auth");

router.route("/").get(auth, getTeam).post(auth, createTeam);
router
    .route("/:id")
    .get(auth, getTeamById)
    .put(auth, updateTeam)
    .delete(auth, deleteTeam);




module.exports = router