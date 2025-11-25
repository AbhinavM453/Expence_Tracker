import React, { useEffect, useState, useCallback } from "react";
import {
  getSummary,
  getByCategory,
  getMonthly,
  getWeekly,
} from "../../api/analyticsApi";

import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement
);

const AnalyticsDashboard = () => {
  const token = localStorage.getItem("access");

  const [summary, setSummary] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState({});
  const [weeklyData, setWeeklyData] = useState({});

  const generateColors = (count) => {
    return Array.from({ length: count }, (_, i) => {
      const hue = Math.floor((360 / (count || 1)) * i);
      return `hsl(${hue}, 70%, 55%)`;
    });
  };

  const loadAnalytics = useCallback(async () => {
    try {
      const s = await getSummary(token);
      const c = await getByCategory(token);
      const m = await getMonthly(new Date().getFullYear(), token);
      const w = await getWeekly(token);

      setSummary(s.data);
      setCategoryData(c.data);
      setMonthlyData(m.data);
      setWeeklyData(w.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4">📊 Analytics Dashboard</h2>


      <div className="row g-3">
        <div className="col-md-3">
          <div
            className="card shadow-sm text-center p-3"
            style={{ background: "#e8f5e9" }}
          >
            <h5>Total Income</h5>
            <h3 className="text-success">₹{summary.total_income}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div
            className="card shadow-sm text-center p-3"
            style={{ background: "#ffebee" }}
          >
            <h5>Total Expense</h5>
            <h3 className="text-danger">₹{summary.total_expense}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div
            className="card shadow-sm text-center p-3"
            style={{ background: "#e3f2fd" }}
          >
            <h5>Balance</h5>
            <h3 className="text-primary">₹{summary.balance}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div
            className="card shadow-sm text-center p-3"
            style={{ background: "#fff3e0" }}
          >
            <h5>Current Month Expense</h5>
            <h3 className="text-warning">₹{summary.current_month_expense}</h3>
          </div>
        </div>
      </div>


      <div
        className="card shadow-sm mt-4 p-3"
        style={{
          background: "linear-gradient(90deg, #8e24aa, #d81b60)",
          color: "white",
        }}
      >
        <h5 className="mb-2">Top Spending Category</h5>
        {summary.top_category ? (
          <h6>
            <strong>{summary.top_category.category}</strong> — ₹
            {summary.top_category.total}
          </h6>
        ) : (
          <p>No data available</p>
        )}
      </div>


      <div className="card shadow-sm mt-4 p-4">
        <h5>Category-wise Expense</h5>
        <div className="chart-container" style={{ height: "350px" }}>
          <Pie
            data={{
              labels: categoryData.map((item) => item.category),
              datasets: [
                {
                  data: categoryData.map((item) => item.total),
                  backgroundColor: generateColors(categoryData.length),
                  borderColor: "#fff",
                  borderWidth: 2,
                },
              ],
            }}
          />
        </div>
      </div>


      <div className="card shadow-sm mt-4 p-4">
        <h5>Monthly Expense</h5>
        <div className="chart-container" style={{ height: "350px" }}>
          <Bar
            data={{
              labels: Object.keys(monthlyData),
              datasets: [
                {
                  label: "Monthly Expense",
                  data: Object.values(monthlyData),
                  backgroundColor: generateColors(
                    Object.keys(monthlyData).length
                  ),
                  borderColor: "#000",
                  borderWidth: 1,
                },
              ],
            }}
          />
        </div>
      </div>


      <div className="card shadow-sm mt-4 p-4 mb-5">
        <h5>Weekly Expense</h5>
        <div className="chart-container" style={{ height: "350px" }}>
          <Line
            data={{
              labels: Object.keys(weeklyData),
              datasets: [
                {
                  label: "Daily Expense",
                  data: Object.values(weeklyData),
                  borderColor: "hsl(200, 85%, 50%)",
                  borderWidth: 3,
                  pointBackgroundColor: generateColors(
                    Object.keys(weeklyData).length
                  ),
                  pointRadius: 6,
                  tension: 0.4,
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
