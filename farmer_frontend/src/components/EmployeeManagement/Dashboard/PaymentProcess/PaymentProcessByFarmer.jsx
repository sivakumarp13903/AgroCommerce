import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PaymentProgressByFarmer.css";

const PaymentProgressByFarmer = () => {
    const [payments, setPayments] = useState([]);
    const [farmerId] = useState(localStorage.getItem("farmerId") || null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (farmerId) {
            axios.get(`http://localhost:5000/api/payments/farmer/${farmerId}`)
                .then((response) => {
                    setPayments(response.data);
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

    return (
        <div className="container mt-4">
            <h2>Payment Progress - Farmer</h2>
            
            {successMessage && <p className="success">{successMessage}</p>}
            {error && <p className="error">{error}</p>}

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
                    {payments.length > 0 ? (
                        payments.map((payment) => (
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
    );
};

export default PaymentProgressByFarmer;
