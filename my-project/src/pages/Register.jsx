import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex">

        {/* LEFT SIDE */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-600 to-indigo-600 text-white items-center justify-center p-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">
              Join Our Platform 🚀
            </h1>
            <p className="text-sm opacity-90">
              Create your account and explore amazing features.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 p-10">

          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Create Account
          </h2>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-center text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">

            {/* Name */}
            <div className="relative">
              <FaUser className="absolute left-3 top-4 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <span
                className="absolute right-3 top-4 cursor-pointer text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-4 text-gray-400" />
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <span
                className="absolute right-3 top-4 cursor-pointer text-gray-400"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                loading
                  ? "bg-gray-400"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {loading ? "Creating Account..." : "Register"}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
};

export default Register;
