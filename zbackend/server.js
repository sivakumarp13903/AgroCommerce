require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./src/config/database");
const path = require("path");

// Import Routes
const userRoutes = require("./src/routes/user.routes");
const productRoutes = require("./src/routes/product.routes");
const orderRoutes = require("./src/routes/order.routes");
const jobRoutes = require("./src/routes/job.routes");
const authRoutes = require("./src/routes/auth.routes");
const adminRoutes = require("./src/routes/admin.routes");
const otpRoutes = require("./src/routes/otpRoutes");
const paymentRoutes = require("./src/routes/payment.router");
const jobApplicationRoutes = require("./src/routes/jobApplication.routes");
const workProgressRoutes = require("./src/routes/workProgress.routes");
const commodityRouter = require("./src/routes/commodity.routes");
const cartRouter = require("./src/routes/cart.routes");
const adminDashboardRoutes = require("./src/routes/dashboard.routes");

// Initialize Express App
const app = express();

// ✅ **CORS Configuration**
const corsOptions = {
  origin: "*", // Allow all origins (for development)
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization, token", // Add 'token' explicitly
};
app.use(cors(corsOptions));


// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));


app.use('/fonts', express.static(path.join(__dirname, 'public/fonts'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.woff')) res.setHeader('Content-Type', 'font/woff');
    if (path.endsWith('.woff2')) res.setHeader('Content-Type', 'font/woff2');
  }
}));


// ✅ **Serve Images with Proper Headers**
app.use("/images", express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
  }
}));

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api", userRoutes);
app.use("/api/products", productRoutes);

app.use("/api/jobs", jobRoutes);
app.use("/api", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", otpRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/job-applications", jobApplicationRoutes);
app.use("/api/workprogress", workProgressRoutes);
app.use("/api/commodity", commodityRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);




// Root Endpoint
app.get("/", (req, res) => {
  res.send("🚀 Smart Agri-Commerce & Workforce Management API Running!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
