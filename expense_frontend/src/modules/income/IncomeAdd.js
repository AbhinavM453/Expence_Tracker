import React, { useState } from "react";
import { createIncome } from "../../api/incomeApi";
import { useNavigate } from "react-router-dom";

const AddIncome = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [form, setForm] = useState({
    amount: "",
    source: "",
    date: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createIncome(form, token);
      navigate("/income");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Income</h2>

      <form onSubmit={handleSubmit} className="mt-3">

        <div className="mb-3">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            className="form-control"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Source</label>
          <input
            type="text"
            name="source"
            className="form-control"
            value={form.source}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Date</label>
          <input
            type="date"
            name="date"
            className="form-control"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn btn-success">Add Income</button>
      </form>
    </div>
  );
};

export default AddIncome;
