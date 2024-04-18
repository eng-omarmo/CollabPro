const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {
  getOrg,
  createOrg,
  updateOrg,
  deleteOrg,
  getOrgById,
  verifyOrganization
} = require("../controllers/orgController");
router.route("/").get(getOrg).post(createOrg);
router
  .route("/:id")
  .get(auth, getOrgById)
  .put(auth, updateOrg)
  .delete(auth, deleteOrg);

router.get("/verifyOrganization/:token", verifyOrganization);
module.exports = router;
