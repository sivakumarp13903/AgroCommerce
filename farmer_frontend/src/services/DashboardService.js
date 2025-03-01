import axios from "axios";

const API_URL = "http://localhost:5000/api/admin/dashboard";

// Function to fetch dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await fetch(`${API_URL}/stats`);
    const data = await response.json();
    console.log("Fetched Stats Data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { success: false, data: {} };
  }
};

// Function to fetch recent activities
export const getRecentActivities = async () => {
  try {
    const response = await axios.get(`${API_URL}/activities`);
    console.log("Fetched Activities Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return { success: false, data: [] };
  }
};
