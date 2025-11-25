import React, { useState } from "react";
import { requestotp } from "../../api/userApi";
import {useNavigate} from "react-router-dom";

const RequestOtp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await requestotp({ email });
      setMessage(res.data.message);
      navigate('/forgot-password')
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div className="card shadow p-4" style={{ width: "380px" }}>
        <h3 className="text-center mb-3">Request OTP</h3>
        <p className="text-center text-muted" style={{ fontSize: "14px" }}>
          Enter your registered email to receive an OTP for password reset.
        </p>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestOtp;
