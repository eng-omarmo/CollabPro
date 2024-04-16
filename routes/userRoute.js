const express = require("express");
const router = express.Router();
const {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
} = require("../controllers/userController");

router.route("/").get(getUser).post(createUser);
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
