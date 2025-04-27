import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTransferData } from "../../services/transferService";
import { useTransfer } from "../../hooks/useTransfer";
import { useAccounts } from "../../hooks/UseAccount";
import { showToast } from "../../utils/toast";
import "./TransferPage.css";

const TransferPage = () => {
  const [accounts, setAccounts] = useState([]);
  const { updateAccountBalance } = useAccounts();
  const [transferData, setTransferData] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
    description: "",
    externalDetails: {
      accountNumber: "",
      routingNumber: "",
      bankName: "",
    },
    schedule: "now",
    date: "",
    recurring: false,
    frequency: "weekly",
  });
  const [recentTransfers, setRecentTransfers] = useState([]);
  const [loading, setLoading] = useState({
    initial: true,
    submitting: false,
  });
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { executeTransfer } = useTransfer();
  const amountRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    const loadTransferData = async () => {
      try {
        setLoading((prev) => ({ ...prev, initial: true }));
        const response = await fetchTransferData(localStorage.getItem("token"));

        if (response && response.data) {
          setAccounts(response.data.accounts || []);
          setRecentTransfers(response.data.recentTransactions || []);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        if (err.message.includes("token") || err.message.includes("401")) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setErrors((prev) => ({
            ...prev,
            fetchError: "Failed to load transfer data. Please try again.",
          }));
        }
      } finally {
        setLoading((prev) => ({ ...prev, initial: false }));
      }
    };

    loadTransferData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("externalDetails.")) {
      const field = name.split(".")[1];
      setTransferData((prev) => ({
        ...prev,
        externalDetails: {
          ...prev.externalDetails,
          [field]: value,
        },
      }));
    } else {
      setTransferData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    const isExternal = transferData.toAccount === "external";

    // Step 1 validations
    if (currentStep === 1) {
      if (!transferData.fromAccount)
        newErrors.fromAccount = "Please select source account";
      if (!transferData.toAccount)
        newErrors.toAccount = "Please select destination account";

      if (isExternal) {
        if (!transferData.externalDetails.accountNumber) {
          newErrors.externalAccount = "Account number required";
        }
        if (!transferData.externalDetails.routingNumber) {
          newErrors.externalRouting = "Routing number required";
        }
      } else if (transferData.fromAccount === transferData.toAccount) {
        newErrors.toAccount = "Cannot transfer to the same account";
      }
    }

    // Step 2 validations
    if (currentStep === 2) {
      if (!transferData.amount || isNaN(transferData.amount)) {
        newErrors.amount = "Please enter a valid amount";
      } else {
        const selectedAccount = accounts.find(
          (acc) => acc.
            accountNumber === transferData.fromAccount
        );
          if (
            selectedAccount &&
            parseFloat(transferData.amount) > selectedAccount.balance
          ) {
            showToast("Insufficient funds", "error");
            newErrors.amount = "Insufficient funds";
          }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, submitting: true }));

    // Validate all steps before submission
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      setLoading((prev) => ({ ...prev, submitting: false }));
      return;
    }

    try {
      const payload = {
        fromAccount: transferData.fromAccount,
        amount: parseFloat(transferData.amount),
        description: transferData.description,
        ...(transferData.toAccount === "external"
          ? {
            toAccount: transferData.externalDetails,
          }
          : {
            toAccount: transferData.toAccount,
          }),
        schedule: transferData.schedule,
        ...(transferData.schedule === "later" && { date: transferData.date }),
        ...(transferData.recurring && {
          recurring: transferData.recurring,
          frequency: transferData.frequency,
        }),
        userId: localStorage.getItem("userId") 
      };

      const result = await executeTransfer(
        payload,
        localStorage.getItem("token")
      );
      if (result.status === "success") {
        const fromAccount = accounts.find(acc => acc.accountNumber === transferData.fromAccount);
          const toAccount = transferData.toAccount !== "external" 
            ? accounts.find(acc => acc.accountNumber === transferData.toAccount)
            : null;
    
          if (fromAccount) {
            updateAccountBalance(
              fromAccount.id,
              parseFloat(fromAccount.balance) - parseFloat(transferData.amount)
            );
          }

          if (toAccount) {
            updateAccountBalance(
              toAccount.id,
              parseFloat(toAccount.balance) + parseFloat(transferData.amount)
            );
          }

        // setAccounts(updatedAccounts);
        // await updateAccountBalance(transferData.fromAccount, -parseFloat(transferData.amount));
        // await updateAccountBalance(transferData.toAccount, parseFloat(transferData.amount));
        setRecentTransfers(prev => [{
          from: transferData.fromAccount,
          to: transferData.toAccount,
          amount: parseFloat(transferData.amount),
          date: new Date().toISOString(),
          status: 'completed',
          reference: result.data.reference
        }, ...prev]);

        // Verify with server
        try {
          const verification = await fetchTransferData(localStorage.getItem("token"));
          if (verification.data) {
            // If server balances differ, use server values
            const serverFromAccount = verification.data.accounts.find(
              acc => acc.accountNumber === transferData.fromAccount
            );
            const serverToAccount = verification.data.accounts.find(
              acc => acc.accountNumber === transferData.toAccount
            );

            if (serverFromAccount && serverToAccount) {
              setAccounts(prev => prev.map(account => {
                if (account.accountNumber === transferData.fromAccount) {
                  return { ...account, balance: serverFromAccount.balance };
                }
                
                if (account.accountNumber === transferData.toAccount) {
                  return { ...account, balance: serverToAccount.balance };
                }
                return account;
              }));
            }
          }
        } catch (err) {
          console.error("Balance verification failed:", err);
        }

        showToast(`Transfer successful! Reference: ${result.data.reference}`, "success");
        navigate("/transactions");
      } else if (result.status === "error") {
        showToast(`Transfer failed: ${result.data.message}`, "error");
      }
    } catch (error) {
      console.error("Transfer error:", error);
      setErrors((prev) => ({
        ...prev,
        submission: error.message || "Transfer failed. Please try again.",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="transfer-page">
      <div className="transfer-header">
        <h1>Transfer Funds</h1>
        <button className="btn-back" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>

      <div className="transfer-container">
        <div className="transfer-form-container">
          <div className="form-stepper">
            <div className={`step ${step >= 1 ? "active" : ""}`}>
              <div className="step-number">1</div>
              <div className="step-label">Accounts</div>
            </div>
            <div className={`step ${step >= 2 ? "active" : ""}`}>
              <div className="step-number">2</div>
              <div className="step-label">Amount</div>
            </div>
            <div className={`step ${step >= 3 ? "active" : ""}`}>
              <div className="step-number">3</div>
              <div className="step-label">Review</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="form-step">
                <h2>Select Accounts</h2>
                <div className="form-group">
                  <label>From Account</label>
                  <select
                    name="fromAccount"
                    value={transferData.fromAccount}
                    onChange={handleInputChange}
                    className={errors.fromAccount ? "error" : ""}
                  >
                    <option value="">Select account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.number}>
                        {account.name} ({account.number}) -{" "}
                        {formatCurrency(account.balance)}
                      </option>
                    ))}
                  </select>
                  {errors.fromAccount && (
                    <span className="error-message">{errors.fromAccount}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>To Account</label>
                  <select
                    name="toAccount"
                    value={transferData.toAccount}
                    onChange={handleInputChange}
                    className={errors.toAccount ? "error" : ""}
                  >
                    <option value="">Select account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.number}>
                        {account.name} ({account.number})
                      </option>
                    ))}
                    <option value="external">External Bank Account</option>
                  </select>
                  {errors.toAccount && (
                    <span className="error-message">{errors.toAccount}</span>
                  )}
                </div>

                {transferData.toAccount === "external" && (
                  <div className="form-group">
                    <label>External Account Details</label>
                    <input
                      type="text"
                      name="externalDetails.accountNumber"
                      value={transferData.externalDetails.accountNumber}
                      onChange={handleInputChange}
                      placeholder="Account Number"
                      className={errors.externalAccount ? "error" : ""}
                    />
                    <input
                      type="text"
                      name="externalDetails.routingNumber"
                      value={transferData.externalDetails.routingNumber}
                      onChange={handleInputChange}
                      placeholder="Routing Number"
                      className={errors.externalRouting ? "error" : ""}
                    />
                    <input
                      type="text"
                      name="externalDetails.bankName"
                      value={transferData.externalDetails.bankName}
                      onChange={handleInputChange}
                      placeholder="Bank Name"
                    />
                  </div>
                )}

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-next"
                    onClick={handleNext}
                    disabled={
                      !transferData.fromAccount ||
                      !transferData.toAccount ||
                      (transferData.toAccount === "external" &&
                        (!transferData.externalDetails.accountNumber ||
                          !transferData.externalDetails.routingNumber))
                    }
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="form-step">
                <h2>Transfer Amount</h2>
                <div className="form-group">
                  <label>Amount</label>
                  <div className="amount-input-container">
                    <span className="currency-symbol">$</span>
                    <input
                      type="number"
                      name="amount"
                      value={transferData.amount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                      className={errors.amount ? "error" : ""}
                      ref={amountRef}
                    />
                  </div>
                  {errors.amount && (
                    <span className="error-message">{errors.amount}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Description (Optional)</label>
                  <input
                    type="text"
                    name="description"
                    value={transferData.description}
                    onChange={handleInputChange}
                    placeholder="e.g. Rent payment, Savings transfer"
                    ref={descriptionRef}
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-back"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="btn-next"
                    onClick={handleNext}
                    disabled={!transferData.amount || errors.amount}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-step">
                <h2>Review Transfer</h2>
                <div className="review-details">
                  <div className="detail-row">
                    <span className="detail-label">From Account:</span>
                    <span className="detail-value">
                      {
                        accounts.find(
                          (acc) =>
                            acc.accountNumber === transferData.fromAccount
                        )?.name
                      }
                      (
                      {
                        accounts.find(
                          (acc) =>
                            acc.accountNumber === transferData.fromAccount
                        )?.number
                      }
                      )
                    </span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">To Account:</span>
                    <span className="detail-value">
                      {transferData.toAccount === "external"
                        ? "External Bank Account"
                        : accounts.find(
                          (acc) => acc.id === transferData.toAccount
                        )?.name +
                        ` (${accounts.find(
                          (acc) => acc.id === transferData.toAccount
                        )?.number
                        })`}
                    </span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Amount:</span>
                    <span className="detail-value amount">
                      {formatCurrency(transferData.amount)}
                    </span>
                  </div>

                  {transferData.description && (
                    <div className="detail-row">
                      <span className="detail-label">Description:</span>
                      <span className="detail-value">
                        {transferData.description}
                      </span>
                    </div>
                  )}

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-back"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="btn-submit"
                      disabled={loading.submitting}
                    >
                      {loading.submitting
                        ? "Processing..."
                        : "Confirm Transfer"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="recent-transfers-container">
          <h2>Recent Transfers</h2>
          {loading.initial ? (
            <div className="loading-spinner">Loading...</div>
          ) : recentTransfers.length === 0 ? (
            <div className="no-transfers">
              <p>No recent transfers found</p>
            </div>
          ) : (
            <div className="recent-transfers-list">
              {recentTransfers.map((transfer) => (
                <div key={transfer.id} className="transfer-item">
                  <div className="transfer-details">
                    <div className="transfer-accounts">
                      <span className="from-account">{transfer.from}</span>
                      <span className="to-account">{transfer.to}</span>
                    </div>
                    <div className="transfer-meta">
                      <span className="transfer-date">
                        {formatDate(transfer.date)}
                      </span>
                      <span className={`transfer-status ${transfer.status}`}>
                        {transfer.status}
                      </span>
                    </div>
                  </div>
                  <div className="transfer-amount">
                    {formatCurrency(transfer.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransferPage;
