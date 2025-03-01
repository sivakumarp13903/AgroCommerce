import React, { useState } from "react";
import "./AddCommodity.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { assets } from "../../../assets/assets";

const AddCommodity = ({ url }) => {
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Seeds",
  });

  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/commodity/add`,
        formData
      );
      if (response.data.success) {
        setData({ name: "", description: "", price: "", category: "Seeds" });
        setImage(false);

        // Show both toast notification and alert
        toast.success(response.data.message);
        alert("✅ Product added successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to add the product. Please try again.");
    }
  };

  return (
    <div className="add">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>
      <form
        enctype="multipart/form-data"
        className="flex-col"
        onSubmit={onSubmitHandler}
      >
        {/* Image Upload */}
        <div className="add-img-upload flex-col">
          <p>Upload Product Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="Upload Preview"
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            accept="image/*"
            id="image"
            hidden
            required
          />
        </div>

        {/* Product Name */}
        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Product Description */}
        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Describe the product (e.g., quality, usage, benefits)"
            required
          ></textarea>
        </div>

        {/* Category & Price */}
        <div className="add-category-price">
          {/* Category Selection */}
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select
              style={{ backgroundColor: "white", color: "black" }}
              onChange={onChangeHandler}
              name="category"
            >
              <option value="Wheat">Wheat</option>
              <option value="Rice">Rice</option>
              <option value="Turmeric">Turmeric</option>
              <option value="Maize">Maize</option>
              <option value="Millets">Millets</option>
              <option value="Cocunut">Cocunut</option>
              <option value="Green Gram">Green Gram</option>
              <option value="Barley">Barley</option>
            </select>
          </div>

          {/* Price Input */}
          <div className="add-price flex-col">
            <p>Product Price (in Rs)</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="Enter price"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="add-btn">
          ADD PRODUCT
        </button>
      </form>
    </div>
  );
};

export default AddCommodity;
