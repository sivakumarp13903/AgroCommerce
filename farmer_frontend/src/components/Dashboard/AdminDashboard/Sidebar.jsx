import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <nav className="sidebar">
      <h2>AgroMart Admin</h2>
      <ul>
        <li onClick={() => navigate("/admin-dashboard")}>🏠 Dashboard</li>
        <li onClick={() => navigate("/admin/manage-farmers")}>👩‍🌾 Manage Farmers</li>
        <li onClick={() => navigate("/admin-dashboard/manage-products")}>🌾 Manage Products</li>
        <li onClick={() => navigate("/admin-dashboard/manage-orders")}>📦 Manage Orders</li>
        <li onClick={() => navigate("/admin/manage-payments")}>💰 Manage Payments</li>
        <li onClick={() => navigate("/admin-dashboard/add-product")}>➕ Add Product</li>
        <li onClick={() => navigate("/admin/reports")}>📊 Reports</li>
        <li onClick={() => navigate("/admin/logout")}>🚪 Logout</li>
      </ul>
    </nav>
  );
};

export default Sidebar;
