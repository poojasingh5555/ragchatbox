import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt,FaRobot } from "react-icons/fa";

const Dashboard = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleAsk = async () => {
    if (!query.trim()) return;

    const userMessage = { type: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/ask",
        { query },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const aiMessage = { type: "ai", text: res.data.answer };
      setMessages((prev) => [...prev, aiMessage]);
      setQuery("");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-gray-100">
      {/* 🔵 Navbar */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 shadow-lg px-8 py-4 flex justify-between items-center">
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <FaShieldAlt className="text-blue-600" />
          AI Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-blue-900 px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* 🟣 Main Chat Card */}
      <div className="flex justify-center items-center mt-12 px-4">
        <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-2xl flex flex-col h-[75vh] border border-gray-700">
          {/* Header */}
          <div className="p-5 border-b border-gray-700 text-lg font-medium flex items-center gap-2">
            <FaRobot className="text-purple-400 text-xl drop-shadow-md" />
            Smart Assistant
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-4 rounded-2xl max-w-[70%] shadow-md ${
                  msg.type === "user"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 ml-auto text-white"
                    : "bg-gray-700 text-gray-200"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="text-gray-400 text-sm">AI is typing...</div>
            )}
          </div>

          {/* Input Section */}
          <div className="p-4 border-t border-gray-700 flex gap-3 bg-gray-800">
            <input
              type="text"
              placeholder="Ask something..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
            />
            <button
              onClick={handleAsk}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2 rounded-xl hover:opacity-90 transition"
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
