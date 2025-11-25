import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../api/userApi";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [msg, setMsg] = useState("");
  const [err, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await changePassword(formData);
      setMsg(res.data.message);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data ||
          "Something went wrong"
      );
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div className="card shadow p-4" style={{ width: "380px" }}>
        <h3 className="text-center mb-3">Change Password</h3>

        {msg && <div className="alert alert-success text-center">{msg}</div>}
        {err && (
          <div className="alert alert-danger text-center">
            {JSON.stringify(err)}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Old Password</label>
            <input
              type="password"
              name="old_password"
              className="form-control"
              placeholder="Enter old password"
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

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              className="form-control"
              placeholder="Re-enter new password"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-2">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
