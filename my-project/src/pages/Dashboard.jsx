import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaShieldAlt, FaRobot, FaMicrophone, FaFileUpload } from "react-icons/fa";

const Dashboard = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const chatAreaRef = useRef(null);

  // ✅ Voice ke liye - likhega + bolega
  const handleVoiceAsk = async (voiceQuery) => {
    if (!voiceQuery.trim()) return;
    setError(null);

    const userMessage = { type: "user", text: voiceQuery };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/ask",
        { query: voiceQuery },
        { headers: { Authorization: token ? `Bearer ${token}` : "" } }
      );

      const answerText = res.data.answer || "I don't know";
      setMessages((prev) => [...prev, { type: "ai", text: answerText }]);
      speak(answerText); // ✅ Bolega bhi
      setQuery("");
    } catch (err) {
      console.error(err);
      setError("Error fetching AI response. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Ask button - sirf likhega, bolega nahi
  const handleAsk = async () => {
    if (!query.trim() || loading) return;
    setError(null);

    const userMessage = { type: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/ask",
        { query },
        { headers: { Authorization: token ? `Bearer ${token}` : "" } }
      );

      const answerText = res.data.answer || "I don't know";
      setMessages((prev) => [...prev, { type: "ai", text: answerText }]);
      // ❌ speak nahi hai
      setQuery("");
    } catch (err) {
      console.error(err);
      setError("Error fetching AI response. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech Recognition not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setListening(false);
      handleVoiceAsk(transcript); // ✅ Auto ask + bolega
    };

    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError(null);
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/upload-pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      setMessages((prev) => [
        ...prev,
        { type: "ai", text: `✅ ${file.name} uploaded successfully!` },
      ]);
    } catch (err) {
      console.error(err);
      setError("PDF upload failed. Try again.");
    } finally {
      event.target.value = null;
    }
  };

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-gray-100">
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 shadow-lg px-8 py-4 flex justify-between items-center">
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <FaShieldAlt className="text-blue-600" />
          AI Dashboard
        </h1>
      </div>

      <div className="flex justify-center items-center mt-12 px-4">
        <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-2xl flex flex-col h-[75vh] border border-gray-700">
          <div className="p-5 border-b border-gray-700 text-lg font-medium flex items-center gap-2">
            <FaRobot className="text-purple-400 text-xl drop-shadow-md" />
            Smart Assistant
          </div>

          <div ref={chatAreaRef} className="flex-1 overflow-y-auto p-6 space-y-4">
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

            {loading && <div className="text-gray-400 text-sm">AI is typing...</div>}
            {error && <div className="text-red-400 text-sm">{error}</div>}
          </div>

          <div className="p-4 border-t border-gray-700 flex gap-3 bg-gray-800 items-center">
            <input
              type="text"
              placeholder="Ask something..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              className="flex-1 bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
            />

            <button
              onClick={startListening}
              className={`px-4 py-2 rounded-xl ${listening ? "bg-red-600 animate-pulse" : "bg-purple-600"}`}
            >
              <FaMicrophone />
            </button>

            <button
              onClick={handleAsk}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2 rounded-xl hover:opacity-90 transition disabled:opacity-50"
            >
              Ask
            </button>

            <label className="bg-green-600 px-4 py-2 rounded-xl cursor-pointer hover:opacity-90 transition flex items-center gap-2">
              <FaFileUpload />
              <span>Upload PDF</span>
              <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;