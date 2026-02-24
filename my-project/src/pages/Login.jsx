import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("https://ragchatbox-b5pe.onrender.com", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#312e81] to-[#7c3aed] overflow-hidden">

      {/* Glow Effects */}
      <div className="  absolute w-96 h-96 bg-pink-500/30 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl bottom-10 right-10"></div>

      {/* Main Layout */}
      <div className="  relative w-full max-w-5xl flex rounded-2xl shadow-2xl overflow-hidden">

        {/* LEFT SIDE - Real Glass */}
        <div className="hidden md:flex md:w-1/2 bg-white/10 backdrop-blur-xl border border-white/20 items-center justify-center p-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to RAG Chatbot
            </h1>
            <p className="text-gray-200 text-lg">
              Start your intelligent journey today.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - Solid White Form */}
        <div className=" animate-fadeInUp w-full md:w-1/2 bg-white p-12 flex flex-col justify-center">

          <h2 className="text-2xl font-semibold mb-8 text-gray-800 text-center">
            Login to your Account
          </h2>

          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email */}
            <div className="relative">
              <label className="text-sm text-gray-600 block mb-1">
                Email
              </label>

              <FaEnvelope className="absolute left-3 top-10 text-gray-400" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="text-sm text-gray-600 block mb-1">
                Password
              </label>

              <FaLock className="absolute left-3 top-10 text-gray-400" />

              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
              />

              <span
                className="absolute right-3 top-10 cursor-pointer text-gray-400"
                onClick={() => setShow(!show)}
              >
                {show ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Forgot */}
            <div className="text-right text-sm">
              <Link
                to="/forgot-password"
                className="text-purple-700 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-700 hover:bg-purple-800"
              }`}
            >
              {loading ? "Signing in..." : "Login"}
            </button>

          </form>

          <p className="text-sm text-center mt-6 text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-purple-700 font-medium hover:underline"
            >
              Register
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;
