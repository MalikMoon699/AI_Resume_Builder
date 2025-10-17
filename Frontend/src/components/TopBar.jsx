// components/TopBar.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { buttonProvider } from "../services/Helpers";
import { useAuth } from "../contexts/AuthContext.jsx";

const TopBar = () => {
  const location = useLocation().pathname;
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const { className, title, action } = buttonProvider(
    location,
    navigate,
    currentUser
  );

  return (
    <div className="topbar">
      <h1
        onClick={() => {
          navigate("/dashboard");
        }}
      >
        Resume Builder
      </h1>
      <div>
        {currentUser?.name && (
          <p className="topbar-username">Hi, {currentUser?.name}</p>
        )}
        <button onClick={action} className={`topbar-btn ${className}`}>
          {title}
        </button>
      </div>
    </div>
  );
};

export default TopBar;
