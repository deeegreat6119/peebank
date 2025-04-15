import { useState } from 'react';
import { createTransfer } from '../services/transferService';

export const useTransfer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transferResult, setTransferResult] = useState(null);

  const executeTransfer = async (transferData, token) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await createTransfer(transferData, token);
      setTransferResult(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetTransfer = () => {
    setError(null);
    setTransferResult(null);
  };

  return {
    executeTransfer,
    isLoading,
    error,
    transferResult,
    resetTransfer
  };
};
