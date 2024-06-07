import React, { useState, createContext } from 'react';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState('');
  const [web3, setWeb3] = useState(null);

  return (
    <WalletContext.Provider value={{ account, setAccount, web3, setWeb3 }}>
      {children}
    </WalletContext.Provider>
  );
};
