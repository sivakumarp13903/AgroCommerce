import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ApplicationsList.css";

const ApplicationsList = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({ jobTitle: "", workerName: "", paymentMode: "", status: "" });
    const farmerId = localStorage.getItem("farmerId") || null;

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/job-applications/farmer/${farmerId}`);
                setApplications(response.data);
            } catch (err) {
                setError("Failed to load applications");
                console.error("Error fetching job applications:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [farmerId]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const filteredApplications = applications.filter(app => 
        (filters.jobTitle === "" || app.jobId?.title === filters.jobTitle) &&
        (filters.workerName === "" || app.workerId?.name === filters.workerName) &&
        (filters.paymentMode === "" || app.modeOfPayment === filters.paymentMode) &&
        (filters.status === "" || app.status === filters.status)
    );

    return (
        <div className="application-body">
            <div className="farmer-applications-container">
                <h2>Job Applications</h2>

                {loading ? (
                    <p>Loading applications...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <>
                        <div className="filters">
                            <select name="jobTitle" onChange={handleFilterChange}>
                                <option value="">All Job Titles</option>
                                {[...new Set(applications.map(app => app.jobId?.title))].map(title => (
                                    <option key={title} value={title}>{title}</option>
                                ))}
                            </select>
                            
                            <select name="workerName" onChange={handleFilterChange}>
                                <option value="">All Workers</option>
                                {[...new Set(applications.map(app => app.workerId?.name))].map(name => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>

                            <select name="paymentMode" onChange={handleFilterChange}>
                                <option value="">All Payment Modes</option>
                                {[...new Set(applications.map(app => app.modeOfPayment))].map(mode => (
                                    <option key={mode} value={mode}>{mode}</option>
                                ))}
                            </select>
                            
                            <select name="status" onChange={handleFilterChange}>
                                <option value="">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                        <table className="applications-table">
                            <thead>
                                <tr>
                                    <th>Job Title</th>
                                    <th>Worker Name</th>
                                    <th>Payment Mode</th>
                                    <th>Gpay Number</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApplications.length === 0 ? (
                                    <tr><td colSpan="6">No applications found.</td></tr>
                                ) : (
                                    filteredApplications.map((app) => (
                                        <tr key={app._id}>
                                            <td>{app.jobId?.title || "N/A"}</td>
                                            <td>{app.workerId?.name || "N/A"}</td>
                                            <td>{app.modeOfPayment}</td>
                                            <td>{app.modeOfPayment === "Gpay" ? app.gpayNumber : "N/A"}</td>
                                            <td>{app.status}</td>
                                            <td>
                                                {app.status === "Pending" && (
                                                    <>
                                                        <button className="accept-btn">Accept</button>
                                                        <button className="reject-btn">Reject</button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
};

export default ApplicationsList;
