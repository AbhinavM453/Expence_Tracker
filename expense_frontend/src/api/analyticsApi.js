import axios from "axios";

const API_BASE = "http://localhost:8000/analytics/";

export const getSummary = async (token) => {
  return await axios.get(API_BASE + "summary/", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getByCategory = async (token) => {
  return await axios.get(API_BASE + "by-category/", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getMonthly = async (year, token) => {
  return await axios.get(API_BASE + `monthly/?year=${year}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getWeekly = async (token) => {
  return await axios.get(API_BASE + "weekly/", {
    headers: { Authorization: `Bearer ${token}` },
  });
};
