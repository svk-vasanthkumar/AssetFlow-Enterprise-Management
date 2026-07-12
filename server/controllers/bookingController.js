const Booking = require("../models/Booking");

// Create Booking
const createBooking = async (req, res) => {
  try {
    const { resource, startTime, endTime } = req.body;

    const overlap = await Booking.findOne({
      resource,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
      status: { $ne: "Cancelled" },
    });

    if (overlap) {
      return res.status(400).json({
        success: false,
        message: "Resource already booked for this time slot",
      });
    }

    const booking = await Booking.create(req.body);

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get All Bookings
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("resource", "assetTag name")
      .populate("employee", "name email");

    res.json({
      success: true,
      bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Cancel Booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    booking.status = "Cancelled";

    await booking.save();

    res.json({
      success: true,
      message: "Booking Cancelled",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createBooking,
  getBookings,
  cancelBooking,
};