import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";

const CATEGORY_API = "http://localhost:8000/Category/category/";
const EXPENSE_API = "http://localhost:8000/Expense/expenses/";

const ExpensePage = () => {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    date: "",
    payment_method: "",
    category: "",
  });

  const token = localStorage.getItem("access");

  // ✅ Memoized axios config
  const axiosConfig = useCallback(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }),
    [token]
  );

  // 🎯 Fetch categories
  const fetchCategories = useCallback(() => {
    axios
      .get(CATEGORY_API, axiosConfig())
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Category Fetch Error:", err));
  }, [axiosConfig]);

  // 🎯 Fetch expenses
  const loadExpenses = useCallback(() => {
    axios
      .get(EXPENSE_API, axiosConfig())
      .then((res) => setExpenses(res.data))
      .catch((err) => console.error("Expense Fetch Error:", err));
  }, [axiosConfig]);

  // 🔥 First API call
  useEffect(() => {
    fetchCategories();
    loadExpenses();
  }, [fetchCategories, loadExpenses]);

  const getCategoryName = (id) => {
    const category = categories.find((c) => c.id === id);
    return category ? category.name : "Unknown";
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(EXPENSE_API, formData, axiosConfig())
      .then((res) => {
        alert("Expense added!");
        setFormData({
          title: "",
          amount: "",
          date: "",
          payment_method: "",
          category: "",
        });
        loadExpenses();
      })
      .catch((err) => {
        console.error(err);
        alert("Error adding expense");
      });
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-3">Add Expense</h2>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">

                <div className="col-md-6">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="Expense Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    className="form-control"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    name="date"
                    className="form-control"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Payment Method</label>
                  <select
                    name="payment_method"
                    className="form-select"
                    value={formData.payment_method}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Payment Method</option>
                    <option value="CASH">Cash</option>
                    <option value="CARD">Card</option>
                    <option value="UPI">UPI</option>
                    <option value="BANK">Bank Transfer</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="col-md-12">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-12">
                  <button className="btn btn-primary w-100" type="submit">
                    Add Expense
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>

        <h2 className="mb-3">All Expenses</h2>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Payment Method</th>
                <th>Category</th>
              </tr>
            </thead>

            <tbody>
              {expenses.length > 0 ? (
                expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td>{exp.title}</td>
                    <td>{exp.amount}</td>
                    <td>{exp.date}</td>
                    <td>{exp.payment_method}</td>
                    <td>{getCategoryName(exp.category)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No expenses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ExpensePage;
