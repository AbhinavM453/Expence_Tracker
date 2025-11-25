import React from "react";
import Navbar from "../../components/Navbar";

const UserHome = () => {
  return (
    <>
      <Navbar />

      <div className="p-6">
        <h2 className="text-2xl font-semibold">Welcome to Your Dashboard</h2>
        <p className="mt-3">This is your home page after login.</p>
      </div>
    </>
  );
};

export default UserHome;
