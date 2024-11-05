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
  login,
  forgetPassword,
  resetPassword,
  getResetPassword
} = require("../controllers/userController");


router.route("/").get(auth,is_admin,getUser).post(createUser)
router.route("/:id").get(auth, getUserById).put(auth, updateUser).delete(auth, deleteUser);

router.get('/verify/:token', verifyUser)
router.post('/login', login).post('/forget-password',forgetPassword).post('reset-password/:token',resetPassword)


module.exports = router;
