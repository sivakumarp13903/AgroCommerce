import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Backend API URL

// Register user
export const registerUser = async (userData) => {
    return await axios.post(`${API_URL}/user`, userData);
};

// Login user
export const loginUser = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    
    if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Store token after login
    }

    return response;
};


// Send OTP function
export const sendOtp = async (email) => {
    return await axios.post(`${API_URL}/send-otp`, { email });
};

// Verify OTP function
export const verifyOtp = async (email, otp) => {
    return await axios.post(`${API_URL}/verify-otp`, { email, otp });
};


export const postJob = async (jobData) => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    return await axios.post(`${API_URL}/jobs/post`, jobData, {
        headers: { Authorization: `Bearer ${token}` }, // Include authentication token
    });
};

export const getJobs = async () => {
    return await axios.get(`${API_URL}/jobs`);
};