import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WorkProgressByFarmer.css";

const WorkProgressByFarmer = () => {
    const [workProgress, setWorkProgress] = useState([]);
    const [filteredWorkProgress, setFilteredWorkProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [farmerId] = useState(localStorage.getItem("farmerId") || null);
    const [successMessage, setSuccessMessage] = useState("");

    // State for filters
    const [jobFilter, setJobFilter] = useState("");
    const [workerFilter, setWorkerFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [farmerStatusFilter, setFarmerStatusFilter] = useState("");

    useEffect(() => {
        const fetchWorkProgress = async () => {
            try {
                if (!farmerId) {
                    throw new Error("Farmer ID not found in localStorage");
                }

                const response = await axios.get(
                    `http://localhost:5000/api/workprogress/work-progress/${farmerId}`
                );
                setWorkProgress(response.data);
                setFilteredWorkProgress(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load work progress");
                console.error("Error fetching farmer work progress:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkProgress();
    }, [farmerId]);

    // Filter work progress data based on selected filters
    useEffect(() => {
        let filteredData = workProgress;

        if (jobFilter) {
            filteredData = filteredData.filter((item) => item.jobId?.title === jobFilter);
        }
        if (workerFilter) {
            filteredData = filteredData.filter((item) => item.workerId?.name === workerFilter);
        }
        if (statusFilter) {
            filteredData = filteredData.filter((item) => item.workerStatus === statusFilter);
        }
        if (farmerStatusFilter) {
            filteredData = filteredData.filter((item) => item.farmerStatus === farmerStatusFilter);
        }

        setFilteredWorkProgress(filteredData);
    }, [jobFilter, workerFilter, statusFilter, farmerStatusFilter, workProgress]);

    const handleVerification = async (progressId, jobId, workerId) => {
        try {
            if (!progressId || !jobId || !workerId) {
                setError("Missing required data. Cannot proceed.");
                return;
            }

            const requestBody = {
                status: "verified",
                farmerStatus: "verified",
            };

            // ✅ Step 1: Verify Work Progress
            const response = await axios.patch(
                `http://localhost:5000/api/workprogress/work-progress/update/${progressId}`,
                requestBody
            );

            if (response.status === 200) {
                setWorkProgress((prevState) =>
                    prevState.map((progress) =>
                        progress._id === progressId
                            ? { ...progress, farmerStatus: "verified" }
                            : progress
                    )
                );

                // ✅ Step 2: Create Payment Entry
                const paymentResponse = await axios.post(
                    `http://localhost:5000/api/payments/create`,
                    { jobId, farmerId, workerId }
                );

                if (paymentResponse.status === 201) {
                    setSuccessMessage("Work verified & payment process initiated successfully!");
                } else {
                    throw new Error("Work verified, but payment creation failed.");
                }
            }
        } catch (err) {
            console.error("Error verifying work:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Failed to verify work or create payment");
        }

        setTimeout(() => {
            setSuccessMessage("");
            setError("");
        }, 3000);
    };

    return (
        <div className="workprogress-body1">
            <div className="work-progress-container1">
            <h2>My Work Progress</h2>

            {/* Dropdown Filters */}
            <div className="filters-container1">
                <select onChange={(e) => setJobFilter(e.target.value)} value={jobFilter}>
                    <option value="">All Jobs</option>
                    {Array.from(new Set(workProgress.map((item) => item.jobId?.title))).map(
                        (title, index) => title && <option key={index} value={title}>{title}</option>
                    )}
                </select>

                <select onChange={(e) => setWorkerFilter(e.target.value)} value={workerFilter}>
                    <option value="">All Workers</option>
                    {Array.from(new Set(workProgress.map((item) => item.workerId?.name))).map(
                        (name, index) => name && <option key={index} value={name}>{name}</option>
                    )}
                </select>

                <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
                    <option value="">All Work Status</option>
                    {["pending", "completed", "in-progress"].map((status, index) => (
                        <option key={index} value={status}>{status}</option>
                    ))}
                </select>

                <select onChange={(e) => setFarmerStatusFilter(e.target.value)} value={farmerStatusFilter}>
                    <option value="">All Farmer Status</option>
                    {["pending", "verified"].map((status, index) => (
                        <option key={index} value={status}>{status}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p>Loading work progress...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <>
                    {successMessage && <p className="success">{successMessage}</p>}
                    <table className="work-progress-table1">
                        <thead>
                            <tr>
                                <th>Job Name</th>
                                <th>Worker Name</th>
                                <th>Work Status</th>
                                <th>Farmer Verification</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWorkProgress.length > 0 ? (
                                filteredWorkProgress.map((progress) => (
                                    <tr key={progress._id}>
                                        <td>{progress.jobId?.title || "N/A"}</td>
                                        <td>{progress.workerId?.name || "N/A"}</td>
                                        <td>{progress.workerStatus}</td>
                                        <td>{progress.farmerStatus}</td>
                                        <td>
                                            {progress.farmerStatus === "pending" ? (
                                                <button
                                                    className="verify-btn1"
                                                    onClick={() =>
                                                        handleVerification(
                                                            progress._id,
                                                            progress.jobId?._id,
                                                            progress.workerId?._id
                                                        )
                                                    }
                                                >
                                                    Verify
                                                </button>
                                            ) : (
                                                <span className="verified-text1">Verified</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No work progress found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </div>
        </div>
    );
};

export default WorkProgressByFarmer;
