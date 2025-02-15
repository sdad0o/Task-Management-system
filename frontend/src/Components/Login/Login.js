import "../../assets/styling/style.css";
import axiosInstance from "../../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  // Validations
  const validate = () => {
    const errors = {};
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axiosInstance.post("login", formData);

      // Check if login was successful or failed
      if (response.data.token && response.data.user) {
        // Successful login, store token and user info in cookies
        Cookies.set("authToken", response.data.token, { expires: 2 });
        Cookies.set("user_id", response.data.user.id, { expires: 2 });
        Cookies.set("role", response.data.user.role, { expires: 2 });

        toast.success(response.data.message);

        // Redirect based on the role
        if (response.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else if (response.data.user.role === "user") {
          navigate("/task-management");
        }
      } else {
        throw new Error(response.data.message || "Invalid credentials");
      }
    } catch (error) {
      // Handle server-side or other errors
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong!";
      toast.error(errorMessage);

      // Set error state to display server message and errors
      const serverErrors = error.response?.data?.errors || {};
      setErrors(serverErrors);
    }
  };
  return (
    <section className="vh-100 login-container">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid"
              alt="Sample image"
            />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1 login-wrapper">
            <form onSubmit={handleSubmit}>
              {/* <!-- Email input --> */}
              <div data-mdb-input-init className="form-outline mb-4">
                <input
                  type="email"
                  name="email"
                  className="form-control form-control-lg"
                  placeholder="Enter a valid email address"
                  onChange={handleChange}
                />
                <label className="form-label" for="form3Example3">
                  Email address
                </label>
              </div>

              {/* <!-- Password input --> */}
              <div data-mdb-input-init className="form-outline mb-3">
                <input
                  type="password"
                  name="password"
                  className="form-control form-control-lg"
                  placeholder="Enter password"
                  onChange={handleChange}
                />
                <label className="form-label" for="form3Example4">
                  Password
                </label>
              </div>

              <div className="d-flex flex-column text-center text-lg-start mt-4 pt-2">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg login-btn"
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                >
                  Login
                </button>
                <p className="small fw-bold mt-2 pt-1 mb-0">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="link-danger"
                    style={{ textDecoration: "none" }}
                  >
                    Register
                  </Link>
                </p>
              </div>
            </form>
            <ToastContainer />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
