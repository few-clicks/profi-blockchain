import React, { createContext, useState, useEffect } from 'react';
import Web3 from 'web3';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      };

      window.ethereum.request({ method: 'eth_accounts' }).then(handleAccountsChanged);

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
    return null;
  }, []);

  return (
    <WalletContext.Provider value={{ web3, account, setAccount, setWeb3 }}>
      {children}
    </WalletContext.Provider>
  );
};
