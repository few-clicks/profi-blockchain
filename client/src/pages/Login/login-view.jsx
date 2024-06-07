import LoadingButton from '@mui/lab/LoadingButton';
import { useState } from 'react';

import Web3 from 'web3';

// ----------------------------------------------------------------------

export default function LoginView() {
  const [account, setAccount] = useState('');
  const [web3, setWeb3] = useState(null);
  console.log(web3);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error('User denied account access');
      }
    } else if (window.web3) {
      const web3Instance = new Web3(window.web3.currentProvider);
      setWeb3(web3Instance);
      const accounts = await web3Instance.eth.getAccounts();
      setAccount(accounts[0]);
    } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  };

  const disconnect = () => {
    setAccount('');
    setWeb3(null);
  };

  return (
    <>
      <h1>MetaMask & React</h1>
      {account ? (
        <div>
          <p>Connected account: {account}</p>
          <button type="button" onClick={disconnect}>
            Disconnect
          </button>
        </div>
      ) : (
        <p>Please connect to MetaMask</p>
      )}
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={connectWallet}
      >
        Login
      </LoadingButton>
    </>
  );
}
