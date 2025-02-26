import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import './WorkerDashboard.css';

const WorkerDashboard = ({ currentPath = "" }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const links = [
        { path: "/worker-dashboard/jobs", label: "Available Jobs" },
        { path: "/worker-dashboard/applied-jobs", label: "My Jobs" },
        { path: "/worker-dashboard/accepted-jobs", label: "Work Progress" },
        { path: "/worker-dashboard/payments", label: "Payment progress" }
    ];
    
    return (
        <header className={`worker-nav-header ${scrolled ? "scrolled" : ""}`}>
            <nav className="worker-nav-container">
                <ul className="worker-nav-list">
                    {links.map(({ path, label }) => (
                        <li key={path} className="worker-nav-item">
                            <Link 
                                to={path}
                                className={`worker-nav-link ${
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

export default WorkerDashboard;
