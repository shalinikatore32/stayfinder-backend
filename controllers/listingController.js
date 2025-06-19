const Listing = require("../models/Listing");

const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch listings" });
  }
};

const getSingleListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch listing" });
  }
};
const searchListings = async (req, res) => {
  try {
    const { location, checkIn, checkOut, guests, price } = req.query;

    const query = {};

    // Apply filters only if values are provided
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (checkIn && checkOut) {
      query.availableFrom = { $lte: new Date(checkIn) };
      query.availableTo = { $gte: new Date(checkOut) };
    }

    if (guests) {
      query.maxGuests = { $gte: Number(guests) };
    }

    if (price) {
      query.pricePerNight = { $lte: Number(price) };
    }

    const listings = await Listing.find(query);

    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed" });
  }
};

module.exports = {
  searchListings,
  getAllListings,
  getSingleListing,
};
