import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaTractor } from "react-icons/fa";

const LandingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <div className="sagri-landing-container d-flex flex-column align-items-center justify-content-center text-center">
            <div className="sagri-background-animation"></div>

            <div className="sagri-icon-wrapper">
                <FaTractor className="sagri-animated-icon" size={80} color="white" />
            </div>

            <h1 className="sagri-main-title">Welcome to Smart AgriCommerce</h1>

            <p className="sagri-subtitle">Empowering Farmers with Smart Technology 🌱🚜</p>

            <button
                className="btn btn-warning btn-lg sagri-start-btn"
                onClick={() => navigate("/login")}
            >
                Start
            </button>
        </div>
    );
};

export default LandingPage;