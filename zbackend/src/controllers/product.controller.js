const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
      const { name, description, price, stock, image } = req.body;

      // If an image file is uploaded, use the image URL from the file
      const productImage = req.file ? `/uploads/products/${req.file.filename}` : image;  // Use the image URL or file path

      const product = new Product({
          name,
          description,
          price,
          stock,
          image: productImage  // Save the image URL in the database
      });

      await product.save();
      res.status(201).json({ message: 'Product created successfully', product });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
