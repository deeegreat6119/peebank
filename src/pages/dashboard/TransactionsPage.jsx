import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import baseUrl from '../../Constants';
// import './TransactionPage.css';

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    dateRange: '30days',
    amountRange: 'all',
    searchQuery: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call to fetch transactions
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/transactions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        
        const { data } = await response.json();
        // Transform data to include type (credit/debit) for filtering
        const transactions = data.map(txn => ({
          ...txn,
          type: txn.amount >= 0 ? 'credit' : 'debit',
          category: 'Transfer' // Default category since API doesn't provide it
        }));
        setTransactions(transactions);
        setFilteredTransactions(transactions);
      } catch (error) {
        if (error.message.includes('token') || error.message.includes('401')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    // Apply filters whenever filters change
    let results = [...transactions];

    // Filter by transaction type
    if (filters.type !== 'all') {
      results = results.filter(txn => txn.type === filters.type);
    }

    // Filter by date range
    const now = new Date();
    if (filters.dateRange === '7days') {
      const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
      results = results.filter(txn => new Date(txn.date) >= sevenDaysAgo);
    } else if (filters.dateRange === '30days') {
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      results = results.filter(txn => new Date(txn.date) >= thirtyDaysAgo);
    }

    // Filter by amount range
    if (filters.amountRange === 'small') {
      results = results.filter(txn => txn.amount < 100);
    } else if (filters.amountRange === 'medium') {
      results = results.filter(txn => txn.amount >= 100 && txn.amount < 500);
    } else if (filters.amountRange === 'large') {
      results = results.filter(txn => txn.amount >= 500);
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      results = results.filter(txn => 
        txn.description.toLowerCase().includes(query) ||
        txn.merchant.toLowerCase().includes(query) ||
        txn.category.toLowerCase().includes(query)
      );
    }

    setFilteredTransactions(results);
  }, [filters, transactions]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const closeTransactionDetails = () => {
    setSelectedTransaction(null);
  };

  const handleExport = () => {
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(txn => 
        [
          `"${formatDate(txn.date)}"`,
          `"${txn.description}"`,
          `"${txn.category}"`,
          txn.type === 'credit' ? txn.amount : -txn.amount,
          `"${txn.status}"`
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `transactions_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="transaction-page">
      <div className="transaction-header">
        <h1>Transaction History</h1>
        <div className="header-actions">
          <button className="btn-export" onClick={handleExport}>
            <i className="fas fa-download"></i> Export
          </button>
          <button className="btn-new-transfer" onClick={() => navigate('/transfer')}>
            <i className="fas fa-exchange-alt"></i> New Transfer
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="transaction-filters">
        <div className="filter-group">
          <label>Transaction Type</label>
          <select name="type" value={filters.type} onChange={handleFilterChange}>
            <option value="all">All Transactions</option>
            <option value="credit">Income</option>
            <option value="debit">Expenses</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Date Range</label>
          <select name="dateRange" value={filters.dateRange} onChange={handleFilterChange}>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Amount Range</label>
          <select name="amountRange" value={filters.amountRange} onChange={handleFilterChange}>
            <option value="all">All Amounts</option>
            <option value="small">Small (&lt; $100)</option>
            <option value="medium">Medium ($100 - $500)</option>
            <option value="large">Large (&gt; $500)</option>
          </select>
        </div>

        <div className="filter-group search-group">
          <label>Search</label>
          <input
            type="text"
            name="searchQuery"
            placeholder="Search transactions..."
            value={filters.searchQuery}
            onChange={handleFilterChange}
          />
          <i className="fas fa-search"></i>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i> Loading transactions...
        </div>
      ) : (
        <>
          <div className="transaction-summary">
            <div className="summary-card">
              <h3>Total Transactions</h3>
              <p>{filteredTransactions.length}</p>
            </div>
            <div className="summary-card">
              <h3>Total Income</h3>
              <p className="credit">
                {formatCurrency(
                  filteredTransactions
                    .filter(txn => txn.type === 'credit')
                    .reduce((sum, txn) => sum + txn.amount, 0)
                )}
              </p>
            </div>
            <div className="summary-card">
              <h3>Total Expenses</h3>
              <p className="debit">
                {formatCurrency(
                  filteredTransactions
                    .filter(txn => txn.type === 'debit')
                    .reduce((sum, txn) => sum + txn.amount, 0)
                )}
              </p>
            </div>
          </div>

          {/* Transactions List */}
          <div className="transactions-list">
            <div className="list-header">
              <div className="header-date">Date</div>
              <div className="header-description">Description</div>
              <div className="header-category">Category</div>
              <div className="header-amount">Amount</div>
              <div className="header-status">Status</div>
            </div>

            {filteredTransactions.length === 0 ? (
              <div className="no-results">
                <i className="fas fa-search"></i>
                <p>No transactions found matching your criteria</p>
              </div>
            ) : (
              filteredTransactions.map(transaction => (
                <div 
                  key={transaction.id} 
                  className={`transaction-item ${transaction.status}`}
                  onClick={() => handleTransactionClick(transaction)}
                >
                  <div className="transaction-date">
                    <div className="date">{formatDate(transaction.date)}</div>
                    <div className="time">{formatTime(transaction.date)}</div>
                  </div>
                  <div className="transaction-description">
                    <div className="merchant">{transaction.merchant}</div>
                    <div className="account">{transaction.account}</div>
                  </div>
                  <div className="transaction-category">
                    <span className={`category-badge ${transaction.category.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}>
                      {transaction.category}
                    </span>
                  </div>
                  <div className="transaction-amount">
                    {transaction.type === 'credit' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </div>
                  <div className="transaction-status">
                    <span className={`status-badge ${transaction.status}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="transaction-modal">
          <div className="modal-content">
            <button className="close-modal" onClick={closeTransactionDetails}>
              <i className="fas fa-times"></i>
            </button>
            
            <h2>Transaction Details</h2>
            
            <div className="detail-row">
              <span className="detail-label">Transaction ID:</span>
              <span className="detail-value">{selectedTransaction.id}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Date & Time:</span>
              <span className="detail-value">
                {formatDate(selectedTransaction.date)} at {formatTime(selectedTransaction.date)}
              </span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Description:</span>
              <span className="detail-value">{selectedTransaction.description}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Merchant:</span>
              <span className="detail-value">{selectedTransaction.merchant}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Category:</span>
              <span className="detail-value">
                <span className={`category-badge ${selectedTransaction.category.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}>
                  {selectedTransaction.category}
                </span>
              </span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Account:</span>
              <span className="detail-value">{selectedTransaction.account}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Amount:</span>
              <span className={`detail-value amount ${selectedTransaction.type}`}>
                {selectedTransaction.type === 'credit' ? '+' : '-'}
                {formatCurrency(selectedTransaction.amount)}
              </span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className={`detail-value status ${selectedTransaction.status}`}>
                {selectedTransaction.status}
              </span>
            </div>
            
            <div className="modal-actions">
              <button className="btn-dispute">
                <i className="fas fa-flag"></i> Dispute Transaction
              </button>
              <button className="btn-receipt">
                <i className="fas fa-receipt"></i> View Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionPage;
