const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const Product = require("./models/product");
const User = require("./models/user.model");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const validator = require("validator");
const fs = require("fs");
const app = express();
const port = 1337;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(mongoSanitize());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/BlankTapes", {});
mongoose.connection.on("connected", async () => {
  console.log(" Connected to MongoDB");

  // Ensure default admin exists
  const admin = await User.findOne({ username: "admin" });
  if (!admin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      id: "1",
      username: "admin",
      password: hashedPassword,
      role: "admin",
      email: "admin@blanktapes.com",
      status: "active",
      created: new Date().toISOString().slice(0, 10),
      lastLogin: "",
    });
    console.log("Default admin account created: admin / admin123");
  }
});
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

// --- Product Image Upload Setup ---


// --- User APIs ---

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().sort({ created: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add user
app.post("/api/users", async (req, res) => {
  try {
    const { username, email, password, role, status } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, and password are required." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      role,
      status,
      created: new Date().toISOString().slice(0, 10),
      lastLogin: "",
    });
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update user
app.put("/api/users/:id", async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    } else {
      delete update.password;
    }
    const user = await User.findOneAndUpdate({ id: req.params.id }, update, { new: true });
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete user
app.delete("/api/users/:id", async (req, res) => {
  try {
    await User.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- User Signup ---
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.json({ success: false, error: "All fields are required." });
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.json({ success: false, error: "Username or email already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      role: "customer",
      status: "active",
      created: new Date().toISOString().slice(0, 10),
      lastLogin: "",
    });
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// --- User Login ---
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.json({ success: false, error: "All fields are required." });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ success: false, error: "Invalid username or password." });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, error: "Invalid username or password." });
    }
    user.lastLogin = new Date().toISOString();
    await user.save();
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        created: user.created,
        lastLogin: user.lastLogin,
      },
    });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// --- Start Server ---
app.listen(port, () => {
  console.log(` Server running at http://localhost:${port}`);
});