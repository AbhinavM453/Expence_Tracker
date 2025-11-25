import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/Income"; 

export const getIncomes = (token) =>
  axios.get(`${BASE_URL}/income/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createIncome = (data, token) =>
  axios.post(`${BASE_URL}/income/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getIncomeById = (id, token) =>
  axios.get(`${BASE_URL}/income/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateIncome = (id, data, token) =>
  axios.put(`${BASE_URL}/income/${id}/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteIncome = (id, token) =>
  axios.delete(`${BASE_URL}/income/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
