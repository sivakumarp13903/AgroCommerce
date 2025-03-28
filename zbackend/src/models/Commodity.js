const mongoose = require("mongoose");

const commoditySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default:1} 
});

const CommodityModel = mongoose.models.commodity || mongoose.model("commodity", commoditySchema);

module.exports = CommodityModel;
