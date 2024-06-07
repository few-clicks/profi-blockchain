import LoadingButton from '@mui/lab/LoadingButton';
import { useState, useEffect } from 'react';

import { useRouter } from 'src/routes/hooks';
import Web3 from 'web3';

// ----------------------------------------------------------------------

export default function LoginView() {
  const router = useRouter();
  const [account, setAccount] = useState('');
  const [web3, setWeb3] = useState(null);
  console.log(web3);

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      window.ethereum.enable().then((accounts) => {
        setAccount(accounts[0]);
      });
    } else if (window.web3) {
      const web3Instance = new Web3(window.web3.currentProvider);
      setWeb3(web3Instance);
      web3Instance.eth.getAccounts().then((accounts) => {
        setAccount(accounts[0]);
      });
    } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }, []);

  const disconnect = () => {
    setAccount('');
    setWeb3(null);
  };

  const handleClick = () => {
    router.push('/dashboard');
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
        onClick={handleClick}
      >
        Login
      </LoadingButton>
    </>
  );
}
