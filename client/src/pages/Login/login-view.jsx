import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletContext } from 'src/app/WalletContext';
import Web3 from 'web3';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Typography } from '@mui/material';
import { shortenAddress } from 'src/utils/format-address';

// ----------------------------------------------------------------------

export default function LoginView() {
  const { setAccount, setWeb3, account } = useContext(WalletContext);
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

  const switchAccount = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        });
        setAccount(accounts[0].caveats[0].value[0]);
      } catch (error) {
        console.error('User denied account access or switching');
      }
    } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  };

  useEffect(() => {}, [setAccount, navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      gap={1}
      textAlign="center"
    >
      {account && (
        <>
          <Typography variant="h1" component="div">
            👋
          </Typography>
          <Typography variant="body1" component="div">
            {shortenAddress(account)}
          </Typography>
        </>
      )}
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
      <Button
        fullWidth
        size="large"
        variant="outlined"
        onClick={switchAccount}
        sx={{
          maxWidth: 300,
        }}
      >
        Switch Account
      </Button>
    </Box>
  );
}
