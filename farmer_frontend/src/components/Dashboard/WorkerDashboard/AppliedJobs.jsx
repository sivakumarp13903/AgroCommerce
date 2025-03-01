import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AppliedJobs.css"; // Styles

const AppliedJobs = () => {
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("All");
    const [workerId] = useState(localStorage.getItem("workerId") || null);

    useEffect(() => {
        const fetchWorkerApplications = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/job-applications/worker/${workerId}`);
                setApplications(response.data);
                setFilteredApplications(response.data); // Default to all applications
            } catch (err) {
                setError("Failed to load applications");
                console.error("Error fetching worker applications:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkerApplications();
    }, [workerId]);

    // Filter Handler
    const handleFilterChange = (e) => {
        const selectedFilter = e.target.value;
        setFilter(selectedFilter);

        if (selectedFilter === "All") {
            setFilteredApplications(applications);
        } else {
            setFilteredApplications(applications.filter(app => app.status === selectedFilter));
        }
    };

    return (
        <div className="applied-job-container">
            <h2>My Applied Jobs</h2>

            {/* Filter Dropdown */}
            <div className="filter-container">
                <label htmlFor="filter">Filter by Status:</label>
                <select id="filter" value={filter} onChange={handleFilterChange}>
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            {loading ? (
                <p>Loading applications...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : filteredApplications.length === 0 ? (
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
                        {filteredApplications.map((app) => (
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
