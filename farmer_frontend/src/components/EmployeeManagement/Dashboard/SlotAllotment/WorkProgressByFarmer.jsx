import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WorkProgressByFarmer.css";

const WorkProgressByFarmer = () => {
    const [workProgress, setWorkProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [farmerId] = useState(localStorage.getItem("farmerId") || null);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchWorkProgress = async () => {
            try {
                if (!farmerId) {
                    throw new Error("Farmer ID not found in localStorage");
                }

                const response = await axios.get(`http://localhost:5000/api/workprogress/work-progress/${farmerId}`);
                setWorkProgress(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load work progress");
                console.error("Error fetching farmer work progress:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkProgress();
    }, [farmerId]);

    const handleVerification = async (progressId, jobId, workerId) => {
        try {
            if (!progressId || !jobId || !workerId) {
                setError("Missing required data. Cannot proceed.");
                return;
            }
    
            const requestBody = {
                status: "verified",
                farmerStatus: "verified"
            };
    
            console.log("Sending PATCH request with data:", requestBody);
    
            // ✅ Step 1: Verify Work Progress
            const response = await axios.patch(
                `http://localhost:5000/api/workprogress/work-progress/update/${progressId}`,
                requestBody
            );
    
            console.log("Response:", response.data);
    
            if (response.status === 200) {
                setWorkProgress((prevState) =>
                    prevState.map((progress) =>
                        progress._id === progressId ? { ...progress, farmerStatus: "verified" } : progress
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
        <div className="work-progress-container">
            <h2>My Work Progress</h2>

            {loading ? (
                <p>Loading work progress...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <>
                    {successMessage && <p className="success">{successMessage}</p>}
                    <table className="work-progress-table">
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
                            {workProgress.length > 0 ? (
                                workProgress.map((progress) => (
                                    <tr key={progress._id}>
                                        <td>{progress.jobId?.title || "N/A"}</td>
                                        <td>{progress.workerId?.name || "N/A"}</td>
                                        <td>{progress.workerStatus}</td>
                                        <td>{progress.farmerStatus}</td>
                                        <td>
                                            {progress.farmerStatus === "pending" ? (
                                                <button
                                                    className="verify-btn"
                                                    onClick={() => handleVerification(
                                                        progress._id,
                                                        progress.jobId?._id,
                                                        progress.workerId?._id
                                                    )}
                                                >
                                                    Verify
                                                </button>
                                            ) : (
                                                <span className="verified-text">Verified</span>
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
    );
};

export default WorkProgressByFarmer;
