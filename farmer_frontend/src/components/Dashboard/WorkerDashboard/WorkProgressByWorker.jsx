import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WorkProgressByWorker.css"; 

const WorkProgressForWorker = () => {
    const [workProgress, setWorkProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [workerId] = useState(localStorage.getItem("workerId") || null);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchWorkProgress = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/workprogress/work-progress/worker/${workerId}`);
                setWorkProgress(response.data);
            } catch (err) {
                setError("Failed to load work progress");
                console.error("Error fetching worker work progress:", err);
            } finally {
                setLoading(false);
            }
        };

        if (workerId) {
            fetchWorkProgress();
        } else {
            setError("Worker ID not found in localStorage");
            setLoading(false);
        }
    }, [workerId]);

    const handleUpdateStatus = async (progressId, newStatus) => {
        try {
            const response = await axios.patch(
                `http://localhost:5000/api/workprogress/work-progress/update/${progressId}`,
                { status: newStatus }, // ✅ Ensure this matches backend
                { headers: { "Content-Type": "application/json" } } // ✅ Ensure correct headers
            );
    
            if (response.status === 200) {
                setWorkProgress((prevState) =>
                    prevState.map((progress) =>
                        progress._id === progressId ? { ...progress, workerStatus: newStatus } : progress
                    )
                );
                setSuccessMessage("Status updated successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
            }
        } catch (err) {
            setError("Failed to update status");
            console.error("Error updating status:", err.response?.data || err.message);
        }
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
                                <th>Job Title</th>
                                <th>Farmer Name</th>
                                <th>Status</th>
                                <th>Farmer Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workProgress.length > 0 ? (
                                workProgress.map((progress) => (
                                    <tr key={progress._id}>
                                        <td>{progress.jobId?.title || "N/A"}</td>
                                        <td>{progress.farmerId?.name || "N/A"}</td>
                                        <td>
                                            <select
                                                value={progress.workerStatus}
                                                onChange={(e) => handleUpdateStatus(progress._id, e.target.value)}
                                            >
                                                
                                                <option value="arrived">Arrived</option>
                                                <option value="work in progress">Work In Progress</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </td>
                                        <td>{progress.farmerStatus}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No work progress found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default WorkProgressForWorker;
