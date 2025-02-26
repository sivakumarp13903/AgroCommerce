import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ApplicationsList.css"; // Add styles

const ApplicationsList = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
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

    // Function to create work progress after accepting a job application
    const createWorkProgress = async (applicationId, workerId, jobId) => {
        try {
            const response = await axios.post(
                `http://localhost:5000/api/workprogress/create`, 
                { 
                    jobId, 
                    workerId, 
                    farmerId 
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            return response.data;
        } catch (err) {
            console.error("Error creating work progress:", err);
            alert("Failed to create work progress.");
            return null;
        }
    };

    const updateStatus = async (applicationId, newStatus, workerId, jobId) => {
        try {
            // First update the application status
            const response = await axios.put(`http://localhost:5000/api/job-applications/update/${applicationId}`, { status: newStatus });
            if (response.status === 200) {
                setApplications((prevApps) =>
                    prevApps.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app))
                );
                // After accepting, create work progress
                if (newStatus === "Accepted") {
                    const workProgress = await createWorkProgress(applicationId, workerId, jobId);
                    if (workProgress) {
                        alert("Work progress created successfully.");
                    }
                }
            }
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Failed to update status. Try again.");
        }
    };

    return (
        <div className="farmer-applications-container">
            <h2>Job Applications</h2>

            {loading ? (
                <p>Loading applications...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : applications.length === 0 ? (
                <p>No applications found.</p>
            ) : (
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
                        {applications.map((app) => (
                            <tr key={app._id}>
                                <td>{app.jobId?.title || "N/A"}</td>
                                <td>{app.workerId?.name || "N/A"}</td>
                                <td>{app.modeOfPayment}</td>
                                <td>{app.modeOfPayment === "Gpay" ? app.gpayNumber : "N/A"}</td>
                                <td>{app.status}</td>
                                <td>
                                    {app.status === "Pending" && (
                                        <>
                                            <button className="accept-btn" onClick={() => updateStatus(app._id, "Accepted", app.workerId._id, app.jobId._id)}>
                                                Accept
                                            </button>
                                            <button className="reject-btn" onClick={() => updateStatus(app._id, "Rejected")}>
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ApplicationsList;
