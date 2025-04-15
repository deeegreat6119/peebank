import React from "react";
import SideDashboard from "./SideDashboard";
import { Outlet } from "react-router-dom";
import "../Dashboard/dashboard-layout.css";

import { useState } from 'react';
// import { Outlet } from 'react-router-dom';
// import SideDashboard from './SideDashboard';
// import './DashboardLayout.css'; // Create this CSS file

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`dashboard-container ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-wrapper">
        <SideDashboard 
          isCollapsed={isCollapsed}
          toggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

// export default DashboardLayout;

export default DashboardLayout;
