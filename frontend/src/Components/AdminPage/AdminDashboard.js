import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import DataTable from "react-data-table-component";
import { Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";


function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/tasks"); // Admin endpoint for fetching all tasks
      if (response.data.status) {
        setTasks(response.data.tasks); // Access the tasks array from the response
      } else {
        console.error("Failed to fetch tasks:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/admin/tasks/${id}`);
      fetchTasks();

      toast.success(response.data.message);
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: false,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "User",
      selector: (row) => row.user.name,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <Button variant="danger" size="sm" onClick={() => handleDelete(row.id)}>
          Delete
        </Button>
      ),
    },
  ];

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("role");
    Cookies.remove("user_id");
    navigate("/");
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Admin Dashboard</h3>
        <ul>
          <li>
            <a href="/admin-dashboard">Tasks Management</a>
          </li>
          <li>
            <button
              className="nav-link btn btn-link text-white"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <ToastContainer />

        <h2>Tasks Management</h2>
        <DataTable
          title="Tasks List"
          columns={columns}
          data={tasks}
          pagination
          progressPending={loading}
          highlightOnHover
          defaultSortField="User"
          subHeader
          subHeaderComponent={
            <input
              type="text"
              placeholder="Search tasks..."
              className="form-control"
              onChange={(e) => {
                const searchTerm = e.target.value.toLowerCase();
                setTasks((prevTasks) =>
                  prevTasks.filter(
                    (task) =>
                      task.title.toLowerCase().includes(searchTerm) ||
                      task.description.toLowerCase().includes(searchTerm)
                  )
                );
              }}
            />
          }
        />
      </div>
    </div>
  );
}

export default AdminDashboard;
