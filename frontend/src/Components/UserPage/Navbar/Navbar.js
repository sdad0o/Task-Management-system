import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Logo from "../../../assets/imgs/todo-list.png";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("role");
    Cookies.remove("user_id");
    navigate("/");
  };

  return (
    <header className="header d-flex align-items-center fixed-top">
      <div className="container-fluid container-xl d-flex justify-content-between align-items-center">
        <a href="/" className="logo d-flex align-items-center">
          <img src={Logo} alt="Logo" />
        </a>

        <ul className="navbar-nav d-flex align-items-center ms-auto">
          <li className="nav-item">
            <button
              className="nav-link btn btn-link text-white"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Navbar;
