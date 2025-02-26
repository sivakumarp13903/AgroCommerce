import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./BuyerDashboard.css";

const BuyerDashboard = ({ currentPath = "" }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const links = [
        { path: "/buyer-dashboard/commodities", label: "🌾 Available Commodities" },
        { path: "/buyer-dashboard/cart", label: "🛒 My Cart" },
        { path: "/buyer-dashboard/orders", label: "📦 Order History" },
        { path: "/buyer-dashboard/payments", label: "💰 Payment Status" },
        { path: "/buyer-dashboard/farmers", label: "👩‍🌾 Featured Farmers" },
        { path: "/buyer-dashboard/news", label: "📰 Agri News & Tips" }
    ];
    
    return (
        <div className="buyer-dashboard">
            {/* Navbar */}
            <header className={`buyer-nav-header ${scrolled ? "scrolled" : ""}`}>
                <motion.nav 
                    className="buyer-nav-container"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <ul className="buyer-nav-list">
                        {links.map(({ path, label }) => (
                            <motion.li 
                                key={path} 
                                className="buyer-nav-item"
                                whileHover={{ scale: 1.1 }}
                            >
                                <Link 
                                    to={path}
                                    className={`buyer-nav-link ${
                                        currentPath === path ? 'active' : ''
                                    }`}
                                >
                                    {label}
                                </Link>
                            </motion.li>
                        ))}
                    </ul>
                </motion.nav>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <h1>Welcome to Agri Buyer's Hub</h1>
                <p>Find fresh, high-quality agricultural products directly from farmers.</p>
                <motion.button 
                    className="explore-button"
                    whileHover={{ scale: 1.1 }}
                >
                    <Link to="/buyer-dashboard/commodities">🌾 Explore Commodities</Link>
                </motion.button>
            </section>

            {/* Trending Commodities Section */}
            <section className="trending-commodities">
                <h2>🔥 Trending Commodities</h2>
                <div className="commodity-list">
                    <motion.div className="commodity-item" whileHover={{ scale: 1.1 }}>
                        🌽 Fresh Corn - ₹50/kg
                    </motion.div>
                    <motion.div className="commodity-item" whileHover={{ scale: 1.1 }}>
                        🍚 Organic Rice - ₹70/kg
                    </motion.div>
                    <motion.div className="commodity-item" whileHover={{ scale: 1.1 }}>
                        🥜 Groundnuts - ₹90/kg
                    </motion.div>
                </div>
            </section>

            {/* Featured Farmers Section */}
            <section className="featured-farmers">
                <h2>👩‍🌾 Featured Farmers</h2>
                <div className="farmer-list">
                    <motion.div className="farmer-card" whileHover={{ scale: 1.05 }}>
                        <h3>Ravi Kumar</h3>
                        <p>Organic Wheat Producer</p>
                    </motion.div>
                    <motion.div className="farmer-card" whileHover={{ scale: 1.05 }}>
                        <h3>Sneha Reddy</h3>
                        <p>Fresh Vegetables Supplier</p>
                    </motion.div>
                </div>
            </section>

            {/* Agriculture News & Tips */}
            <section className="agri-news">
                <h2>📰 Latest Agri News & Tips</h2>
                <div className="news-card">
                    <h3>🌱 Best Crops for Winter Season</h3>
                    <p>Discover the top crops to grow in the upcoming winter season...</p>
                </div>
                <div className="news-card">
                    <h3>🚜 How to Reduce Farming Costs</h3>
                    <p>Learn effective techniques to cut down costs and increase productivity...</p>
                </div>
            </section>
        </div>
    );
};

export default BuyerDashboard;
