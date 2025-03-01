import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FarmerDashboard.css";

const FarmerDashboard = () => {
  const [farmer, setFarmer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    // ✅ Check if the user is logged in as a farmer
    if (!userData || userData.role !== "farmer") {
      alert("Unauthorized access! Redirecting to login...");
      navigate("/login"); // Redirect if the user is not a farmer
    } else {
      setFarmer(userData);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userData"); // Remove stored farmer info
    localStorage.removeItem("token"); // Remove JWT token
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="farmerbody">
      
    <div className="dashboard-container">
      <h2 className="dashboard-title">👨‍🌾 Farmer Dashboard</h2>

      {farmer ? (
        <div className="farmer-profile">
          <p><strong>Welcome, {farmer.name}! 🌾</strong></p>
          <p>Email: {farmer.email}</p>
          <p>Role: {farmer.role}</p>
        </div>
      ) : (
        <p className="loading-text">Loading farmer details...</p>
      )}

      {/* ✅ Farmer-Specific Navigation */}
      <div className="dashboard-options">
        
        <Link to="/recruit-management/application" className="dashboard-card">
          📋 View Job Applications
        </Link>
        <Link to="/recruit-management/workprogress" className="dashboard-card">
          📅 Track Work Progress
        </Link>
        <Link to="/recruit-management/payment-process" className="dashboard-card">
          💳 Payment Processing
        </Link>
        <Link to="/recruit-management/edit-job" className="dashboard-card">
          📌 Job Management
        </Link>
      </div>

      <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
    </div>
    </div>
  );
};

export default FarmerDashboard;
