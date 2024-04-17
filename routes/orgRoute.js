const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {
  getOrg,
  createOrg,
  updateOrg,
  deleteOrg,
  getOrgById,
  verifyorganization
} = require("../controllers/orgController");
router.route("/").get(getOrg).post(createOrg);
router
  .route("/:id")
  .get(auth, getOrgById)
  .put(auth, updateOrg)
  .delete(auth, deleteOrg);

router.get("/verifyorganization/:token", verifyorganization);
module.exports = router;
