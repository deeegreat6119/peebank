import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell, FiRefreshCw } from "react-icons/fi";
import baseUrl from "../../Constants";
import {useAccounts} from "../../hooks/UseAccount"
// import PropTypes from 'prop-types';
// import './Dashboard.css';

const Dashboard = () => {
  const { 
    // account, 
    // loading, 
    // error, 
    fetchAccounts, 
    updateAccountBalance 
  } = useAccounts();
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState({
    user: {},
    accounts: [],
    recentTransactions: [],
    stats: {}
  });
  const [_loading, setLoading] = useState(true);
  const [_error, setError] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [dashboardResponse, transactionsResponse] = await Promise.all([
          fetch(`${baseUrl}/dashboard`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
          }),
          fetch(`${baseUrl}/transactions`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          })
        ]);

        if (!dashboardResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const dashboardJson = await dashboardResponse.json();
        let transactionsData = [];
        
        if (transactionsResponse.ok) {
          const { data } = await transactionsResponse.json();
          transactionsData = data.map(txn => ({
            id: txn.id,
            description: txn.description || 'Transaction',
            date: txn.date || new Date().toISOString(),
            account: txn.account || 'Primary Account',
            amount: Math.abs(txn.amount),
            type: txn.amount >= 0 ? 'credit' : 'debit'
          }));
        }

        // Handle both possible response structures
        const dashboardData = dashboardJson.data || {
          user: dashboardJson.User,
          accounts: dashboardJson.User?.accounts || [],
          recentTransactions: dashboardJson.User?.recentTransactions || transactionsData.slice(0, 5),
          stats: dashboardJson.User?.stats || {}
        };

        // If no recentTransactions from dashboard, use first 5 from transactions API
        if (!dashboardData.recentTransactions?.length && transactionsData.length) {
          dashboardData.recentTransactions = transactionsData.slice(0, 5);
        }

        setDashboardData(dashboardData);
        setSelectedAccount(dashboardData.accounts[0]?.id || null);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message);
        if (err.message.includes('token') || err.message.includes('401')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  useEffect(() => {
    const handleBalanceUpdate = (event) => {
      if (event.detail?.accountId && event.detail?.newBalance) {
        updateAccountBalance(event.detail.accountId, event.detail.newBalance);
      }
    };

    window.addEventListener('balanceUpdate', handleBalanceUpdate);
    return () => window.removeEventListener('balanceUpdate', handleBalanceUpdate);
  }, [updateAccountBalance]);
  
  const { user, accounts, stats } = dashboardData;
  const accountNumber = accounts[0]?.number;
  

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatAccountNumber = (accountNumber) => {
    if (!accountNumber) return "****";
    return `****${accountNumber.slice(-4)}`;
  };

  const getAccountIcon = (type) => {
    switch (type) {
      case "savings":
        return "💰";
      case "investment":
        return "📈";
      default:
        return "🏦";
    }
  };

  const getTotalBalance = () => {
    return stats?.totalBalance || 
           accounts.reduce((sum, account) => sum + account.balance, 0);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case "transfer":
        navigate("/transfers");
        break;
      case "pay":
        navigate("/pay");
        break;
      case "deposit":
        navigate("/deposit");
        break;
      case "card":
        navigate("/cards");
        break;
      default:
        break;
    }
  };
  const handleRefresh = async () => {
    try {
      await fetchAccounts();
      const response = await fetch(`${baseUrl}/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      setDashboardData(prev => ({
        ...prev,
        recentTransactions: data.data?.recentTransactions || 
                          data.User?.recentTransactions || 
                          prev.recentTransactions
      }));
    } catch (err) {
      console.error("Refresh error:", err);
    }
  };

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <div>
        <header className="dashboard-header">
          <h2>Bank Dashboard Overview</h2>
          <div className="header-actions">
            <button className="refresh-btn" onClick={handleRefresh}>
              <FiRefreshCw /> Refresh Data
            </button>
            <div className="notifications">
              <FiBell />
              <span className="badge">3</span>
            </div>
                <div className="user-profile">
                  <div className="avatar">{user?.avatar || ''}</div>
                  <span>{user.firstName || 'User'}</span>
                </div>
          </div>
        </header>
      </div>

      {/* Account Summary */}
      <div className="account-summary">
        <div className="summary-card total-balance">
          <h2>Total Balance</h2>
          <p>{formatCurrency(getTotalBalance())}</p>
          <div className="trend">
            <i className="fas fa-arrow-up"></i>
            <span>2.5% from last month</span>
          </div>
        </div>

        <div className="account-selector">
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} ({formatAccountNumber(accountNumber)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <i className="fas fa-home"></i> Overview
        </button>
        <button
          className={`tab-button ${activeTab === "accounts" ? "active" : ""}`}
          onClick={() => setActiveTab("accounts")}
        >
          <i className="fas fa-wallet"></i> Accounts
        </button>
        <button
          className={`tab-button ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          <i className="fas fa-chart-line"></i> Analytics
        </button>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {activeTab === "overview" && (
          <>
            {/* Quick Actions */}
            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="action-buttons">
                <button onClick={() => handleQuickAction("transfer")}>
                  <i className="fas fa-exchange-alt"></i>
                  <span>Transfer</span>
                </button>
                <button onClick={() => handleQuickAction("pay")}>
                  <i className="fas fa-money-bill-wave"></i>
                  <span>Pay Bills</span>
                </button>
                <button onClick={() => handleQuickAction("deposit")}>
                  <i className="fas fa-piggy-bank"></i>
                  <span>Deposit</span>
                </button>
                <button onClick={() => handleQuickAction("card")}>
                  <i className="fas fa-credit-card"></i>
                  <span>Card Services</span>
                </button>
              </div>
            </div>

            {/* Accounts Overview */}
            <div className="accounts-overview">
              <h2>Your Accounts</h2>
              <div className="account-cards">
                {accounts.map((account) => (
                  <div key={account.id} className="account-card">
                    <div className="account-header">
                      <span className="account-icon">
                        {getAccountIcon(account.type)}
                      </span>
                      <h3>{account.name}</h3>
                    </div>
                    <div className="account-balance">
                      <p>{formatCurrency(account.balance)}</p>
                      <span className="account-number">{account.number}</span>
                    </div>
                    <div className="account-details">
                      <div className="detail">
                        <span>Available</span>
                        <span>{formatCurrency(account.available)}</span>
                      </div>
                      {account.interestRate > 0 && (
                        <div className="detail">
                          <span>APY</span>
                          <span>{account.interestRate}%</span>
                        </div>
                      )}
                    </div>
                    <button
                      className="btn-view-account"
                      onClick={() => navigate(`/accounts/${account.id}`)}
                    >
                      View Account <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="recent-transactions">
              <div className="section-header">
                <h2>Recent Transactions</h2>
                <button
                  className="btn-view-all"
                  onClick={() => navigate("/transactions")}
                >
                  View All <i className="fas fa-chevron-right"></i>
                </button>
              </div>

              <div className="transactions-list">
                {dashboardData.recentTransactions.length > 0 ? (
                  dashboardData.recentTransactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="transaction-item">
                      <div className="transaction-icon">
                        <i
                          className={`fas ${transaction.type === "credit"
                              ? "fa-arrow-down"
                              : "fa-arrow-up"
                            } ${transaction.type}`}
                        ></i>
                      </div>
                      <div className="transaction-details">
                        <h4>{transaction.description}</h4>
                        <p>
                          {formatDate(transaction.date)} • {transaction.account}
                        </p>
                      </div>
                      <div className={`transaction-amount ${transaction.type}`}>
                        {transaction.type === "credit" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-transactions">
                    <i className="fas fa-exchange-alt"></i>
                    <p>No recent transactions found</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "accounts" && (
          <div className="accounts-tab">
            <h2>All Accounts</h2>
            <div className="accounts-list">
              {accounts.map((account) => (
                <div key={account.id} className="account-item">
                  <div className="account-info">
                    <span className="account-icon">
                      {getAccountIcon(account.type)}
                    </span>
                    <div>
                      <h3>{account.name}</h3>
                      <p>{account.number}</p>
                    </div>
                  </div>
                  <div className="account-balance">
                    <p>{formatCurrency(account.balance)}</p>
                    <button
                      className="btn-manage"
                      onClick={() => navigate(`/accounts/${account.id}`)}
                    >
                      Manage <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-open-account">
              <i className="fas fa-plus"></i> Open New Account
            </button>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="analytics-tab">
            <h2>Financial Analytics</h2>
            <div className="analytics-grid">
              <div className="analytics-card spending-breakdown">
                <h3>Spending Breakdown</h3>
                <div className="chart-placeholder">
                  <i className="fas fa-chart-pie"></i>
                  <p>Spending by category visualization</p>
                </div>
              </div>
              <div className="analytics-card income-vs-expenses">
                <h3>Income vs Expenses</h3>
                <div className="chart-placeholder">
                  <i className="fas fa-chart-bar"></i>
                  <p>Monthly comparison chart</p>
                </div>
              </div>
              <div className="analytics-card savings-progress">
                <h3>Savings Progress</h3>
                <div className="chart-placeholder">
                  <i className="fas fa-chart-line"></i>
                  <p>Savings growth over time</p>
                </div>
              </div>
              <div className="analytics-card budget-status">
                <h3>Budget Status</h3>
                <div className="chart-placeholder">
                  <i className="fas fa-wallet"></i>
                  <p>Budget utilization</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upcoming Bills */}
      <div className="upcoming-bills">
        <h2>Upcoming Bills</h2>
        <div className="bills-list">
          <div className="bill-item">
            <div className="bill-info">
              <i className="fas fa-lightbulb"></i>
              <div>
                <h4>Electric Bill</h4>
                <p>Due May 25</p>
              </div>
            </div>
            <div className="bill-amount">
              <p>$128.75</p>
              <button className="btn-pay-now">Pay Now</button>
            </div>
          </div>
          <div className="bill-item">
            <div className="bill-info">
              <i className="fas fa-home"></i>
              <div>
                <h4>Mortgage</h4>
                <p>Due Jun 1</p>
              </div>
            </div>
            <div className="bill-amount">
              <p>$1,250.00</p>
              <button className="btn-pay-now">Pay Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
