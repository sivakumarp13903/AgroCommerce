import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './FarmerNavigation.css';

const FarmerEmpNavigation = ({ currentPath = "" }) => {
    const [scrolled, setScrolled] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const links = [
        { path: "/recruit-management/application", label: "Job Application" },
        { path: "/recruit-management/workprogress", label: "Work Progress" },
        { path: "/recruit-management/payment-process", label: "Payment Process" },
        { path: "/recruit-management/post-job", label: "Post Job" }
    ];
    
    return (
        <header className={`farmer-nav-header ${scrolled ? "scrolled" : ""}`}>
            <nav className="farmer-nav-container">
                <ul className="farmer-nav-list">
                    {links.map(({ path, label }) => (
                        <li key={path} className="farmer-nav-item">
                            <Link 
                                to={path}
                                className={`farmer-nav-link ${
                                    currentPath === path ? 'active' : ''
                                }`}
                            >
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
};

export default FarmerEmpNavigation;
