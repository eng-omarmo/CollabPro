const express = require("express");
const router = express.Router();
const {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  verifyUser
} = require("../controllers/userController");


router.route("/").get(getUser).post(createUser)
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

router.get('/verify/:token',verifyUser)
module.exports = router;
