const express = require("express");
const { addCommodity, listCommodity, removeCommodity , updateCommodity} = require("../controllers/commodity.controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const commodityRouter = express.Router();

// Ensure uploads folder exists
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// Image Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("./uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Routes
commodityRouter.post("/add", upload.single("image"), addCommodity);
commodityRouter.get("/list", listCommodity);
commodityRouter.post("/remove", removeCommodity);
commodityRouter.put("/update/:id", updateCommodity);


module.exports = commodityRouter;
