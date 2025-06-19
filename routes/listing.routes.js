const express = require("express");
const { searchListings } = require("../controllers/listingController");
const { getAllListings } = require("../controllers/listingController");
const { getSingleListing } = require("../controllers/listingController");
const router = express.Router();
router.get("/", getAllListings);
router.get("/search", searchListings);
router.get("/:id", getSingleListing);

module.exports = router;
