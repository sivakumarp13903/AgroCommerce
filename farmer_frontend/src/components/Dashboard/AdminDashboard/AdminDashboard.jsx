import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDashboardStats,
  getRecentActivities,
} from "../../../services/DashboardService";
import { useAuth } from "../../../context/AuthContext";
import Sidebar from "./Sidebar";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for dashboard stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  // State for activities
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard stats
        const statsData = await getDashboardStats();
        console.log("Stats Data from API:", statsData);

        if (statsData && statsData.success) {
          setStats(statsData.data);
        }

        // Fetch recent activities
        const activitiesData = await getRecentActivities();
        console.log("Activities Data:", activitiesData);

        if (activitiesData && activitiesData.success) {
          setActivities(activitiesData.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="dashboard">
        <h1>AgroMart Admin Dashboard</h1>
        <div className="admin-info">
          <h2>Welcome, {user?.fullName || "Admin"} 👋</h2>
          <p>Email: {user?.email || "admin@gmail.com"}</p>
        </div>

        {/* Dashboard Stats */}
        <div className="dashboard-cards">
          <div className="card">
            <h3 className="card-title">Total Users</h3>
            <p className="card-value">{stats.totalUsers}</p>
          </div>
          <div className="card">
            <h3 className="card-title">Total Orders</h3>
            <p className="card-value">{stats.totalOrders}</p>
          </div>
          <div className="card">
            <h3 className="card-title">Total Revenue</h3>
            <p className="card-value">₹{stats.totalRevenue}</p>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="recent-activities">
          <h2>Recent Activities</h2>
          <ul>
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <li key={index}>Order Amount: ₹{activity.amount}</li>
              ))
            ) : (
              <p>No recent activities</p>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
