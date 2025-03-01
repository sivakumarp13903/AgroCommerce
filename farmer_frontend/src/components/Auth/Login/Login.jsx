import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import { FaTractor } from "react-icons/fa";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
    
        try {
            const response = await axios.post("http://localhost:5000/api/login", {
                email,
                password
            });
    
            console.log("Login API Response:", response.data); // ✅ Debug response
    
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("userData", JSON.stringify(response.data.user));
    
                if (response.data.user.role === "worker") {
                    console.log("Worker ID from API:", response.data.user._id); // ✅ Debug workerId
                    localStorage.setItem("workerId", response.data.user._id || ""); 
                }

                if (response.data.user.role === "farmer") {
                    console.log("Farmer ID from API:", response.data.user._id); // ✅ Debug farmerrId
                    localStorage.setItem("farmerId", response.data.user._id || ""); 
                }
                
                if (response.data.user.role === "buyer") {
                    console.log("Buyer ID from API:", response.data.user._id); // ✅ Debug farmerrId
                    localStorage.setItem("buyerId", response.data.user._id || ""); 
                }

                if (response.data.user.role === "admin") {
                    console.log("Admin ID from API:", response.data.user._id); // ✅ Debug farmerrId
                    localStorage.setItem("adminId", response.data.user._id || ""); 
                }
                const userRole = response.data.user.role;
    
                setTimeout(() => {
                    if (userRole === "farmer") {
                        navigate("/dashboard");
                    } else if (userRole === "worker") {
                        navigate("/worker-dashboard");
                    }else if(userRole === "buyer"){
                        navigate("/buyer-dashboard");
                    }else if(userRole === "admin"){
                        navigate("/admin-dashboard");
                    }
                     else {
                        setError("Unauthorized role. Please contact support.");
                    }
                }, 200);
            } else {
                setError("Invalid login credentials");
            }
        } catch (error) {
            console.error("Login Error:", error);
            setError("Invalid email or password. Please try again.");
        }
    };

    return (
        <div className="agri-login-container">
            <div className="agri-login-box">
                <div className="agri-login-icon-container">
                    <FaTractor className="agri-login-animated-icon" size={80} color="#4caf50" />
                </div>
                <h2 className="agri-login-title">Login</h2>

                {error && <p className="agri-login-error">{error}</p>}

                <form onSubmit={handleLogin}>
                    <div className="agri-login-input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="agri-login-input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="agri-login-button">
                        Login
                    </button>
                </form>

                <p className="agri-login-signup-text">
                    Don't have an account?{" "}
                    <span className="agri-login-signup-link" onClick={() => navigate("/signup")}>
                        Sign up
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;