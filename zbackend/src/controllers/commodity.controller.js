const CommodityModel = require("../models/Commodity");
const fs = require("fs");

// Add commodity item
const addCommodity = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File not uploaded. Please provide an image.",
      });
    }

    // Extract filename
    const image_filename = req.file.filename;

    // Create a new commodity item
    const commodity = new CommodityModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_filename,
    });

    // Save commodity item to the database
    await commodity.save();

    res.status(201).json({
      success: true,
      message: "Commodity item added successfully!",
    });
  } catch (error) {
    console.error("Error adding commodity item:", error.message);

    res.status(500).json({
      success: false,
      message: "An error occurred while adding the commodity item.",
    });
  }
};

// All commodity list 
const listCommodity = async (req, res) => {
    try {
      const commodities = await CommodityModel.find({});
      res.json({ success: true, data: commodities });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Remove commodity item
const removeCommodity = async (req, res) => {
    try {
      const commodity = await CommodityModel.findById(req.body.id);
      if (commodity && commodity.image) {
        fs.unlink(`uploads/${commodity.image}`, () => {});
      }

      await CommodityModel.findByIdAndDelete(req.body.id);
      res.json({ success: true, message: "Commodity removed" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" });
    }
}

// Update Commodity by ID
const updateCommodity = async (req, res) => {
  try {
    const { id } = req.params; // Get the commodity ID from the URL
    const { name, description, price, category } = req.body; // Get updated fields

    // Find and update the commodity
    const updatedCommodity = await CommodityModel.findByIdAndUpdate(
      id,
      { name, description, price, category },
      { new: true } // Returns the updated document
    );

    if (!updatedCommodity) {
      return res.status(404).json({
        success: false,
        message: "Commodity not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Commodity updated successfully",
      data: updatedCommodity,
    });
  } catch (error) {
    console.error("Error updating commodity:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the commodity.",
    });
  }
};

module.exports = { addCommodity, listCommodity, removeCommodity , updateCommodity};
