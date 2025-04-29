import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAccounts } from "../../hooks/UseAccount";
// import './AccountPage.css';

const AccountsPage = () => {
  const {
    accounts: fetchedAccounts,
    loading,
    error,
    fetchAccounts,
  } = useAccounts();
  const [accounts, setAccounts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadAccounts = async () => {
      await fetchAccounts();
    };
    loadAccounts();
  }, []);

  useEffect(() => {
    if (fetchedAccounts) {
      setAccounts(fetchedAccounts);
    }
  }, [fetchedAccounts]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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

  return (
    <div className="account-page">
      <div className="account-header">
        <h1>Accounts Overview</h1>
        <div className="account-actions">
          <button className="btn-primary" onClick={() => navigate("/sign-up")}>
            <i className="fas fa-plus"></i> Open New Account
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate("/dashboard/transfers")}
          >
            <i className="fas fa-exchange-alt"></i> Transfer Funds
          </button>
        </div>
      </div>

      {loading ? (
        <div class="peebank-loader">
          <div class="peebank-logo">
            <div class="coin coin-1"></div>
            <div class="coin coin-2"></div>
            <div class="coin coin-3"></div>
            <span class="logo-text">Peebank</span>
          </div>
          <p class="loading-text">Securing your transactions...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i> Error loading accounts:{" "}
          {error}
        </div>
      ) : (
        <div className="account-cards-container">
          {accounts.map((account) => (
            <div key={account.id} className="account-card">
              <div className="account-card-header">
                <span className="account-icon">
                  {getAccountIcon(account.type)}
                </span>
                <h3>{account.name}</h3>
                <span className={`account-type ${account.type}`}>
                  {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                </span>
              </div>
              <div className="account-card-body">
                <div className="account-balance">
                  <span>Available Balance</span>
                  <h2>{formatCurrency(account.balance)}</h2>
                </div>
                <div className="account-details">
                  <p>
                    <span>Account Number:</span> •••• ••••{" "}
                    {account.number.slice(-4)}
                  </p>
                  <p>
                    <span>Last Activity:</span>{" "}
                    {new Date(account.lastActivity).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="account-card-footer">
                <Link
                  to={`${location.pathname}/${account.id}`}
                  className="btn-view"
                >
                  View Details <i className="fas fa-chevron-right"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {accounts.length > 0 && accounts[0].recentTransactions && (
        <div className="recent-transactions">
          <h2>Recent Transactions</h2>
          <div className="transactions-list">
            {accounts[0].recentTransactions.slice(0, 2).map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-icon">
                  <i
                    className={`fas ${
                      transaction.type === "credit"
                        ? "fa-arrow-down"
                        : "fa-arrow-up"
                    }`}
                  ></i>
                </div>
                <div className="transaction-details">
                  <h4>{transaction.description}</h4>
                  <p>{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
                <div className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === "credit" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
          <Link to="/dashboard/transactions" className="view-all">
            View All Transactions <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AccountsPage;
