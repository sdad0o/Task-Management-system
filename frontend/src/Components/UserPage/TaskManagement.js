import React, { useState, useEffect } from "react";
import Navbar from "./Navbar/Navbar";
import axiosInstance from "../../api/axiosInstance";
import { Table, Button, Form, Modal, Pagination } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import "react-toastify/dist/ReactToastify.css";

function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "pending",
  });
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(5);

  
 // Initialize Laravel Echo for real-time events
  useEffect(() => {
    fetchTasks();

    window.Pusher = Pusher;
    window.Echo = new Echo({
      broadcaster: "pusher",
      key: process.env.REACT_APP_PUSHER_KEY,
      cluster: process.env.REACT_APP_PUSHER_CLUSTER,
      forceTLS: true,
    });

    // Listen for TaskUpdated event
    window.Echo.channel("tasks")
      .listen(".TaskUpdated", (event) => {
        toast.info(`Task updated: ${event.task.title}`);
        fetchTasks(); // Refresh the tasks when an update occurs
      });

    return () => {
      window.Echo.disconnect();
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get("/tasks");
      setTasks(response.data);
      setFilteredTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(term.toLowerCase()) ||
        task.description.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredTasks(filtered);
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
       const response =  await axiosInstance.put(`/tasks/${taskData.id}`, taskData);
      } else {
        const response = await axiosInstance.post("/tasks/create", taskData);
      }
      fetchTasks();
      setShowModal(false);
      setTaskData({
        title: "",
        description: "",
        status: "pending",
      });
      setEditMode(false);
      toast.success("Task Saved Successfully");
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Failed to save task");
    }
  };

  const handleEdit = (task) => {
    setTaskData(task);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/tasks/${id}`);
      fetchTasks();
      toast.success("Task Deleted Successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  const handlePaginationClick = (pageNumber) => setCurrentPage(pageNumber);

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  return (
    <>
      <Navbar />

      <div className="container" style={{marginTop: '20vh'}}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <ToastContainer />
          <h2>Task Management</h2>
          <Button onClick={() => setShowModal(true)}>Create Task</Button>
        </div>

        <Form.Control
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={handleSearch}
          className="mb-3"
        />

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.status}</td>
                <td>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEdit(task)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Pagination>
          {[...Array(totalPages).keys()].map((page) => (
            <Pagination.Item
              key={page + 1}
              active={page + 1 === currentPage}
              onClick={() => handlePaginationClick(page + 1)}
            >
              {page + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>

      {/* Modal for Create/Edit Task */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Task" : "Create Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={taskData.title}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={taskData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={taskData.status}
                onChange={handleInputChange}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TaskManagement;