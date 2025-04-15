import { useState, useEffect } from "react";
import {
  FiHome,
  FiMail,
  FiUsers,
  FiDollarSign,
  FiClock,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router";

const SideDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set active link based on current URL path
    const currentItem = navItems.find(item => location.pathname.includes(item.path));
    if (currentItem) {
      setActiveLink(currentItem.id);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("sign-in")
  };

  const navItems = [
    {
      icon: <FiHome />,
      label: "Dashboard",
      id: "dashboard",
      path: "/user-dashboard",
    },
    { icon: <FiUsers />, label: "Accounts", id: "accounts", path: "/accounts" },
    {
      icon: <FiDollarSign />,
      label: "Transfer",
      id: "transfer",
      path: "/transfers",
    },
    {
      icon: <FiClock />,
      label: "Transactions",
      id: "transactions",
      path: "/transactions",
    },
    { icon: <FiMail />, label: "Messages", id: "messages", path: "/messages" },
    {
      icon: <FiSettings />,
      label: "Settings",
      id: "settings",
      path: "/settings",
    },
    {
      icon: <FiHelpCircle />,
      label: "Support",
      id: "support",
      path: "/support",
    },
  ];

  return (
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
      <div className="sidebar-toggle">
        <button onClick={() => setCollapsed(!collapsed)}>
          <FiMenu />
        </button>
      </div>
    </div>
  );
};

export default SideDashboard;
