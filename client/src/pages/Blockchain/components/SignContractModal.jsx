import { Box, Button, Modal, TextField } from '@mui/material';
import { useState, useContext } from 'react';
import { WalletContext } from 'src/app/WalletContext';

/* eslint-disable import/no-extraneous-dependencies */
import employmentContractJSON from '@contracts/EmploymentContract.json';
/* eslint-enable import/no-extraneous-dependencies */

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px',
};

const CONTRACT_ABI = employmentContractJSON.abi;

const SignObjectModal = ({ open, handleClose, rerender, setRerender, contractAddress }) => {
  const { account, web3 } = useContext(WalletContext);
  console.log(account, web3);
  const [address, setAddress] = useState('');

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { value } = e.target;
    setAddress(value);
  };

  const validate = () => {
    setError(address ? '' : 'Address is required');
    return !!address;
  };

  const handleSubmit = async () => {
    if (validate()) {
      const smartContract = new web3.eth.Contract(CONTRACT_ABI, contractAddress);
      await smartContract.methods
        .signContract(address)
        .send({ from: account, gas: 1000000, gasPrice: web3.utils.toWei('10', 'gwei') });
      setAddress('');
      setRerender(!rerender);
      handleClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <h2 id="modal-title">Sign Contract</h2>
        <TextField
          label="Employee Address"
          name="address"
          value={address}
          onChange={handleChange}
          error={!!error}
          helperText={error}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default SignObjectModal;
