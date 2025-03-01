import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";
import "./ManageUsers.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedUserData, setUpdatedUserData] = useState({});
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user");
      setUsers(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users");
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setUpdatedUserData({
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location || "",
      phone: user.phone || "",
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/user/${selectedUser._id}`,
        updatedUserData
      );
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/user/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const locations = [
    "All",
    ...new Set(users.map((user) => user.location).filter(Boolean)),
  ];

  const filteredUsers = users.filter((user) => {
    return (
      (selectedLocation === "All" || user.location === selectedLocation) &&
      (roleFilter === "All" || user.role === roleFilter)
    );
  });

  return (
    <div className="manage-users-container1">
      <h2 className="manage-users-title1">Manage Users</h2>

      <div className="filters1">
        <Form.Select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </Form.Select>

        <Form.Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="farmer">Farmer</option>
          <option value="worker">Worker</option>
          <option value="buyer">Buyer</option>
          <option value="admin">Admin</option>
        </Form.Select>
      </div>

      {loading && <p className="loading-text1">Loading...</p>}
      {error && <p className="error-text1">{error}</p>}
      {!loading && filteredUsers.length === 0 && (
        <p className="no-data-text1">No users found.</p>
      )}

      <Table striped bordered hover className="manage-users-table1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Location</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.location || "N/A"}</td>
              <td>{user.phone || "N/A"}</td>
              <td>
                <Button
                  className="manage-users-edit-btn1"
                  onClick={() => handleEditClick(user)}
                >
                  Edit
                </Button>
                <Button
                  className="manage-users-delete-btn1"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        className="manage-users-modal1"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-31">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={updatedUserData.name}
                onChange={(e) =>
                  setUpdatedUserData({
                    ...updatedUserData,
                    name: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-31">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={updatedUserData.email}
                onChange={(e) =>
                  setUpdatedUserData({
                    ...updatedUserData,
                    email: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-31">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={updatedUserData.role}
                onChange={(e) =>
                  setUpdatedUserData({
                    ...updatedUserData,
                    role: e.target.value,
                  })
                }
              >
                <option value="farmer">Farmer</option>
                <option value="worker">Worker</option>
                <option value="buyer">Buyer</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-31">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={updatedUserData.location}
                onChange={(e) =>
                  setUpdatedUserData({
                    ...updatedUserData,
                    location: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={updatedUserData.phone}
                onChange={(e) =>
                  setUpdatedUserData({
                    ...updatedUserData,
                    phone: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateUser}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageUsers;
