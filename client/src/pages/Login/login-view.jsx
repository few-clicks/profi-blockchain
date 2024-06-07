import LoadingButton from '@mui/lab/LoadingButton';
import { Box } from '@mui/material';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletContext } from 'src/app/WalletContext';

import Web3 from 'web3';

// ----------------------------------------------------------------------

export default function LoginView() {
  const { setAccount, setWeb3 } = useContext(WalletContext);
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        navigate('/');
      } catch (error) {
        console.error('User denied account access');
      }
    } else if (window.web3) {
      const web3Instance = new Web3(window.web3.currentProvider);
      setWeb3(web3Instance);
      const accounts = await web3Instance.eth.getAccounts();
      setAccount(accounts[0]);
      navigate('/');
    } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      textAlign="center"
    >
      <LoadingButton
        fullWidth
        size="large"
        variant="contained"
        color="inherit"
        onClick={connectWallet}
        sx={{ maxWidth: 300 }}
      >
        Login with MetaMask
      </LoadingButton>
    </Box>
  );
}
