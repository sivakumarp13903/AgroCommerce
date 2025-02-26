import React, { useState, useEffect } from "react";
import { postJob, getJobs } from "../../../../services/authService"; // Import getJobs function
import { useNavigate } from "react-router-dom";
import './PostJob.css';

const PostJob = () => {
    const navigate = useNavigate();

    // State for form inputs
    const [job, setJob] = useState({
        title: "",
        description: "",
        duration: "",
        salary: "",
        location: "",
    });

    // State for loading, error messages, and posted jobs
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [jobs, setJobs] = useState([]); // Store already posted jobs

    // Check if user is authenticated
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to post a job!");
            navigate("/login");
        }
    }, [navigate]);

    // Handle input change
    const handleChange = (e) => {
        setJob({ ...job, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!job.title || !job.description || !job.duration || !job.salary || !job.location) {
            setError("All fields are required!");
            setLoading(false);
            return;
        }

        try {
            console.log("📝 Sending Job Data:", job);
            await postJob(job);
            alert("✅ Job posted successfully!");
            setJob({ title: "", description: "", duration: "", salary: "", location: "" });
        } catch (error) {
            console.error("❌ Job Posting Failed:", error.response?.data || error.message);
            setError(error.response?.data?.message || "Failed to post job.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="post-job-container">
            <h2 className="post-job-header">Post a Job</h2>
            {error && <p className="error-message">{error}</p>}
            
            <form className="post-job-form" onSubmit={handleSubmit}>
                <input className="post-job-input" type="text" name="title" placeholder="Job Title" value={job.title} onChange={handleChange} required />
                <textarea className="post-job-textarea" name="description" placeholder="Job Description" value={job.description} onChange={handleChange} required />
                <input className="post-job-input" type="text" name="duration" placeholder="Duration (e.g., 2 weeks)" value={job.duration} onChange={handleChange} required />
                <input className="post-job-input" type="text" name="salary" placeholder="Salary (e.g., ₹500/day)" value={job.salary} onChange={handleChange} required />
                <input className="post-job-input" type="text" name="location" placeholder="Work Location" value={job.location} onChange={handleChange} required />
                
                <button className="post-job-button" type="submit" disabled={loading}>
                    {loading ? "Posting..." : "Post Job"}
                </button>
            </form>
        </div>
    );
};

export default PostJob;
