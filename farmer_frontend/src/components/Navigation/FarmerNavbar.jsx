import React from "react";
import { Link } from "react-router-dom";
// import "./FarmerNavbar.css";

const FarmerNavbar = () => {
  return (
    <nav className="farmer-navbar">
      <ul>
        <li><Link to="/dashboard">🏠 Dashboard</Link></li>
        <li><Link to="/employee-management">👷 Employee Management</Link></li>
        <li><Link to="/order-management">📦 Order Management</Link></li>
        <li><Link to="/logout">🚪 Logout</Link></li>
      </ul>
    </nav>
  );
};

export default FarmerNavbar;
