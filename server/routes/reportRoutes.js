const express = require("express");

const router = express.Router();

const {
  getAssetReport,
  getDepartmentReport,
  getMaintenanceReport,
} = require("../controllers/reportController");

router.get("/assets", getAssetReport);

router.get("/departments", getDepartmentReport);

router.get("/maintenance", getMaintenanceReport);

module.exports = router;