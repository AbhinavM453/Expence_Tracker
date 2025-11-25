import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";

const BudgetPage = () => {
  const [budgets, setBudgets] = useState([]);

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem("access");

      const res = await axios.get("http://127.0.0.1:8000/budget/budget/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Budget Response:", res.data); 

      setBudgets(res.data);
    } catch (error) {
      console.error("Error fetching budgets", error);
    }
  };

  const deleteBudget = async (id) => {
    if (!window.confirm("Delete this budget?")) return;

    try {
      const token = localStorage.getItem("access");

      await axios.delete(`http://127.0.0.1:8000/budget/budget/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchBudgets();
    } catch (error) {
      console.error("Error deleting budget", error);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-3">Your Budgets</h2>

        <Link to="/add-budget" className="btn btn-primary mb-3">
          Add Budget
        </Link>

        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Month</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {budgets.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No budgets found
                </td>
              </tr>
            ) : (
              budgets.map((b) => (
                <tr key={b.id}>
                  <td>{b.name}</td>
                  <td>{b.amount}</td>
                  <td>{b.category_name || b.category}</td>
                  <td>{b.month}</td>
                  <td>{b.year}</td>
                  <td>
                    <Link
                      to={`/edit-budget/${b.id}`}
                      className="btn btn-warning btn-sm me-2"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteBudget(b.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BudgetPage;
