import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PaymentProgressByWorker.css";

const PaymentProgressByWorker = () => {
    const [payments, setPayments] = useState([]);
    const [workerId] = useState(localStorage.getItem("workerId") || null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (workerId) {
            axios.get(`http://localhost:5000/api/payments/worker/${workerId}`)
                .then((response) => {
                    setPayments(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching payment progress:", error);
                    setError("Failed to load payment progress");
                });
        } else {
            setError("Worker ID not found in localStorage");
        }
    }, [workerId]);

    const verifyPayment = async (paymentId) => {
        try {
            const response = await axios.put(
                `http://localhost:5000/api/payments/verify-worker/${paymentId}`
            );

            if (response.status === 200) {
                setPayments((prevPayments) =>
                    prevPayments.map((payment) =>
                        payment._id === paymentId ? { ...payment, paymentStatus: "verified" } : payment
                    )
                );
                setSuccessMessage("Payment status updated to Verified!");
                setTimeout(() => setSuccessMessage(""), 3000);
            }
        } catch (error) {
            console.error("Error verifying payment:", error);
            setError("Failed to verify payment");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Payment Progress - Worker</h2>
            
            {successMessage && <p className="success">{successMessage}</p>}
            {error && <p className="error">{error}</p>}

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Job Name</th>
                        <th>Farmer Name</th>
                        <th>Payment Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.length > 0 ? (
                        payments.map((payment) => (
                            <tr key={payment._id}>
                                <td>{payment.jobId?.title || "N/A"}</td>
                                <td>{payment.farmerId?.name || "N/A"}</td>
                                <td>{payment.paymentStatus}</td>
                                <td>
                                    {payment.paymentStatus === "sent" ? (
                                        <button 
                                            className="btn btn-success"
                                            onClick={() => verifyPayment(payment._id)}
                                        >
                                            Verify Payment
                                        </button>
                                    ) : payment.paymentStatus === "verified" ? (
                                        <span className="verified-text">Verified</span>
                                    ) : (
                                        <span className="pending-text">Pending</span>
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
    );
};

export default PaymentProgressByWorker;
