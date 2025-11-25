import React, { useState } from "react";
import { getPrediction } from "../../api/AiApi";
import Navbar from "../../components/Navbar";

const AIPredict = () => {
  const token = localStorage.getItem("access");

  const [months, setMonths] = useState(3);
  const [history, setHistory] = useState([]);
  const [prediction, setPrediction] = useState("");

  const handlePredict = async () => {
    try {
      const res = await getPrediction(months, token);
      setHistory(res.data.history_used);
      setPrediction(res.data.prediction);
    } catch (err) {
      console.log(err);
      alert("Prediction failed!");
    }
  };

  return (
    <>
    <Navbar />
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      <h2 className="fw-bold text-primary mb-4">
        📅 AI Expense Prediction
      </h2>

  
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <label className="form-label fw-semibold">
            Months to Predict (1 - 12)
          </label>

          <div className="d-flex gap-3 align-items-center">
            <input
              type="number"
              className="form-control"
              style={{ maxWidth: "150px" }}
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              min="1"
              max="12"
            />

            <button className="btn btn-primary" onClick={handlePredict}>
              🔮 Predict
            </button>
          </div>
        </div>
      </div>

   
      {history.length > 0 && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-info text-white fw-semibold">
            📌 History Used for Prediction
          </div>

          <div className="card-body">
            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontSize: "0.95rem",
                lineHeight: "1.5",
              }}
            >
              {JSON.stringify(history, null, 2)}
            </pre>
          </div>
        </div>
      )}

      
      {prediction && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-success text-white fw-semibold">
            📊 Predicted Expenses
          </div>

          <div className="card-body">
            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontSize: "1rem",
                lineHeight: "1.6",
                color: "#155724",
              }}
            >
              {prediction}
            </pre>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default AIPredict;
