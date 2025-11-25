import React, { useState } from "react";
import { resetconfirm } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    new_password: "",
  });

  const [msg, setMsg] = useState("");
  const [err, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("email", formData.email);
    data.append("otp", formData.otp);
    data.append("new_password", formData.new_password);

    try {
      const res = await resetconfirm(data);
      setMsg(res.data.message || "Password Reset Successfully");
      setError("");
      navigate('/forgot-password')
    } catch (error) {
      setError(error.response?.data || "Something went wrong");
      setMsg("");
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card p-4 shadow" style={{ maxWidth: "450px", width: "100%" }}>
        
        <h3 className="text-center mb-3">Reset Password</h3>

        {msg && <div className="alert alert-success">{msg}</div>}
        {err && <div className="alert alert-danger">{JSON.stringify(err)}</div>}

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your registered email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">OTP</label>
            <input
              type="text"
              name="otp"
              className="form-control"
              placeholder="Enter OTP"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              name="new_password"
              className="form-control"
              placeholder="Enter new password"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Reset Password
          </button>
        </form>

      </div>
    </div>
  );
}
