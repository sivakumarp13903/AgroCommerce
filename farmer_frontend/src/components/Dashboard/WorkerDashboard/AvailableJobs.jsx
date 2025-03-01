import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AvailableJobs.css";

const AvailableJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [modeOfPayment, setModeOfPayment] = useState("");
    const [gpayNumber, setGpayNumber] = useState("");
    const [workerId, setWorkerId] = useState(localStorage.getItem("workerId") || null);
    const [appliedJobs, setAppliedJobs] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/jobs/");
                setJobs(response.data);
            } catch (err) {
                setError("Failed to fetch jobs.");
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handleApplyClick = (job) => {
        if (appliedJobs.has(job._id)) return;
        setSelectedJob(job);
        setModeOfPayment("");
        setGpayNumber("");
    };

    const handleSubmitApplication = async () => {
        if (!selectedJob || !workerId || !selectedJob.farmerId || !modeOfPayment) {
            alert("Please fill all required fields.");
            return;
        }

        const applicationData = {
            jobId: selectedJob._id,
            workerId,
            farmerId: selectedJob.farmerId._id,
            modeOfPayment,
            gpayNumber: modeOfPayment === "Gpay" ? gpayNumber : "",
        };

        try {
            const response = await axios.post("http://localhost:5000/api/job-applications/apply", applicationData);
            alert(response.data.message);

            setAppliedJobs((prev) => new Set(prev).add(selectedJob._id));
            setSelectedJob(null);
        } catch (err) {
            alert("Failed to apply for the job.");
        }
    };

    const filteredJobs = jobs.filter(
        (job) =>
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="available-jobs-container">
            <h2>Available Jobs</h2>
            <input
                type="text"
                placeholder="Search by title or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
            />

            {loading ? (
                <div className="loading-spinner"></div>
            ) : error ? (
                <p className="error">{error}</p>
            ) : filteredJobs.length === 0 ? (
                <p>No jobs found.</p>
            ) : (
                <ul className="job-list">
                    {filteredJobs.map((job) => (
                        <li key={job._id} className="job-item">
                            <h3>{job.title}</h3>
                            <p><strong>Location:</strong> {job.location}</p>
                            <p><strong>Salary:</strong> ₹ {job.salary}</p>
                            <p><strong>Description:</strong> {job.description}</p>
                            <button 
                                className={`apply-btn ${appliedJobs.has(job._id) ? "applied" : ""}`}
                                onClick={() => handleApplyClick(job)}
                                disabled={appliedJobs.has(job._id)}
                            >
                                {appliedJobs.has(job._id) ? "Applied" : "Apply Now"}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {selectedJob && (
                <div className="modal-overlay">
                    <div className="modal-content">
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

                        <button className="submit-btn" onClick={handleSubmitApplication}>Submit Application</button>
                        <button className="cancel-btn" onClick={() => setSelectedJob(null)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AvailableJobs;
