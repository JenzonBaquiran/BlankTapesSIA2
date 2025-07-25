const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const User = require("./models/user.model");
const Product = require("./models/product");
const ForgotRequest = require("./models/forgotRequest");
const Order = require("./models/order");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const multer = require("multer");
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });


// MongoDB Connection
mongoose.connect("mongodb+srv://baquiranjenzon:Jenzon0108@cluster0.0jgld8f.mongodb.net/", {});
mongoose.connection.on("connected", async () => {
 console.log(" Connected to Atlas MongoDB");

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

    // Validation
    if (!username || !email || !password) {
      return res.json({ success: false, error: "All fields are required." });
    }
    // Username: at least 3 chars
    if (typeof username !== "string" || username.length < 3) {
      return res.json({ success: false, error: "Username must be at least 3 characters." });
    }
    // Email: basic format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.json({ success: false, error: "Invalid email format." });
    }
    // Password: at least 6 chars
    if (typeof password !== "string" || password.length < 6) {
      return res.json({ success: false, error: "Password must be at least 6 characters." });
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

// Get user by username
app.get('/api/users/:username', async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// --- Product APIs ---

// Helper: Validate product input
function validateProductInput(body) {
  const errors = [];
  if (!body.name || typeof body.name !== "string") errors.push("Name is required.");
  if (!body.description || typeof body.description !== "string") errors.push("Description is required.");
  if (!body.price || isNaN(Number(body.price))) errors.push("Price is required and must be a number.");
  if (!body.category || typeof body.category !== "string") errors.push("Category is required.");
  if (body.stock === undefined || isNaN(Number(body.stock))) errors.push("Stock is required and must be a number.");
  if (!body.status || typeof body.status !== "string") errors.push("Status is required.");
  return errors;
}

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create product with image upload
app.post("/api/products", multer({ storage }).single("image"), async (req, res) => {
  const { name, price, description, category, stock, status } = req.body;
  const errors = validateProductInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";
    const product = new Product({
      name,
      price,
      description,
      imageUrl,
      category,
      stock,
      status,
      createdAt: new Date()
    });
    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update product (optionally with image)
app.put("/api/products/:id", multer({ storage }).single("image"), async (req, res) => {
  const errors = validateProductInput({ ...req.body });
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Product not found." });
    res.json({ success: true, product: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete product
app.delete("/api/products/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "Product ID is required." });
  }
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// --- Orders API ---
// Create new order
app.post("/api/orders", async (req, res) => {
  try {
    const { customer, items, total, status } = req.body;
    if (!customer || !items || !total) {
      return res.status(400).json({ error: "Missing order data." });
    }
    // Generate unique orderId
    const orderId = `BT-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`;
    const order = new Order({
      orderId,
      customer,
      items,
      total,
      status: status || "PENDING",
      date: new Date(),
    });
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get orders for logged-in customer (by username/email)
app.get("/api/orders/customer/:username", async (req, res) => {
  try {
    const users = await User.find({ username: req.params.username });
    if (!users.length) return res.json([]);
    const user = users[0];
    const orders = await Order.find({ "customer.email": user.email }).sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all orders (for admin/staff)
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update order status (admin/staff)
app.put("/api/orders/:orderId", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found." });
    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Mark order as paid
app.put("/api/orders/:orderId/pay", async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { paid: true },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found." });
    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete order
app.delete("/api/orders/:orderId", async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: "Order not found." });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get total amount paid for orders
app.get("/api/orders/amount-paid", async (req, res) => {
  try {
    const orders = await Order.find({ paid: true });
    const amountPaid = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    res.json({ amountPaid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// --- Password Reset Requests ---
// Customer requests password reset
app.post("/api/forgot-requests", async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found." });

    // Prevent duplicate pending requests
    const existing = await ForgotRequest.findOne({ username, status: "pending" });
    if (existing) return res.json({ success: true, message: "Request already pending." });

    const reqDoc = await ForgotRequest.create({
      username,
      email: user.email,
      status: "pending"
    });
    res.json({ success: true, request: reqDoc });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: get all forgot requests
app.get("/api/forgot-requests", async (req, res) => {
  const requests = await ForgotRequest.find().sort({ requestedAt: -1 });
  res.json(requests);
});

// Admin: approve request
app.post("/api/forgot-requests/:id/approve", async (req, res) => {
  const reqDoc = await ForgotRequest.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );
  if (!reqDoc) return res.status(404).json({ error: "Request not found." });
  res.json({ success: true, request: reqDoc });
});

// Admin: decline request
app.post("/api/forgot-requests/:id/decline", async (req, res) => {
  const reqDoc = await ForgotRequest.findByIdAndUpdate(
    req.params.id,
    { status: "declined" },
    { new: true }
  );
  if (!reqDoc) return res.status(404).json({ error: "Request not found." });
  res.json({ success: true, request: reqDoc });
});

// Check forgot password request status for a username
app.get("/api/forgot-requests/status/:username", async (req, res) => {
  const reqDoc = await ForgotRequest.findOne({
    username: req.params.username,
    status: { $in: ["pending", "approved", "declined"] }
  });
  if (!reqDoc) return res.json({ status: "none" });
  return res.json({ status: reqDoc.status });
});

// Customer: reset password (only if approved)
app.post("/api/users/reset-password", async (req, res) => {
  try {
    const { username, newPassword } = req.body;
    const reqDoc = await ForgotRequest.findOne({ username, status: "approved" });
    if (!reqDoc) return res.json({ success: false, error: "Not approved by admin." });

    const user = await User.findOne({ username });
    if (!user) return res.json({ success: false, error: "User not found." });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Mark request as used
    reqDoc.status = "used";
    await reqDoc.save();

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// Delete forgot password request
app.delete("/api/forgot-requests/:id", async (req, res) => {
  try {
    await ForgotRequest.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// --- Start Server ---
app.listen(port, "0.0.0.0", () => {
  console.log(` Server running at http://0.0.0.0:${port}`);
});