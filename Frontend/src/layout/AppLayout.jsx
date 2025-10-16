import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/Topbar";

const AppLayout = () => {

  return (
      <div className="main-content">
        <TopBar />
        <Outlet />
      </div>
  );
};

export default AppLayout;
