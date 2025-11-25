import React, { useEffect, useState, useCallback } from "react";
import { getIncomes, deleteIncome } from "../../api/incomeApi";
import { Link } from "react-router-dom";

const IncomeList = () => {
  const [incomes, setIncomes] = useState([]);
  const token = localStorage.getItem("access");

  // FIX: Wrap loadIncomes in useCallback
  const loadIncomes = useCallback(async () => {
    try {
      const res = await getIncomes(token);
      setIncomes(res.data);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    }
  }, [token]);

  // FIX: Now safe to use as dependency
  useEffect(() => {
    loadIncomes();
  }, [loadIncomes]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this income?")) {
      await deleteIncome(id, token);
      loadIncomes(); // refresh list after deletion
    }
  };

  return (
    <div className="container mt-4">
      <h2>Income List</h2>

      <Link className="btn btn-primary mb-3" to="/income/add">
        + Add Income
      </Link>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Source</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {incomes.map((item) => (
            <tr key={item.id}>
              <td>₹{item.amount}</td>
              <td>{item.source}</td>
              <td>{item.date}</td>
              <td>
                <Link
                  className="btn btn-sm btn-warning me-2"
                  to={`/edit-income/${item.id}`}
                >
                  Edit
                </Link>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncomeList;
