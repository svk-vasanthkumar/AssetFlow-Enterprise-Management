const Asset = require("../models/Asset");
const User = require("../models/User");
const Department = require("../models/Department");
const Booking = require("../models/Booking");

const getDashboard = async (req, res) => {
  try {
    const totalAssets = await Asset.countDocuments();

    const availableAssets = await Asset.countDocuments({
      status: "Available",
    });

    const allocatedAssets = await Asset.countDocuments({
      status: "Allocated",
    });

    const maintenanceAssets = await Asset.countDocuments({
      status: "Under Maintenance",
    });

    const totalEmployees = await User.countDocuments();

    const totalDepartments = await Department.countDocuments();

    const activeBookings = await Booking.countDocuments({
      status: "Upcoming",
    });

    res.status(200).json({
      success: true,
      dashboard: {
        totalAssets,
        availableAssets,
        allocatedAssets,
        maintenanceAssets,
        totalEmployees,
        totalDepartments,
        activeBookings,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getDashboard };