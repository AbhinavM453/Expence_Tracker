import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">

        <Link className="navbar-brand fw-bold" to="/home">
          User Dashboard
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* NAV ITEMS */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <Link className="nav-link" to="/home">Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/profile">Profile</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/change-password">Change Password</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/categories">Category</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/expenses">Expense</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/income">Income</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/analytics">Analytics</Link>
            </li>

            {/* BUDGET DROPDOWN */}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                id="budgetDropdown"
              >
                Budget
              </button>

              <ul className="dropdown-menu" aria-labelledby="budgetDropdown">
                <li>
                  <Link className="dropdown-item" to="/budget">
                    View Budgets
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/add-budget">
                    Add Budget
                  </Link>
                </li>
              </ul>
            </li>

            {/* AI TOOLS DROPDOWN */}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                id="aiDropdown"
              >
                AI Tools
              </button>

              <ul className="dropdown-menu" aria-labelledby="aiDropdown">
                <li>
                  <Link className="dropdown-item" to="/chatbot">
                    Finance Chatbot
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/insights">
                    AI Insights
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/predict">
                    AI Predict
                  </Link>
                </li>
              </ul>
            </li>

            {/* LOGOUT */}
            <li className="nav-item">
              <button onClick={handleLogout} className="btn btn-danger ms-2">
                Logout
              </button>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
