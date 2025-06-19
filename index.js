const express = require("express");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes");
const listingRoutes = require("./routes/listing.routes");
const bookingRoutes = require("./routes/booking.routes");
const userRoutes = require("./routes/user.routes");
const cors = require("cors");
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*", // Or whatever your frontend runs on
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/listings", listingRoutes); // Listing routes
app.use("/api/bookings", bookingRoutes); // Booking routes
app.use("/api/users", userRoutes); // User management routes
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
