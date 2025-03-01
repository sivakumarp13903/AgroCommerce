import React, { useState, useEffect } from "react";
import "./ManageOrders.css";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../../assets/assets";
import * as XLSX from "xlsx";

const ManageOrders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data);
        console.log(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Something went wrong");
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post("http://localhost:5000/api/order/status", {
        orderId,
        status: event.target.value,
      });
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const generateExcelReport = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      orders.map((order) => ({
        "Customer Name": `${order.address.firstName} ${order.address.lastName}`,
        "Phone Number": order.address.phone,
        Address: `${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country} - ${order.address.zipcode}`,
        "Items Count": order.items.length,
        "Total Amount (Rs)": order.amount,
        Status: order.status,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders Report");

    XLSX.writeFile(workbook, "Orders_Report.xlsx");
  };

  return (
    <div className="order add">
      <h3>Order Page</h3><br />
      <button onClick={generateExcelReport} className="export-button">
        Export to Excel
      </button>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="Parcel Icon" />
            <div>
              <p className="order-item-food">
                {order.items.map((item, index) => (
                  index === order.items.length - 1
                    ? `${item.name} x ${item.quantity}`
                    : `${item.name} x ${item.quantity}, `
                ))}
              </p>
              <p className="order-item-name">{`${order.address.firstName} ${order.address.lastName}`}</p>
              <div className="order-item-address">
                <p>{order.address.street},</p>
                <p>{`${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.zipcode}`}</p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>Total: Rs {order.amount}</p>
            <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
              <option value="Order Processing">Order Processing</option>
              <option value="Out for delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageOrders;
