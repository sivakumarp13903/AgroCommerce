import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EmployeeList.css";

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        axios.get("/api/employees")
            .then((res) => setEmployees(res.data))
            .catch((err) => console.error("Error fetching employees:", err));
    }, []);

    return (
        <div className="employee-list">
            <h2>Available Workers</h2>
            <ul>
                {employees.map((employee) => (
                    <li key={employee.id}>
                        <span>{employee.name} - {employee.skill}</span>
                        <a href={`/farmer/recruitment/employees/${employee.id}`} className="view-btn">View Profile</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EmployeeList;
