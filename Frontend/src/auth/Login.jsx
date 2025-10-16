import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../assets/style/Auth.css";
import Loader from "../components/Loader";
import { toast } from 'react-toastify';

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refresh } = useAuth();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setTimeout(async () => {
          await refresh();
          navigate("/", { replace: true });
        }, 100);
      }
      toast.success("Login successfully.");
    } catch (err) {
      console.error("[Login] Login error:", err);
      toast.error(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={onSubmit} className="login-form">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Sign in to your account</p>

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

        <button
          type="submit"
          disabled={loading}
          className={`login-btn ${loading ? "loading" : ""}`}
        >
          {loading ? <Loader color="white" size="16" stroke="2" /> : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
