import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";

const EditBudget = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: "",
    description: "",
    month: "",
    year: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Define fetchBudget correctly
  const fetchBudget = useCallback(async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await axios.get(
        `http://127.0.0.1:8000/budget/budget/${id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setForm(res.data);
    } catch (error) {
      console.error("Error fetching budget:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);   // ✅ Now dependency is correct

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access");

    try {
      await axios.put(
        `http://127.0.0.1:8000/budget/budget/${id}/`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Budget updated!");
      navigate("/budget");
    } catch (error) {
      console.error("Error updating", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Edit Budget</h2>

        <form onSubmit={handleSubmit} className="mt-3">
          <input
            className="form-control mb-3"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            name="category"
            value={form.category}
            onChange={handleChange}
          />

          <textarea
            className="form-control mb-3"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            name="month"
            value={form.month}
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            name="year"
            type="number"
            value={form.year}
            onChange={handleChange}
          />

          <button className="btn btn-primary">Update</button>
        </form>
      </div>
    </>
  );
};

export default EditBudget;
