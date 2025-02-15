import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import axiosInstance from "../../api/axiosInstance";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Password validation regex patterns
  const passwordRegex = {
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    number: /\d/,
    specialChar: /[@$!%*?&]/,
    minLength: /.{8,}/,
  };
  // Individual validation state
  const [validations, setValidations] = useState({
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false,
    minLength: false,
  });
  // Handle password change
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData({ ...formData, password });

    // Check each validation rule
    setValidations({
      lowercase: passwordRegex.lowercase.test(password),
      uppercase: passwordRegex.uppercase.test(password),
      number: passwordRegex.number.test(password),
      specialChar: passwordRegex.specialChar.test(password),
      minLength: passwordRegex.minLength.test(password),
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    if (!formData.password_confirmation)
      errors.password_confirmation = "Password Confirmation is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axiosInstance.post("register", formData);

      // Check if Registration was successful or failed
      if (response.data.token && response.data.user) {
        Cookies.set("authToken", response.data.token, { expires: 2 });
        Cookies.set("user_id", response.data.user.id, { expires: 2 });

        toast.success(response.data.message);
        
        navigate('/task-management');
      } else {
        throw new Error(response.data.message || "Invalid credentials");
      }
    } catch (error) {
      let errorsArray = [];

      // Check if each specific error (email, name, password) exists and add them to errorsArray
      if (error.response?.data?.email) {
        errorsArray.push(...error.response.data.email);
      }
      if (error.response?.data?.name) {
        errorsArray.push(...error.response.data.name);
      }
      if (error.response?.data?.password) {
        errorsArray.push(...error.response.data.password);
      }

      // Default message in case no specific errors
      let errorMessage = "Something went wrong!";

      // Format the errors if they exist and combine them into a single string
      if (errorsArray.length > 0) {
        errorMessage = errorsArray.join("<br>");
      }

      Swal.fire({
        title: "Registration Error",
        html: errorMessage,
        icon: "error",
        confirmButtonText: "Okay",
      })
    }
  };

  return (
    <section className="vh-100">
      <div className="container h-100" style={{ maxWidth: "1000px" }}>
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div
              className="card text-black"
              style={{ border: "none", backgroundColor: "transparent" }}
            >
              <div className="card-body p-4">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p className="text-center h3 fw-bold mb-4">Sign up</p>
                    <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>
                      <div className="d-flex flex-row align-items-center mb-3">
                        <i className="fas fa-user fa-lg me-3 fa-fw" />
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="text"
                            name="name"
                            id="form3Example1c"
                            className="form-control"
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            required
                          />
                          <label
                            className="form-label"
                            htmlFor="form3Example1c"
                          >
                            Your Name
                          </label>
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-3">
                        <i className="fas fa-envelope fa-lg me-3 fa-fw" />
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="email"
                            name="email"
                            id="form3Example3c"
                            className="form-control"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            required
                          />
                          <label
                            className="form-label"
                            htmlFor="form3Example3c"
                          >
                            Your Email
                          </label>
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-3">
                        <i className="fas fa-lock fa-lg me-3 fa-fw" />
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="password"
                            name="password"
                            id="form3Example4c"
                            className="form-control"
                            onChange={handlePasswordChange}
                            required
                          />
                          <label
                            className="form-label"
                            htmlFor="form3Example4c"
                          >
                            Password
                          </label>

                          {/* Password validation conditions */}
                          <div
                            className="password-errors"
                            style={{ color: "red", fontSize: "12px" }}
                          >
                            <p
                              style={{
                                display: validations.lowercase
                                  ? "none"
                                  : "block",
                              }}
                            >
                              Must contain at least 1 lowercase letter.
                            </p>
                            <p
                              style={{
                                display: validations.uppercase
                                  ? "none"
                                  : "block",
                              }}
                            >
                              Must contain at least 1 uppercase letter.
                            </p>
                            <p
                              style={{
                                display: validations.number ? "none" : "block",
                              }}
                            >
                              Must contain at least 1 number.
                            </p>
                            <p
                              style={{
                                display: validations.specialChar
                                  ? "none"
                                  : "block",
                              }}
                            >
                              Must contain at least 1 special character
                              (@$!%*?&).
                            </p>
                            <p
                              style={{
                                display: validations.minLength
                                  ? "none"
                                  : "block",
                              }}
                            >
                              Must be at least 8 characters long.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-3">
                        <i className="fas fa-key fa-lg me-3 fa-fw" />
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="password"
                            name="password_confirmation"
                            id="form3Example4cd"
                            className="form-control"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                password_confirmation: e.target.value,
                              })
                            }
                            required
                          />
                          <label
                            className="form-label"
                            htmlFor="form3Example4cd"
                          >
                            Repeat your password
                          </label>

                          {formData.password_confirmation !==
                            formData.password &&
                            formData.password_confirmation && (
                              <p style={{ color: "red" }}>
                                Passwords do not match.
                              </p>
                            )}
                        </div>
                      </div>
                      <div className="d-flex flex-column justify-content-center mx-4 mb-3 mb-lg-4">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          style={{ fontSize: "14px", padding: "10px 20px" }}
                        >
                          Register
                        </button>

                        <p className="small fw-bold mt-2 pt-1 mb-0">
                          Already have an account?{" "}
                          <Link
                            to="/"
                            className="link-danger"
                            style={{ textDecoration: "none" }}
                          >
                            Login
                          </Link>
                        </p>
                      </div>
                    </form>
                    <ToastContainer />
                  </div>
                  <div
                    className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2"
                    style={{ justifyContent: "center" }}
                  >
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                      className="img-fluid"
                      alt="Sample"
                      style={{ maxWidth: "70%", height: "auto" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
