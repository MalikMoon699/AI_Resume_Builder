import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
      toast.success("User Registered successfully.");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={onSubmit} className="login-form">
        <h2 className="login-title">Create Account</h2>
        <p className="login-subtitle">Join Resume Builder today</p>

        <div className="form-group">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={onChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            required
            className="form-input"
          />
        </div>

        <button type="submit" className="login-btn">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
