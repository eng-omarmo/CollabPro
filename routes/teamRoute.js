const Team = require("../models/teamModel");

const express = require("express");
const router = express.Router();
const {} = require("../controllers/teamController");
const auth = require("../middleware/auth");

router.get("/team", auth, getTeam).post(auth, createTeam)
router.put("/team/:id", auth, updateTeam).delete(auth, deleteTeam)




module.exports = router