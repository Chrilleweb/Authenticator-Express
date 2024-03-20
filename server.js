require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const routes = require("./src/routes/indexRoutes");
const loginRegister = require("./src/routes/loginRegisterRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Session duration in milliseconds (e.g., 1 day)
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
    },
  }),
);

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

// Static files setup
app.use(express.static(path.join(__dirname, "public")));
app.use("/js", express.static(path.join(__dirname, "src", "components", "js")));

// Routes
app.use(routes);
app.use(loginRegister);

// MongoDB connection
async function connectToMongoDB() {
  try {
    const uri = process.env.MONGO_URL;
    const clientOptions = {
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    };
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
    return true; // Return true if connection succeeds
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return false; // Return false if connection fails
  }
}

// Start server
async function startServer() {
  try {
    const connected = await connectToMongoDB();
    if (!connected) {
      throw new Error("Failed to connect to MongoDB. Server cannot start.");
    }
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

// Call startServer to initiate server startup
startServer();

// Export app for testing or other purposes
module.exports = app;
