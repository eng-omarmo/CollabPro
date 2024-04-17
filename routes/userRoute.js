const express = require("express");
const router = express.Router();

const auth = require('../middleware/auth');
const {is_admin} = require('../middleware/isAdmin');
const {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  verifyUser,
  loginUser
} = require("../controllers/userController");


router.route("/").get(auth,is_admin,getUser).post(createUser)
router.route("/:id").get(auth, getUserById).put(auth, updateUser).delete(auth, deleteUser);

router.get('/verify/:token', verifyUser)
router.post('/login', loginUser)
module.exports = router;
