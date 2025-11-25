import React, { useEffect, useState, useCallback } from "react";
import { getIncomeById, updateIncome } from "../../api/incomeApi";
import { useNavigate, useParams } from "react-router-dom";

const EditIncome = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [form, setForm] = useState({
    amount: "",
    source: "",
    date: "",
  });

  // FIX: Wrap loadIncome in useCallback so it can be a safe dependency
  const loadIncome = useCallback(async () => {
    try {
      const res = await getIncomeById(id, token);
      setForm(res.data);
    } catch (error) {
      console.log("Error loading income:", error);
    }
  }, [id, token]);

  // FIX: Now React is happy, because loadIncome is stable
  useEffect(() => {
    loadIncome();
  }, [loadIncome]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateIncome(id, form, token);
      navigate("/incomes");
    } catch (error) {
      console.log("Update error:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Income</h2>

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

        <button className="btn btn-primary">Update Income</button>
      </form>
    </div>
  );
};

export default EditIncome;
