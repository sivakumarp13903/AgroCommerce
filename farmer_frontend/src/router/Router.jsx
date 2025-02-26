import { Routes, Route, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import LandingPage from "../pages/LandingPage/LandingPage";
import Signup from "../components/Auth/Signup/Signup";
import Login from "../components/Auth/Login/Login";
import FarmerDashboard from "../components/Dashboard/FarmerDashboard";
import ApplicationsList from "../components/EmployeeManagement/Dashboard/JobApplications/ApplicationsList";
import FarmerEmpNavigation from "../components/EmployeeManagement/FarmerEmpNavigation";
import PostJob from "../components/EmployeeManagement/Dashboard/PostJob/PostJob";
import AvailableJobs from "../components/Dashboard/WorkerDashboard/AvailableJobs";
import AppliedJobs from "../components/Dashboard/WorkerDashboard/AppliedJobs";
import PaymentStatus from "../components/Dashboard/WorkerDashboard/PaymentStatus";
import WorkerDashboard from "../components/Dashboard/WorkerDashboard/WorkerDashboard";
import WorkerNavigation from "../components/Dashboard/WorkerDashboard/WorkerNavigation";
import WorkProgressByFarmer from "../components/EmployeeManagement/Dashboard/SlotAllotment/WorkProgressByFarmer";
import WorkProgressByWorker from "../components/Dashboard/WorkerDashboard/WorkProgressByWorker";
import PaymentProgressByWorker from "../components/Dashboard/WorkerDashboard/paymentProgressByWorker";
import PaymentProgressByFarmer from "../components/EmployeeManagement/Dashboard/PaymentProcess/PaymentProcessByFarmer";
import BuyerDashboard from "../components/Dashboard/BuyerDashboard/BuyerDashboard";
import CommodityList from "../components/Dashboard/BuyerDashboard/CommodityList";
import Cart from "../components/Dashboard/BuyerDashboard/Cart";
import Orders from "../components/Dashboard/BuyerDashboard/Orders";
import Payments from "../components/Dashboard/BuyerDashboard/Payments";
import { CartContext } from "../context/CartContext";
import AdminDashboard from "../components/Dashboard/AdminDashboard/AdminDashboard";
import AddCommodity from "../components/Dashboard/AdminDashboard/AddCommodity";
import Sidebar from "../components/Dashboard/AdminDashboard/Sidebar"; // Adjust path if needed
import ManageProduct from "../components/Dashboard/AdminDashboard/ManageProduct";
import ManageOrders from "../components/Dashboard/AdminDashboard/ManageOrders";


/* Farmer Employee Management Layout */
const FarmerEmpLayout = () => {
  const [farmerId, setFarmerId] = useState(
    localStorage.getItem("farmerId") || null
  );

  useEffect(() => {
    if (!farmerId) console.warn("Farmer ID is missing. Please log in again.");
  }, [farmerId]);

  return (
    <>
      <FarmerEmpNavigation />
      <Outlet context={{ farmerId }} />
    </>
  );
};

/* Worker Dashboard Layout */
const WorkerLayout = () => {
  const [workerId, setWorkerId] = useState(
    localStorage.getItem("workerId") || null
  );

  useEffect(() => {
    if (!workerId) console.warn("Worker ID is missing. Please log in again.");
  }, [workerId]);

  return (
    <>
      <WorkerNavigation />
      <Outlet context={{ workerId }} />
    </>
  );
};

/* Buyer Layout */
const BuyerLayout = () => {
  const [buyerId, setBuyerId] = useState(
    localStorage.getItem("buyerId") || null
  );

  useEffect(() => {
    if (!buyerId) console.warn("Buyer ID is missing. Please log in again.");
  }, [buyerId]);

  return (
    <>
      <BuyerDashboard />
      <Outlet context={{ buyerId }} />
    </>
  );
};

// Admin layout
const AdminLayout = () => {
    return (
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-content">
          <Outlet /> {/* Displays child routes */}
        </div>
      </div>
    );
  };

const AppRoutes = () => {
  // ✅ Ensure the context provider gets a value
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Farmer Dashboard */}
        <Route path="/dashboard" element={<FarmerDashboard />} />

        {/* Farmer Employee Management Routes */}
        <Route path="/recruit-management" element={<FarmerEmpLayout />}>
          <Route path="application" element={<ApplicationsList />} />
          <Route path="workprogress" element={<WorkProgressByFarmer />} />
          <Route path="payment-process" element={<PaymentProgressByFarmer />} />
          <Route path="post-job" element={<PostJob />} />
        </Route>

        {/* Worker Dashboard Routes */}
        <Route path="/worker-dashboard" element={<WorkerLayout />}>
          <Route path="jobs" element={<AvailableJobs />} />
          <Route path="applied-jobs" element={<AppliedJobs />} />
          <Route path="accepted-jobs" element={<WorkProgressByWorker />} />
          <Route path="payments" element={<PaymentProgressByWorker />} />
        </Route>

        {/* Buyer Dashboard Routes */}
        {/* <Route path="/buyer-dashboard" element={<BuyerLayout />}>
                    <Route path="commodities" element={<CommodityList />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="payments" element={<Payments />} />
                </Route> */}

        {/* Admin Dashboard Routes */}
        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="add-product" element={<AddCommodity />} />
          <Route path="manage-products" element={<ManageProduct />} />
          <Route path="manage-orders" element={<ManageOrders />} />
        </Route>
      </Routes>
    </CartContext.Provider>
  );
};

export default AppRoutes;
