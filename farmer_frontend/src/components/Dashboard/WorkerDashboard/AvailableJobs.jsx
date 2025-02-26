import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AvailableJobs.css"; // Ensure this file exists

const AvailableJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [modeOfPayment, setModeOfPayment] = useState("");
    const [gpayNumber, setGpayNumber] = useState("");
    const [workerId, setWorkerId] = useState(localStorage.getItem("workerId") || null); // Retrieve from localStorage

    console.log({ workerId });

    useEffect(() => {
        const fetchWorkerData = async () => {
            try {
                if (!workerId) {
                    const response = await axios.get("http://localhost:5000/api/user");
                    const fetchedWorkerId = response.data.workerId;
                    setWorkerId(fetchedWorkerId);
                    localStorage.setItem("workerId", fetchedWorkerId); // Store in localStorage
                    console.log("Worker ID set:", fetchedWorkerId);
                }
            } catch (err) {
                console.error("Error fetching worker ID:", err);
                setError("Failed to fetch worker data.");
            }
        };

        fetchWorkerData();

        // Fetch available jobs
        const fetchJobs = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/jobs/");
                setJobs(response.data);
            } catch (err) {
                console.error("Error fetching jobs:", err);
                setError("Failed to fetch jobs.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [workerId]); // Dependency to ensure workerId updates

    const handleApplyClick = (job) => {
        setSelectedJob(job);
        setModeOfPayment(""); // Reset form
        setGpayNumber("");
    };

    const handleSubmitApplication = async () => {
        if (!selectedJob || !workerId || !selectedJob.farmerId || !modeOfPayment) {
            alert("Please fill all required fields.");
            return;
        }

        const applicationData = {
            jobId: selectedJob._id,
            workerId, // Now using dynamically set workerId from localStorage
            farmerId: selectedJob.farmerId._id,
            modeOfPayment,
            gpayNumber: modeOfPayment === "Gpay" ? gpayNumber : "",
        };

        try {
            const response = await axios.post(
                "http://localhost:5000/api/job-applications/apply",
                applicationData
            );
            alert(response.data.message);
            setSelectedJob(null);
        } catch (err) {
            console.error("Error applying for job:", err.response?.data || err);
            alert(err.response?.data?.message || "Failed to apply for the job.");
        }
    };

    return (
        <div className="available-jobs-container">
            <h2>Available Jobs</h2>
            {loading ? (
                <p>Loading jobs...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : jobs.length === 0 ? (
                <p>No jobs available at the moment.</p>
            ) : (
                <ul className="job-list">
                    {jobs.map((job) => (
                        <li key={job._id} className="job-item">
                            <h3>{job.title}</h3>
                            <p><strong>Location:</strong> {job.location}</p>
                            <p><strong>Salary:</strong> ${job.salary}</p>
                            <p><strong>Description:</strong> {job.description}</p>
                            <button className="apply-btn" onClick={() => handleApplyClick(job)}>
                                Apply Now
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {selectedJob && (
                <div className="application-form">
                    <h3>Apply for {selectedJob.title}</h3>
                    <label>
                        Mode of Payment:
                        <select value={modeOfPayment} onChange={(e) => setModeOfPayment(e.target.value)}>
                            <option value="">Select Payment Mode</option>
                            <option value="Gpay">Gpay</option>
                            <option value="Cash">Cash</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                    </label>

                    {modeOfPayment === "Gpay" && (
                        <label>
                            GPay Number:
                            <input
                                type="text"
                                value={gpayNumber}
                                onChange={(e) => setGpayNumber(e.target.value)}
                                placeholder="Enter GPay Number"
                            />
                        </label>
                    )}

                    <button onClick={handleSubmitApplication}>Submit Application</button>
                    <button onClick={() => setSelectedJob(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default AvailableJobs;
