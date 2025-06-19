require("dotenv").config();
const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Listing = require("../models/Listing");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const { isAuthenticated } = require("../middleware/auth");
const { getUserBookings } = require("../controllers/bookingController");

router.get("/user", isAuthenticated, getUserBookings);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { listingId, userId, checkInDate, checkOutDate, guests } = req.body;
    const listing = await Listing.findById(listingId);

    const totalPrice =
      listing.pricePerNight *
      Math.ceil(
        (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
      );

    const booking = await Booking.create({
      user: userId,
      listing: listingId,
      checkInDate,
      checkOutDate,
      guests,
      totalPrice,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: listing.title,
              description: listing.description,
            },
            unit_amount: totalPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/booking-success?bookingId=${booking._id}`,
      cancel_url: `${process.env.CLIENT_URL}/listings/${listingId}`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: "Payment initiation failed" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("listing");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json(booking);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching booking", error: err.message });
  }
});

module.exports = router;
