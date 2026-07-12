const Asset = require("../models/Asset");
const Department = require("../models/Department");
const Maintenance = require("../models/Maintenance");

// Asset Report
const getAssetReport = async (req, res) => {
  try {
    const assets = await Asset.find()
      .populate("category")
      .populate("assignedTo", "name email");

    res.json({
      success: true,
      count: assets.length,
      assets,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Department Report
const getDepartmentReport = async (req, res) => {
  try {
    const departments = await Department.find().populate("head", "name email");

    res.json({
      success: true,
      count: departments.length,
      departments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Maintenance Report
const getMaintenanceReport = async (req, res) => {
  try {
    const maintenance = await Maintenance.find()
      .populate("asset", "assetTag name")
      .populate("raisedBy", "name")
      .populate("technician", "name");

    res.json({
      success: true,
      count: maintenance.length,
      maintenance,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getAssetReport,
  getDepartmentReport,
  getMaintenanceReport,
};