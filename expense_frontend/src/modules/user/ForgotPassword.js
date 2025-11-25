import React, { useState } from "react";
import { forgotPassword } from "../../api/userApi";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      const res = await forgotPassword({ email });
      setMsg(res.data.message);
    } catch (err) {
      setError(
        err.response?.data?.email ||
        err.response?.data ||
        "Something went wrong"
      );
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card p-4 shadow" style={{ maxWidth: "420px", width: "100%" }}>
        
        <h3 className="text-center mb-3">Forgot Password</h3>

        {msg && <div className="alert alert-success">{msg}</div>}
        {error && <div className="alert alert-danger">{JSON.stringify(error)}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Registered Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Send Password
          </button>
        </form>

        <ul className="list-unstyled mt-4 text-center">
          <li>
            <Link to="/password-reset/request/">Request OTP</Link>
          </li>
          <li className="mt-2">
            <Link to="/password-reset/confirm/">Reset Password</Link>
          </li>
        </ul>

      </div>
    </div>
  );
}
