import React, { useState } from "react";
import { registerUser } from "../../api/userApi";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        image: null,
    });

    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        if (e.target.name === "image") {
            setFormData({ ...formData, image: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("phone", formData.phone);
        data.append("password", formData.password);
        data.append("image", formData.image);

        try {
            const res = await registerUser(data);
            setMsg(res.data.Message || "User Registered Successfully!");
            setError("");
        } catch (err) {
            setError(err.response?.data || "Something went wrong");
            setMsg("");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "500px" }}>
            <div className="card shadow">
                <div className="card-body">
                    <h2 className="text-center mb-4">User Registration</h2>

                    {msg && <div className="alert alert-success">{msg}</div>}
                    {error && <div className="alert alert-danger">{JSON.stringify(error)}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="Enter name"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Enter email"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                className="form-control"
                                placeholder="Enter phone"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="Enter password"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Profile Image</label>
                            <input
                                type="file"
                                name="image"
                                className="form-control"
                                accept="image/*"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
