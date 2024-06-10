import { Card, Grid, Button, Typography, CardContent, Box } from '@mui/material';
import {
  FaUserPlus,
  FaCheckCircle,
  FaExclamationTriangle,
  FaDollarSign,
  FaPlusCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import { WalletContext } from 'src/app/WalletContext';
import { useContext } from 'react';

/* eslint-disable import/no-extraneous-dependencies */
import employmentContractJSON from '@contracts/EmploymentContract.json';
/* eslint-enable import/no-extraneous-dependencies */

const CONTRACT_ABI = employmentContractJSON.abi;

const JobCard = ({ contract, handleSignOpen, setCurrentContract, rerender, setRerender }) => {
  const { account, web3 } = useContext(WalletContext);
  const smartContract = new web3.eth.Contract(CONTRACT_ABI, contract.contractAddress);

  const handleSign = () => {
    setCurrentContract(contract);
    handleSignOpen(true);
  };

  const handleConfirm = async () => {
    await smartContract.methods.confirmEmployeeSignature().send({
      from: account,
      gas: 1000000,
      gasPrice: web3.utils.toWei('10', 'gwei'),
      value: web3.utils.toWei(String(contract.penalty), 'ether'),
    });
    setRerender(!rerender);
  };

  const handlePay = async () => {
    console.log('Оплатить');
    await smartContract.methods.makePayment().send({
      from: account,
      gas: 1000000,
      gasPrice: web3.utils.toWei('10', 'gwei'),
    });
    setRerender(!rerender);
  };

  const handleReport = () => {
    console.log('Репорт');
  };

  const handleTopUp = async () => {
    console.log('Пополнить');
    await smartContract.methods.fundContract().send({
      from: account,
      gas: 1000000,
      gasPrice: web3.utils.toWei('10', 'gwei'),
      value: web3.utils.toWei('5', 'ether'),
    });
    setRerender(!rerender);
  };

  const handleTerminate = () => {
    console.log('Расторгнуть');
  };

  const getButtonStyles = (disabled) => ({
    backgroundColor: 'white',
    color: disabled ? 'rgba(0, 0, 0, 0.3)' : 'black',
  });

  const getIconStyles = (disabled) => ({
    color: disabled ? 'rgba(0, 0, 0, 0.3)' : 'inherit',
  });

  const getReportButtonStyles = (disabled) => ({
    color: disabled ? 'rgba(0, 0, 0, 0.3)' : 'white',
  });

  return (
    <Card style={{ width: '100%', margin: '20px 0', backgroundColor: 'white' }}>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="div" style={{ wordBreak: 'break-word' }}>
            {contract.title}
          </Typography>
          <Typography variant="h6" component="div" style={{ wordBreak: 'break-word' }}>
            {contract.salary} ETH
          </Typography>
        </Grid>
        <Typography
          variant="body2"
          color="text.secondary"
          style={{
            marginTop: '10px',
            wordBreak: 'break-word',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {contract.description}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          style={{ marginTop: '10px', wordBreak: 'break-word' }}
        >
          {`${contract.startDate} \u2192 ${contract.endDate}`}
        </Typography>
        <Box display="flex" alignItems="center" style={{ marginTop: '10px' }}>
          <Typography variant="body2" color="text.secondary">
            Penalty: {contract.penalty}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" style={{ marginTop: '10px' }}>
          <FaCheckCircle color={contract.isSigned ? 'green' : 'red'} />
          <Typography variant="body2" color="text.secondary" style={{ marginLeft: '5px' }}>
            {contract.isSigned ? 'Signed' : 'Unsigned'}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" style={{ marginTop: '10px' }}>
          <FaCheckCircle color={contract.isConfirmed ? 'green' : 'red'} />
          <Typography variant="body2" color="text.secondary" style={{ marginLeft: '5px' }}>
            {contract.isConfirmed ? 'Confirmed' : 'Not confirmed'}
          </Typography>
        </Box>
      </CardContent>
      <Grid container spacing={2} style={{ padding: '10px' }}>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            style={getButtonStyles(
              contract.isSigned || account.toLowerCase() !== contract.employer.toLowerCase()
            )}
            startIcon={
              <FaUserPlus
                style={getIconStyles(
                  contract.isSigned || account.toLowerCase() !== contract.employer.toLowerCase()
                )}
              />
            }
            onClick={handleSign}
            disabled={
              contract.isSigned || account.toLowerCase() !== contract.employer.toLowerCase()
            }
          >
            Sign
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            style={getButtonStyles(
              !contract.isSigned ||
                contract.isConfirmed ||
                account.toLowerCase() !== contract.employee.toLowerCase()
            )}
            startIcon={
              <FaCheckCircle
                style={getIconStyles(
                  !contract.isSigned ||
                    contract.isConfirmed ||
                    account.toLowerCase() !== contract.employee.toLowerCase()
                )}
              />
            }
            onClick={handleConfirm}
            disabled={
              !contract.isSigned ||
              contract.isConfirmed ||
              account.toLowerCase() !== contract.employee.toLowerCase()
            }
          >
            Confirm
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            style={getButtonStyles(account.toLowerCase() !== contract.employer.toLowerCase())}
            startIcon={
              <FaPlusCircle
                style={getIconStyles(account.toLowerCase() !== contract.employer.toLowerCase())}
              />
            }
            onClick={handleTopUp}
            disabled={account.toLowerCase() !== contract.employer.toLowerCase()}
          >
            Top Up
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            style={getButtonStyles(
              !contract.isSigned ||
                !contract.isConfirmed ||
                account.toLowerCase() !== contract.employer.toLowerCase()
            )}
            startIcon={
              <FaDollarSign
                style={getIconStyles(
                  !contract.isSigned ||
                    !contract.isConfirmed ||
                    account.toLowerCase() !== contract.employer.toLowerCase()
                )}
              />
            }
            onClick={handlePay}
            disabled={
              !contract.isSigned ||
              !contract.isConfirmed ||
              account.toLowerCase() !== contract.employer.toLowerCase()
            }
          >
            Pay
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            color="error"
            style={getReportButtonStyles(
              !contract.isSigned ||
                !contract.isConfirmed ||
                account.toLowerCase() !== contract.employee.toLowerCase()
            )}
            startIcon={
              <FaExclamationTriangle
                style={getIconStyles(
                  !contract.isSigned ||
                    !contract.isConfirmed ||
                    account.toLowerCase() !== contract.employee.toLowerCase()
                )}
              />
            }
            onClick={handleReport}
            disabled={
              !contract.isSigned ||
              !contract.isConfirmed ||
              account.toLowerCase() !== contract.employee.toLowerCase()
            }
          >
            Report
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            color="error"
            style={getReportButtonStyles(!contract.isSigned || !contract.isConfirmed)}
            startIcon={
              <FaTimesCircle style={getIconStyles(!contract.isSigned || !contract.isConfirmed)} />
            }
            onClick={handleTerminate}
            disabled={!contract.isSigned || !contract.isConfirmed}
          >
            Terminate
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default JobCard;
