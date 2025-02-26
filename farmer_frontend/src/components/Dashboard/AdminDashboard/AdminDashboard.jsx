import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../../services/DashboardService"; // Mocked API
import { useAuth } from "../../../context/AuthContext";
import Sidebar from "./Sidebar";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalFarmers: 0,
    totalProducts: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="dashboard">
        <h1 className="dashboard-title">AgroMart Admin Dashboard</h1>
        <div className="admin-info">
          <h2 className="admin-welcome">Welcome, <span className="admin-name">{user?.fullName || "Admin"} 👋</span></h2>
          <p className="admin-email">Email: {user?.email || "admin@gmail.com"}</p>
        </div>
        <div className="dashboard-cards">
          <div className="card">
            <h3 className="card-title">Total Farmers</h3>
            <p className="card-value">{stats.totalFarmers}</p>
          </div>
          <div className="card">
            <h3 className="card-title">Total Products</h3>
            <p className="card-value">{stats.totalProducts}</p>
          </div>
          <div className="card">
            <h3 className="card-title">Pending Orders</h3>
            <p className="card-value">{stats.pendingOrders}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
