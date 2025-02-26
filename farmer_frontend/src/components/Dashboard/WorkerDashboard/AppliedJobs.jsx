import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AppliedJobs.css"; // Add styles

const AppliedJobs = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [workerId] = useState(localStorage.getItem("workerId") || null);

    useEffect(() => {
        const fetchWorkerApplications = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/job-applications/worker/${workerId}`);
                setApplications(response.data);
            } catch (err) {
                setError("Failed to load applications");
                console.error("Error fetching worker applications:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkerApplications();
    }, [workerId]);

    return (
        <div className="applied-job-container">
            <h2>My Applied Jobs</h2>

            {loading ? (
                <p>Loading applications...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : applications.length === 0 ? (
                <p>No job applications found.</p>
            ) : (
                <table className="applied-job-table">
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Farmer Name</th>
                            <th>Payment Mode</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app._id}>
                                <td>{app.jobId?.title || "N/A"}</td>
                                <td>{app.farmerId?.name || "N/A"}</td>
                                <td>{app.modeOfPayment}</td>
                                <td className={`status-${app.status.toLowerCase()}`}>{app.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AppliedJobs;
