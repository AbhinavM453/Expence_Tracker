import axios from "axios";

const API_BASE = "http://localhost:8000/";    
const USER_BASE = API_BASE + "User/";          



export const registerUser = async (formData) => {
  return await axios.post(USER_BASE + "register/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};



export const loginUser = async (credentials) => {
  return await axios.post(USER_BASE + "login/", credentials);
};

export const getProfile = async () => {
  return await axios.get(USER_BASE + 'profile/', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  });
};

export const updateProfile = async (formData) => {
  return await axios.patch(USER_BASE + 'profile/', formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const changePassword = async (formData) => {
  return await axios.post(USER_BASE + "change-password/", formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  });
};

export const forgotPassword = async (formData) => {
  return await axios.post(USER_BASE + "forgot-password/", formData);
};

export const requestotp = async (formData) => {
  return await axios.post(USER_BASE + "password-reset/request/", formData);
};

export const resetconfirm = async (formData) => {
  return await axios.post(USER_BASE + "password-reset/request/", formData);
};