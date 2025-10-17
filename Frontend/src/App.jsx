import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./assets/style/Style.css";
import Login from "./auth/Login.jsx";
import SignUp from "./auth/SignUp.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AppLayout from "./layout/AppLayout.jsx";
import { ProtectedRoute, PublicRoute } from "./routes/RouteGuards.jsx";
import CreateResume from "./pages/CreateResume.jsx";
import Preview from "./pages/Preview.jsx";
import LandingPage from "./pages/LandingPage.jsx";

const App = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signUp"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-resume"
          element={
            <ProtectedRoute>
              <CreateResume />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-resume/:id"
          element={
            <ProtectedRoute>
              <CreateResume />
            </ProtectedRoute>
          }
        />
        <Route path="/resume/:id" element={<Preview />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
};

export default App;
