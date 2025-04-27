import baseUrl from '../Constants';

export const fetchTransferData = async (token) => {
  const response = await fetch(`${baseUrl}/dashboard`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: "include"
  });

  if (!response.ok) {
    throw new Error('Failed to fetch account data');
  }

  return await response.json();
};

export const createTransfer = async (transferData, token) => {
  try {
    // Improved account ID validation
    const validateAccountId = (id, fieldName) => {
      
      if (!id) throw new Error(`Missing ${fieldName} account`);
      
      try {
        // Handle external account objects
        if (typeof id === 'object' && id.accountNumber) {
          if (!/^\d{8,17}$/.test(id.accountNumber)) {
            throw new Error(`Invalid ${fieldName} account number`);
          }
          return id; // Return full object for external transfers
        }
        
        // Handle string account IDs
        const idStr = String(id).trim();
        const specialCases = ['external', 'cash', 'loan', 'wallet'];
        if (specialCases.includes(idStr.toLowerCase())) {
          return idStr;
        }
        
        // Validate standard account IDs
        const isValid = 
          /^[0-9a-fA-F]{24}$/.test(idStr) ||  // MongoDB
          /^\d+$/.test(idStr) ||              // Numeric
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idStr); // UUID
        
        if (!isValid) {
          throw new Error(`Invalid ${fieldName} account ID. Received: ${JSON.stringify(id)} (type: ${typeof id})`);
        }
        
        return idStr;
      } catch (error) {
        console.error('Account ID Validation Error:', {
          field: fieldName,
          value: id,
          error: error.message
        });
        throw error;
      }
    };

    
    validateAccountId(transferData.toAccount, 'destination');

    // Validate amount
    const amount = parseFloat(transferData.amount);
    if (isNaN(amount) ){
      throw new Error('Invalid transfer amount');
    }
    
    const response = await fetch(`${baseUrl}/transfer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify({
        fromAccount: typeof transferData.fromAccount === 'object' ? transferData.fromAccount.accountNumber : transferData.fromAccount,
        toAccount: typeof transferData.toAccount === 'object' ? transferData.toAccount.accountNumber : transferData.toAccount,
        amount: amount,
        description: transferData.description || '',
        userId: localStorage.getItem('userId') // Add user ID for ownership verification
      })
    });

    // Handle response
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON Response:', text);
      throw new Error(text || 'Invalid server response format');
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      const errorMessage = data.message || 
        (response.status === 400 ? 'Invalid request' :
         response.status === 401 ? 'Authentication failed' :
         response.status === 403 ? 'Unauthorized' :
         response.status === 404 ? 'Account not found' :
         'Transfer failed');
      throw new Error(errorMessage);
    }

    return {
      status: "success",
      data: {
        transferId: data.data?.transferId || data.id,
        reference: data.data?.reference || data.data?.transferId,
        fromAccount: data.data?.fromAccount,
        toAccount: data.data?.toAccount,
        amount: data.data?.amount,
        newBalance: data.data?.newBalance,
        ...(data.data?.timestamp && { timestamp: data.data.timestamp })
      }
    };
  } catch (error) {
    console.error('Transfer Error:', {
      error: error.message,
      transferData: {
        fromAccount: transferData?.fromAccount,
        toAccount: transferData?.toAccount,
        amount: transferData?.amount
      }
    });
    throw error;
  }
};