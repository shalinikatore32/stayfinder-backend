const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Listing = require("./models/Listing");

dotenv.config();

const listings = [
  {
    title: "Modern Apartment in New York",
    location: "New York, NY",
    pricePerNight: 150,
    maxGuests: 4,
    amenities: ["Wi-Fi", "Air Conditioning", "Kitchen"],
    availableFrom: new Date("2025-06-20"),
    availableTo: new Date("2025-12-31"),
    description: "A beautiful and modern apartment in the heart of NYC.",
    image: "https://source.unsplash.com/featured/?apartment,newyork",
  },
  {
    title: "Cozy Cottage in the Mountains",
    location: "Asheville, NC",
    pricePerNight: 110,
    maxGuests: 3,
    amenities: ["Fireplace", "Mountain View", "Pet Friendly"],
    availableFrom: new Date("2025-07-01"),
    availableTo: new Date("2025-11-30"),
    description: "Escape the city and enjoy a peaceful stay in the mountains.",
    image: "https://source.unsplash.com/featured/?cabin,mountain",
  },
  {
    title: "Beachside Bungalow in Goa",
    location: "Goa, India",
    pricePerNight: 95,
    maxGuests: 2,
    amenities: ["Beach Access", "Wi-Fi", "Private Patio"],
    availableFrom: new Date("2025-06-15"),
    availableTo: new Date("2025-10-31"),
    description: "Relax in a beachside bungalow with ocean views.",
    image: "https://source.unsplash.com/featured/?beach,bungalow,goa",
  },
  {
    title: "Luxury Villa in Bali",
    location: "Bali, Indonesia",
    pricePerNight: 220,
    maxGuests: 6,
    amenities: ["Pool", "Chef Service", "Ocean View"],
    availableFrom: new Date("2025-06-25"),
    availableTo: new Date("2025-12-15"),
    description: "Private luxury villa with full amenities and staff.",
    image: "https://source.unsplash.com/featured/?villa,bali",
  },
  {
    title: "Historic Loft in Paris",
    location: "Paris, France",
    pricePerNight: 180,
    maxGuests: 3,
    amenities: ["Wi-Fi", "Balcony", "City View"],
    availableFrom: new Date("2025-07-10"),
    availableTo: new Date("2025-12-31"),
    description: "Charming loft with Eiffel Tower view and Parisian charm.",
    image: "https://source.unsplash.com/featured/?paris,loft",
  },
];

const seedListings = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const user = await User.findOne(); // assumes at least 1 user exists
    if (!user) throw new Error("Please seed a user before adding listings.");

    const listingsWithHost = listings.map((listing) => ({
      ...listing,
      host: user._id,
    }));

    await Listing.deleteMany();
    await Listing.insertMany(listingsWithHost);

    console.log("Listings seeded successfully.");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedListings();
