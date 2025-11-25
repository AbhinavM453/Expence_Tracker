import axios from "axios";

const BASE_URL = "http://localhost:8000/ai/";

export const askChatbot = (question, token) => {
  return axios.post(
    `${BASE_URL}chatbot/`,
    { question },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const getInsights = (token) => {
  return axios.get(`${BASE_URL}insights/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getPrediction = (months, token) => {
  return axios.get(`${BASE_URL}predict/?months=${months}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
