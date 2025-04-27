import React from 'react';
import { FaBars } from 'react-icons/fa';
import './dashboard-layout.css';

const Dasboardheader = ({ toggleCollapse }) => {
  return (
    // <div className="dashboard-header">
    //   <button className="toggle-button" onClick={toggleCollapse} aria-label="Toggle sidebar">
    //     <FaBars />
    //   </button>
    //   <div className="user-profile">
    //     <img
    //       src="https://via.placeholder.com/40"
    //       alt="User Avatar"
    //       className="user-avatar"
    //     />
    //     <span className="user-name">User Name</span>
    //   </div>
    // </div>

    <div>
      <div className="toggle-menu-container">
        <button className="toggle-menu">
          <FiMenu/>
        </button>
      </div>
      <div className={`bank-sidebar ${collapsed ? "collapsed" : ""}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          {!collapsed && <h2>Peebank Admin</h2>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="collapse-btn"
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul>
            {navItems.map((item) => (
              <li
                key={item.id}
                className={activeLink === item.id ? "active" : ""}
                onClick={() => setActiveLink(item.id)}
              >
                <Link to={item.path}>
                  <span className="icon">{item.icon}</span>
                  {!collapsed && <span className="label">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer with Logout */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Sidebar Toggle */}
        {/* <div className="sidebar-toggle">
        <button onClick={() => setCollapsed(!collapsed)}>
          <FiMenu />
        </button>
      </div> */}
      </div>
    </div>
  );
};

export default Dasboardheader;
