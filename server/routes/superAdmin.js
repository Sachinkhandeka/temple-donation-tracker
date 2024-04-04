const express = require("express");
const router = express.Router({ mergeParams : true });
const superAdmin = require("../controllers/superAdminController");
const wrapAsync = require("../utils/wrapAsync");

router.post(
    "/create",
    wrapAsync(superAdmin.createController),
);

module.exports = router ; 