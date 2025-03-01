import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FarmerJobs.css"; // Import CSS

const FarmerJobs = () => {
    const [farmerId, setFarmerId] = useState("");
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState("");

    // Fetch farmerId from local storage
    useEffect(() => {
        const storedFarmerId = localStorage.getItem("farmerId");
        if (storedFarmerId) {
            setFarmerId(storedFarmerId);
            fetchJobs(storedFarmerId);
        } else {
            setError("No Farmer ID found in local storage.");
        }
    }, []);

    // Fetch jobs for the farmer
    const fetchJobs = async (farmerId) => {
        try {
            setError("");
            const response = await axios.get(`http://localhost:5000/api/jobs/farmer/${farmerId}`);
            setJobs(response.data);
        } catch (err) {
            setError("No jobs found for this Farmer ID or an error occurred.");
            setJobs([]);
        }
    };

    // Delete a job
    const deleteJob = async (jobId) => {
        try {
            await axios.delete(`http://localhost:5000/api/jobs/${jobId}`);
            setJobs(jobs.filter((job) => job._id !== jobId)); // Remove job from UI
        } catch (err) {
            alert("Failed to delete job. Please try again.");
        }
    };

    return (
        <div className="farmer-job">
            <div className="farmer-jobs-container">
            <h2 className="farmer-jobs-title">My Posted Jobs</h2>

            {error && <p className="error-message">{error}</p>}

            <div className="jobs-list">
                {jobs.length > 0 ? (
                    jobs.map((job) => (
                        <div key={job._id} className="job-card">
                            <h3 className="job-title">{job.title}</h3>
                            <p className="job-desc">{job.description}</p>
                            <p className="job-info"><strong>Location:</strong> {job.location}</p>
                            <p className="job-info"><strong>Salary:</strong> ₹{job.salary}</p>
                            <p className="job-info"><strong>Posted By:</strong> {job.farmerId.name} ({job.farmerId.email})</p>
                            <button className="delete-btn" onClick={() => deleteJob(job._id)}>Delete</button>
                        </div>
                    ))
                ) : (
                    <p className="no-jobs-message">No jobs found.</p>
                )}
            </div>
        </div>
        </div>
    );
};

export default FarmerJobs;
