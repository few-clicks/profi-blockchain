import React from 'react';
import { Card, Grid, Button, Typography, CardContent, Box } from '@mui/material';
import { FaUserPlus, FaCheckCircle, FaExclamationTriangle, FaDollarSign } from 'react-icons/fa';

const JobCard = ({ title = 'Title', description, salary, isSigned, date }) => {
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
          Date: {date}
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
            style={getButtonStyles(isSigned)}
            startIcon={<FaUserPlus style={getIconStyles(isSigned)} />}
            onClick={handleSign}
            disabled={isSigned} // Блокируем кнопку, если контракт уже подписан
          >
            Sign
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            style={getButtonStyles(!isSigned)}
            startIcon={<FaCheckCircle style={getIconStyles(!isSigned)} />}
            onClick={handleConfirm}
            disabled={!isSigned} // Блокируем кнопку, если контракт не подписан
          >
            Confirm
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            style={getButtonStyles(!isSigned)}
            startIcon={<FaDollarSign style={getIconStyles(!isSigned)} />}
            onClick={handlePay}
            disabled={!isSigned} // Блокируем кнопку, если контракт не подписан
          >
            Pay
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            color="error"
            style={getReportButtonStyles(!isSigned)}
            startIcon={<FaExclamationTriangle style={getIconStyles(!isSigned)} />}
            onClick={handleReport}
            disabled={!isSigned} // Блокируем кнопку, если контракт не подписан
          >
            Report
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default JobCard;
