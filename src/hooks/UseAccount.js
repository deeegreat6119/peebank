// hooks/useAccounts.js
import { useState, useEffect } from 'react';
import baseUrl from '../Constants';

export const useAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/v1/auth/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) throw new Error('Failed to fetch accounts');
      
      const data = await response.json();
      const accounts = data.data?.accounts || data.User?.accounts || [];
      setAccounts(accounts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateAccountBalance = (accountId, newBalance) => {
    setAccounts(prevAccounts => 
      prevAccounts.map(account => 
        account.id === accountId 
          ? { ...account, balance: newBalance } 
          : account
      )
    );
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return { accounts, loading, error, fetchAccounts, updateAccountBalance };
};