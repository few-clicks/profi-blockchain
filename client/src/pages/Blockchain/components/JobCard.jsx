import { Card, Grid, Button, Typography, CardContent, Box } from '@mui/material';
import { FaUserPlus, FaCheckCircle, FaExclamationTriangle, FaDollarSign } from 'react-icons/fa';
import { WalletContext } from 'src/app/WalletContext';
import { useContext } from 'react';

const JobCard = ({
  title = 'Title',
  description = 'Default description',
  salary,
  isSigned,
  startDate,
  endDate,
  employer,
  employee,
}) => {
  const { account } = useContext(WalletContext);

  const handleSign = () => {
    console.log('Подписать');
  };

  const handleConfirm = () => {
    console.log('Подтвердить');
  };

  const handlePay = () => {
    console.log('Оплатить');
  };

  const handleReport = () => {
    console.log('Репорт');
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
            {title}
          </Typography>
          <Typography variant="h6" component="div" style={{ wordBreak: 'break-word' }}>
            {salary} ETH
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
          {description}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          style={{ marginTop: '10px', wordBreak: 'break-word' }}
        >
          {`${startDate} \u2192 ${endDate}`}
        </Typography>
        <Box display="flex" alignItems="center" style={{ marginTop: '10px' }}>
          <FaCheckCircle color={isSigned ? 'green' : 'red'} />
          <Typography variant="body2" color="text.secondary" style={{ marginLeft: '5px' }}>
            {isSigned ? 'Signed' : 'Unsigned'}
          </Typography>
        </Box>
      </CardContent>
      <Grid container spacing={2} style={{ padding: '10px' }}>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            style={getButtonStyles(isSigned || account !== employer)}
            startIcon={<FaUserPlus style={getIconStyles(isSigned || account !== employer)} />}
            onClick={handleSign}
            disabled={isSigned || account !== employer}
          >
            Sign
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            style={getButtonStyles(!isSigned || account !== employee)}
            startIcon={<FaCheckCircle style={getIconStyles(!isSigned || account !== employee)} />}
            onClick={handleConfirm}
            disabled={!isSigned || account !== employee}
          >
            Confirm
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            style={getButtonStyles(!isSigned || account !== employer)}
            startIcon={<FaDollarSign style={getIconStyles(!isSigned || account !== employer)} />}
            onClick={handlePay}
            disabled={!isSigned || account !== employer}
          >
            Pay
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            color="error"
            style={getReportButtonStyles(!isSigned || account !== employee)}
            startIcon={
              <FaExclamationTriangle style={getIconStyles(!isSigned || account !== employee)} />
            }
            onClick={handleReport}
            disabled={!isSigned || account !== employee}
          >
            Report
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default JobCard;
