import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getProfile();
        const data = res.data;

        setProfile({
          name: data.name,
          email: data.email,
          phone: data.phone,
          image: data.image,
        });

        setPreview(
          data.image.startsWith("http")
            ? data.image
            : `http://localhost:8000${data.image}`
        );
      } catch (err) {
        setError("Failed to load profile");
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setProfile({ ...profile, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setProfile({ ...profile, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", profile.name);
    data.append("email", profile.email);
    data.append("phone", profile.phone);

    if (profile.image instanceof File) {
      data.append("image", profile.image);
    }

    try {
      await updateProfile(data);
      setMsg("Profile Updated Successfully");

      
      setTimeout(() => {
        navigate("/profile");
      }, 1500);

    } catch (err) {
      setError("Update failed");
    }
  };

  return (
  <div className="container mt-5">
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow p-4">
          <h2 className="text-center mb-4">Edit Profile</h2>

          {msg && <div className="alert alert-success">{msg}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="text-center mb-3">
            {preview && (
              <img src={preview} alt="Profile"  className="rounded-circle border"  style={{ width: "120px", height: "120px", objectFit: "cover"}} />
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input   type="text"  name="name"  value={profile.name}  onChange={handleChange}  className="form-control"  placeholder="Enter your name"  required  />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" name="email" value={profile.email} onChange={handleChange} className="form-control" placeholder="Enter your email" required/>
            </div>

            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input type="text" name="phone" value={profile.phone} onChange={handleChange} className="form-control" placeholder="Enter phone number" required/>
            </div>

            <div className="mb-3">
              <label className="form-label">Profile Image</label>
              <input type="file" name="image" className="form-control" accept="image/*" onChange={handleChange}/>
            </div>

            <button type="submit" className="btn btn-primary w-100">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  </div>
);
}