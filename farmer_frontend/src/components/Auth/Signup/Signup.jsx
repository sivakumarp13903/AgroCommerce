import React, { useState } from "react";
import { registerUser, sendOtp, verifyOtp } from "../../../services/authService";
import { useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import "./Signup.css"; // Apply styles globally

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "farmer",
        location: "",
        phone: "",
    });

    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOtp = async () => {
        if (!formData.email) {
            alert("Please enter an email address.");
            return;
        }
        try {
            await sendOtp(formData.email);
            setOtpSent(true);
            alert("OTP sent to your email. Please check your inbox.");
        } catch (error) {
            alert("Failed to send OTP. Try again.");
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            alert("Please enter the OTP.");
            return;
        }
        try {
            const response = await verifyOtp(formData.email, otp);
            if (response.data.success) {
                setIsVerified(true);
                alert("OTP verified successfully!");
            } else {
                alert("Invalid OTP. Please try again.");
            }
        } catch (error) {
            alert("OTP verification failed.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isVerified) {
            alert("Please verify your OTP before signing up.");
            return;
        }
        if (formData.password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
        try {
            await registerUser(formData);
            alert("Signup successful! Please login.");
            navigate("/login");
        } catch (error) {
            alert("Signup failed. Try again.");
        }
    };

    return (
        <div className="page-container">
            <div className="form-container">
                <div className="icon-container">
                    <FaUserPlus className="animated-icon" size={80} color="white" />
                </div>
                <h2 className="form-title">Farmer Signup</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    
                    {!otpSent ? (
                        <button type="button" className="otp-button" onClick={handleSendOtp}>Send OTP</button>
                    ) : (
                        <>
                            <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                            <button type="button" className="otp-button" onClick={handleVerifyOtp}>Verify OTP</button>
                        </>
                    )}

                    <input type="password" name="password" placeholder="Password (Min 6 chars)" onChange={handleChange} required />
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />

                    <select name="role" onChange={handleChange} required>
                        <option value="farmer">Farmer</option>
                        <option value="buyer">Buyer</option>
                        <option value="worker">Worker</option>
                        <option value="admin">Admin</option>
                    </select>

                    <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
                    <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required />

                    <button type="submit" className="submit-button" disabled={!isVerified}>Sign Up</button>
                </form>
                <p className="login-text">
                    Already have an account?{" "}
                    <span className="login-link" onClick={() => navigate("/login")}>
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Signup;
