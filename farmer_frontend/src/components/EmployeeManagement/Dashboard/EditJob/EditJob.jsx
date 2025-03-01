import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./EditJob.css"; // Import styles

Modal.setAppElement("#root"); // Required for accessibility

const EditJob = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    // Fetch jobs posted by the farmer
    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/jobs/farmer", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setJobs(response.data);
        } catch (error) {
            console.error("Error fetching jobs:", error.response?.data?.message);
        }
    };

    // Open the edit modal
    const openModal = (job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedJob(null);
    };

    // Handle input change
    const handleChange = (e) => {
        setSelectedJob({ ...selectedJob, [e.target.name]: e.target.value });
    };

    // Handle job update
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/api/jobs/${selectedJob._id}`, selectedJob, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Job updated successfully!");
            closeModal();
            fetchJobs(); // Refresh job list
        } catch (error) {
            console.error("Error updating job:", error.response?.data?.message);
        }
    };

    // Delete a job
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this job?")) {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setJobs(jobs.filter(job => job._id !== id));
            } catch (error) {
                console.error("Error deleting job:", error.response?.data?.message);
            }
        }
    };

    return (
        <div className="edit-job-container">
            <h2>Manage Your Job Postings</h2>
            <table className="job-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Location</th>
                        <th>Salary</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.length > 0 ? (
                        jobs.map(job => (
                            <tr key={job._id}>
                                <td>{job.title}</td>
                                <td>{job.description}</td>
                                <td>{job.location}</td>
                                <td>${job.salary}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => openModal(job)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDelete(job._id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No jobs found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Edit Job Modal */}
            {selectedJob && (
                <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="edit-job-modal">
                    <h2>Edit Job</h2>
                    <form onSubmit={handleUpdate}>
                        <label>Title:</label>
                        <input type="text" name="title" value={selectedJob.title} onChange={handleChange} required />

                        <label>Description:</label>
                        <textarea name="description" value={selectedJob.description} onChange={handleChange} required />

                        <label>Location:</label>
                        <input type="text" name="location" value={selectedJob.location} onChange={handleChange} required />

                        <label>Salary:</label>
                        <input type="number" name="salary" value={selectedJob.salary} onChange={handleChange} required />

                        <div className="modal-actions">
                            <button type="submit" className="save-btn">Save Changes</button>
                            <button type="button" className="close-btn" onClick={closeModal}>Cancel</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default EditJob;
