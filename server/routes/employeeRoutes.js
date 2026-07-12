const express = require("express");

const router = express.Router();

const {
  getEmployees,
  updateEmployee,
} = require("../controllers/employeeController");

router.get("/", getEmployees);

router.put("/:id", updateEmployee);

module.exports = router;