import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./WorkerDashboard.css"; // Add styles for Worker Dashboard

const WorkerDashboard = () => {
  const [worker, setWorker] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const workerData = JSON.parse(localStorage.getItem("userData"));

    // Check if user is logged in and role is "worker"
    if (!workerData || workerData.role !== "worker") {
      alert("Unauthorized access! Redirecting to login...");
      navigate("/login"); // Redirect if user is not a worker
    } else {
      setWorker(workerData);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userData"); // Remove stored worker info
    localStorage.removeItem("token"); // Remove JWT token
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">👷 Worker Dashboard</h2>

      {worker ? (
        <div className="worker-profile">
          <p><strong>Welcome, {worker.name}! 🛠️</strong></p>
          <p>Email: {worker.email}</p>
          <p>Role: {worker.role}</p>
        </div>
      ) : (
        <p className="loading-text">Loading worker details...</p>
      )}

      <div className="dashboard-options">
        <Link to="/job-listings" className="dashboard-card">
          🔍 Available Jobs
        </Link>
        <Link to="/my-applications" className="dashboard-card">
          📄 My Applications
        </Link>
      </div>

      <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
    </div>
  );
};

export default WorkerDashboard;
