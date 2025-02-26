import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";

const ManageProduct = () => {
  const [commodities, setCommodities] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [updatedData, setUpdatedData] = useState({});

  useEffect(() => {
    fetchCommodities();
  }, []);

  // Fetch all commodities
  const fetchCommodities = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/commodity/list");
      setCommodities(res.data.data);
    } catch (error) {
      console.error("Error fetching commodities:", error);
    }
  };

  // Open Edit Modal
  const handleEditClick = (commodity) => {
    setSelectedCommodity(commodity);
    setUpdatedData({
      name: commodity.name,
      description: commodity.description,
      price: commodity.price,
      category: commodity.category,
    });
    setShowEditModal(true);
  };

  // Handle Update Commodity
  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/commodity/update/${selectedCommodity._id}`,
        updatedData
      );
      setShowEditModal(false);
      fetchCommodities(); // Refresh the list
    } catch (error) {
      console.error("Error updating commodity:", error);
    }
  };

  // Handle Delete Commodity
  const handleDelete = async (id) => {
    try {
      await axios.post("http://localhost:5000/api/commodity/remove", { id });
      fetchCommodities(); // Refresh the list after deleting
    } catch (error) {
      console.error("Error deleting commodity:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Products</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {commodities.map((commodity) => (
            <tr key={commodity._id}>
              <td>{commodity.name}</td>
              <td>{commodity.description}</td>
              <td>Rs{commodity.price}</td>
              <td>{commodity.category}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditClick(commodity)}>
                  Edit
                </Button>{" "}
                <Button variant="danger" onClick={() => handleDelete(commodity._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Commodity Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Commodity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={updatedData.name}
                onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={updatedData.description}
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={updatedData.price}
                onChange={(e) => setUpdatedData({ ...updatedData, price: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={updatedData.category}
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, category: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageProduct;
