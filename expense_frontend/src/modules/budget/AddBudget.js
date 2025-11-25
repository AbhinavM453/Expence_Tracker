import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const CATEGORY_API = "http://localhost:8000/Category/category/";
const BUDGET_API = "http://localhost:8000/budget/budget/";



const AddBudget = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "",
    description: "",
    month: "",
    year: "",
  });

  const token = localStorage.getItem("access");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  
  useEffect(() => {
  if (!token) return;

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  axios
    .get(CATEGORY_API, axiosConfig)
    .then((res) => setCategories(res.data))
    .catch((err) => console.error("Category Fetch Error:", err));

}, [token]);   

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(BUDGET_API, formData, axiosConfig)
      .then((res) => {
        alert("Budget added!");

       
        setFormData({
          name: "",
          amount: "",
          category: "",
          description: "",
          month: "",
          year: "",
        });

        navigate("/budget");
      })
      .catch((err) => {
        console.error(err);
        alert("Error adding budget");
      });
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Add Budget</h2>

        <form onSubmit={handleSubmit} className="mt-3">

          <input
            className="form-control mb-3"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            className="form-control mb-3"
            placeholder="Amount"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />

         
          <div className="mb-3">
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

          <textarea
            className="form-control mb-3"
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            placeholder="Month"
            name="month"
            value={formData.month}
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            placeholder="Year"
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
          />

          <button className="btn btn-primary w-100">Submit</button>
        </form>
      </div>
    </>
  );
};

export default AddBudget;
