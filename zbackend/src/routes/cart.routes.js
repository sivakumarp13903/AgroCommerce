const express = require("express");
const { addToCart, removeFromCart, getCart } = require("../controllers/cart.controller.js");
const authMiddleware = require("../middleware/auth2.js");

const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.post("/remove", authMiddleware, removeFromCart);
cartRouter.post("/get", authMiddleware, getCart);

module.exports = cartRouter;
