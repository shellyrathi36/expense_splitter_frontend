import { useState } from "react";
import axios from "axios";
import React from "react";

export default function AuthForm({ mode, setPage, handleLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const isRegister = mode === "register";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const url = isRegister
        ? "http://localhost:3000/api/register"
        : "http://localhost:3000/api/login";
      const res = await axios.post(url, form);

      setMessage(
        res.data.message || (isRegister ? "Registered!" : "Logged in!")
      );

      if (!isRegister && res.data.token) {
        // Update App state and navigate to dashboard
        handleLogin(res.data.token);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
        {isRegister ? "Create Account" : "Login"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          {isRegister ? "Register" : "Login"}
        </button>
      </form>

      {message && <p className="text-center mt-4 text-gray-700">{message}</p>}

      <div className="text-center mt-6 text-sm text-gray-500">
        {isRegister ? "Already have an account?" : "New here?"}{" "}
        <button
          onClick={() => setPage(isRegister ? "login" : "register")}
          className="text-blue-600 hover:underline"
        >
          {isRegister ? "Login" : "Register"}
        </button>
      </div>
    </div>
  );
}
