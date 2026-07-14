const express = require("express");

const router = express.Router();

const {
  createBooking,
  getBookings,
  cancelBooking,
} = require("../controllers/bookingController");

router.post("/", createBooking);

router.get("/", getBookings);

router.put("/:id/cancel", cancelBooking);

module.exports = router;
