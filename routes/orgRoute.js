const express = require("express");
const router = express.Router();
const {
    getOrg,
    createOrg,
    updateOrg,
    deleteOrg,
    getOrgById
} = require("../controllers/orgController");
router.route("/").get(getOrg).post(createOrg);
router.route("/:id").get(getOrgById).put(updateOrg).delete(deleteOrg);
module.exports = router