import React, { useState } from "react";
import { askChatbot } from "../../api/AiApi";
import Navbar from "../../components/Navbar";

const FinanceChatbot = () => {
  const token = localStorage.getItem("access");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = async () => {
    if (!question.trim()) return alert("Enter a question!");

    try {
      const res = await askChatbot(question, token);
      setAnswer(res.data.answer);
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <>
    <Navbar />
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      <h2 className="text-primary fw-bold mb-4">💬 Finance Chatbot</h2>

      
      <div className="card shadow-sm">
        <div className="card-body">

          <label className="form-label fw-semibold">Your Question</label>
          <textarea
            className="form-control"
            rows="4"
            placeholder="Ask something about your finances..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <button
            className="btn btn-primary mt-3 w-100"
            onClick={handleAsk}
          >
            Ask Chatbot
          </button>

        </div>
      </div>

      
      {answer && (
        <div className="card shadow-sm mt-4 border-success">
          <div className="card-header bg-success text-white fw-bold">
            🤖 AI Response
          </div>
          <div className="card-body">
            <p className="mb-0">{answer}</p>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default FinanceChatbot;
