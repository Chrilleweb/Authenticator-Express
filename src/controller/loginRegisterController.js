const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register_get = (req, res) => {
  res.render("Register", {
    pageTitle: "Register",
    message: "",
  });
};

// Register a new user
const register_post = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if password is provided
    if (!password) {
      return res.status(400).render("Register", {
        pageTitle: "Register",
        message: "Password is required",
      });
    }

    // Check if the username is taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).render("Register", {
        pageTitle: "Register",
        message: "Username is already taken",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).render("Register", {
      pageTitle: "Register",
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login_get = (req, res) => {
  res.render("Login", {
    pageTitle: "Login",
    message: "",
  });
};

const login_post = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).render("Login", {
        pageTitle: "Login",
        message: "Invalid username and password",
      });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).render("Login", {
        pageTitle: "Login",
        message: "Invalid password",
      });
    }

    // Create and sign a JWT using the secret key from environment variable
    const token = jwt.sign(
      { userId: user._id, userName: user.username },
      process.env.JWT_SECRET,
    );

    // Store user data in session
    req.session.user = { _id: user._id, username: user.username };

    // Render the login page with success message
    res.render("Login", {
      pageTitle: "Login",
      message: "Successfully logged in",
      token: token,
    });
  } catch (error) {
    console.error("Login failed: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout_get = (req, res) => {
  localStorage.removeItem("token");
  res.status(200).render("Login", {
    title: "Login",
    message: "User logged out successfully",
  });
};

module.exports = {
  login_get,
  login_post,
  register_get,
  register_post,
  logout_get,
};
