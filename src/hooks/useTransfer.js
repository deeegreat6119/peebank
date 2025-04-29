import { useState } from 'react';
import { createTransfer, createDeposit } from '../services/transferService';

export const useTransfer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transferResult, setTransferResult] = useState(null);
  const [depositResult, setDepositResult] = useState(null);
  const [isDepositLoading, setIsDepositLoading] = useState(false);
  const [depositError, setDepositError] = useState(null);

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

  const executeDeposit = async (depositData, token) => {
    setIsDepositLoading(true);
    setDepositError(null);

    try {
      const result = await createDeposit(depositData, token);
      setDepositResult(result);
      return result;
    } catch (err) {
      setDepositError(err.message);
      throw err;
    } finally {
      setIsDepositLoading(false);
    }
  };

  const resetTransfer = () => {
    setError(null);
    setTransferResult(null);
  };

  const resetDeposit = () => {
    setDepositError(null);
    setDepositResult(null);
  };

  return {
    executeTransfer,
    isLoading,
    error,
    transferResult,
    resetTransfer,
    executeDeposit,
    isDepositLoading,
    depositError,
    depositResult,
    resetDeposit
  };
};
