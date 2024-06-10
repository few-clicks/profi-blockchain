import { Box, Button, Modal, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState, useContext } from 'react';
import { WalletContext } from 'src/app/WalletContext';

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

const CreateObjectModal = ({ open, handleClose, contractFactory, rerender, setRerender }) => {
  const { account, web3 } = useContext(WalletContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    salary: '',
    startDate: null,
    endDate: null,
    paymentInterval: '',
    penalty: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const validate = () => {
    const tempErrors = {};
    tempErrors.title = formData.title ? '' : 'Title is required';
    tempErrors.description = formData.description ? '' : 'Description is required';
    tempErrors.salary =
      formData.salary && !Number.isNaN(Number(formData.salary)) ? '' : 'Valid salary is required';
    tempErrors.startDate = formData.startDate ? '' : 'Start date is required';
    tempErrors.endDate = formData.endDate ? '' : 'End date is required';
    tempErrors.paymentInterval = formData.paymentInterval ? '' : 'Payment interval is required';
    tempErrors.penalty =
      formData.penalty && !Number.isNaN(Number(formData.penalty))
        ? ''
        : 'Valid penalty is required';

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');
  };

  const handleSubmit = async () => {
    if (validate()) {
      await contractFactory.methods
        .createEmploymentContract(
          web3.utils.toWei(String(formData.salary), 'ether'), // salary
          web3.utils.toWei('0.1', 'ether'), // bonus
          web3.utils.toWei('0.05', 'ether'), // vacationPay
          web3.utils.toWei('0.02', 'ether'), // sickLeavePay
          Math.floor(formData.startDate.unix()), // startDate
          Math.floor(formData.endDate.unix()), // endDate
          web3.utils.toWei(String(formData.penalty), 'ether'), // penalty
          formData.paymentInterval
        )
        .send({ from: account, gas: 5000000, gasPrice: web3.utils.toWei('10', 'gwei') });
      setFormData({
        title: '',
        description: '',
        salary: '',
        startDate: null,
        endDate: null,
        paymentInterval: '',
        penalty: '',
      });
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
        <h2 id="modal-title">Create Contract</h2>
        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={!!errors.description}
          helperText={errors.description}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Salary (ETH)"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          error={!!errors.salary}
          helperText={errors.salary}
          fullWidth
          margin="normal"
          type="number"
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
            <DatePicker
              label="Start Date"
              value={formData.startDate}
              onChange={(date) => handleDateChange('startDate', date)}
              renderInput={(params) => (
                <TextField {...params} margin="normal" sx={{ flex: 1, mr: 1 }} />
              )}
            />
            <DatePicker
              label="End Date"
              value={formData.endDate}
              onChange={(date) => handleDateChange('endDate', date)}
              renderInput={(params) => (
                <TextField {...params} margin="normal" sx={{ flex: 1, ml: 1 }} />
              )}
            />
          </Box>
        </LocalizationProvider>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          <TextField
            label="Payment Interval"
            name="paymentInterval"
            value={formData.paymentInterval}
            onChange={handleChange}
            error={!!errors.paymentInterval}
            helperText={errors.paymentInterval}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            label="Penalty"
            name="penalty"
            value={formData.penalty}
            onChange={handleChange}
            error={!!errors.penalty}
            helperText={errors.penalty}
            fullWidth
            margin="normal"
            type="number"
          />
        </Box>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default CreateObjectModal;
