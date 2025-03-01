import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PaymentProgressByFarmer.css";

const PaymentProgressByFarmer = () => {
    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [farmerId] = useState(localStorage.getItem("farmerId") || null);
    const [filters, setFilters] = useState({ job: "", worker: "", status: "" });
    const [jobOptions, setJobOptions] = useState([]);
    const [workerOptions, setWorkerOptions] = useState([]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (farmerId) {
            axios.get(`http://localhost:5000/api/payments/farmer/${farmerId}`)
                .then((response) => {
                    setPayments(response.data);
                    setFilteredPayments(response.data);

                    // Extract unique job and worker names for dropdown options
                    const jobs = [...new Set(response.data.map(payment => payment.jobId?.title))];
                    const workers = [...new Set(response.data.map(payment => payment.workerId?.name))];
                    setJobOptions(jobs);
                    setWorkerOptions(workers);
                })
                .catch((error) => {
                    console.error("Error fetching payment progress:", error);
                    setError("Failed to load payment progress");
                });
        } else {
            setError("Farmer ID not found in localStorage");
        }
    }, [farmerId]);

    const updatePaymentStatus = async (paymentId) => {
        try {
            const response = await axios.put(
                `http://localhost:5000/api/payments/update/${paymentId}`, 
                { paymentStatus: "sent" }
            );

            if (response.status === 200) {
                setPayments((prevPayments) =>
                    prevPayments.map((payment) =>
                        payment._id === paymentId ? { ...payment, paymentStatus: "sent" } : payment
                    )
                );
                setSuccessMessage("Payment status updated to Sent!");
                setTimeout(() => setSuccessMessage(""), 3000);
            }
        } catch (error) {
            console.error("Error updating payment status:", error);
            setError("Failed to update payment status");
        }
    };

    // Filtering logic
    useEffect(() => {
        const filteredData = payments.filter((payment) =>
            (filters.job === "" || payment.jobId?.title === filters.job) &&
            (filters.worker === "" || payment.workerId?.name === filters.worker) &&
            (filters.status === "" || payment.paymentStatus === filters.status)
        );
        setFilteredPayments(filteredData);
    }, [filters, payments]);

    return (
        <div className="payment-body">
            <div className="container mt-4">
                <h2>Payment Progress - Farmer</h2>
                
                {successMessage && <p className="success">{successMessage}</p>}
                {error && <p className="error">{error}</p>}

                {/* Filter Dropdowns */}
                <div className="filter-container">
                    <select
                        value={filters.job}
                        onChange={(e) => setFilters({ ...filters, job: e.target.value })}
                    >
                        <option value="">All Jobs</option>
                        {jobOptions.map((job, index) => (
                            <option key={index} value={job}>{job}</option>
                        ))}
                    </select>

                    <select
                        value={filters.worker}
                        onChange={(e) => setFilters({ ...filters, worker: e.target.value })}
                    >
                        <option value="">All Workers</option>
                        {workerOptions.map((worker, index) => (
                            <option key={index} value={worker}>{worker}</option>
                        ))}
                    </select>

                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="sent">Sent</option>
                    </select>
                </div>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Job Name</th>
                            <th>Worker Name</th>
                            <th>Payment Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.length > 0 ? (
                            filteredPayments.map((payment) => (
                                <tr key={payment._id}>
                                    <td>{payment.jobId?.title || "N/A"}</td>
                                    <td>{payment.workerId?.name || "N/A"}</td>
                                    <td>{payment.paymentStatus}</td>
                                    <td>
                                        {payment.paymentStatus === "pending" ? (
                                            <button 
                                                className="btn btn-primary"
                                                onClick={() => updatePaymentStatus(payment._id)}
                                            >
                                                Send Payment
                                            </button>
                                        ) : (
                                            <span className="sent-text">Sent</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No payment progress found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentProgressByFarmer;
