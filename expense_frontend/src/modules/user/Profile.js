import React, { useEffect, useState } from "react";
import { getProfile } from "../../api/userApi";
import { Link } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
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
        
        if (data.image) {
  let imgUrl = data.image;

  
  if (!imgUrl.startsWith("/")) {
    imgUrl = "/" + imgUrl;
  }

  if (!imgUrl.startsWith("/media")) {
    imgUrl = "/media" + imgUrl;
  }

  setPreview("http://localhost:8000" + imgUrl);
}

      } catch (err) {
        setError("Failed to load profile");
      }
    }

    fetchData();
  }, []);

  return (
  <div className="container mt-5 d-flex justify-content-center">
    <div className="card shadow p-4" style={{ width: "380px" }}>
      <h3 className="text-center mb-3">User Profile</h3>

      {error && (
        <div className="alert alert-danger text-center py-2">
          {error}
        </div>
      )}

   
      <div className="text-center mb-3">
        {preview ? (
          <img
            src={preview}
            alt="User"
            className="rounded-circle"
            style={{
              width: "130px",
              height: "130px",
              objectFit: "cover",
              border: "3px solid #0d6efd",
            }}
          />
        ) : (
          <div className="alert alert-secondary py-2">
            No Profile Image
          </div>
        )}
      </div>

      
      <ul className="list-group list-group-flush mb-3">
        <li className="list-group-item">
          <strong>Name:</strong> {profile.name}
        </li>
        <li className="list-group-item">
          <strong>Email:</strong> {profile.email}
        </li>
        <li className="list-group-item">
          <strong>Phone:</strong> {profile.phone}
        </li>
      </ul>

     
      <div className="text-center">
        <Link to="/edit-profile" className="btn btn-primary w-100">
          Edit Profile
        </Link>
      </div>
    </div>
  </div>
);
}