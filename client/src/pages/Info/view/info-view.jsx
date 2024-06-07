import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import AppInfoChart from '../components/app-info-chart';
import AppCurrentVisits from '../components/app-current-visits';
import AppWidgetSummary from '../components/app-widget-summary';
import AppConversionRates from '../components/app-conversion-rates';

// ----------------------------------------------------------------------

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export default function InfoView() {
  const [currentPrice, setCurrentPrice] = useState(0);
  const [marketCap, setMarketCap] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);

  const [maxPrice, setMaxPrice] = useState(0);
  const [minPrice, setMinPrice] = useState(0);

  const [dates, setDates] = useState([]);
  const [prices, setPrices] = useState([]);
  const [marketCaps, setMarketCaps] = useState([]);
  const [totalVolumes, setTotalVolumes] = useState([]);

  const [capitalization, setCapitalization] = useState({});

  useEffect(() => {
    fetch(`${apiUrl}/info`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setCurrentPrice(data?.crypto?.currentPrice);
        setMarketCap(data?.crypto?.marketCap);
        setTotalVolume(data?.crypto?.totalVolume);
        setMaxPrice(data?.crypto?.dailyMax);
        setMinPrice(data?.crypto?.dailyMin);

        setDates(data?.dates);
        setPrices(data?.prices);
        setMarketCaps(data?.marketCaps);
        setTotalVolumes(data?.totalVolumes);

        setCapitalization(data?.capitalization);
      })
      .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Ethereum Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={4}>
          <AppWidgetSummary
            title="Current Price"
            total={Number(currentPrice)}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={4}>
          <AppWidgetSummary
            title="Market Cap"
            total={Number(marketCap)}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={4}>
          <AppWidgetSummary
            title="Total Value"
            total={Number(totalVolume)}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={6}>
          <AppWidgetSummary title="Maximum (24h)" total={Number(maxPrice)} color="error" />
        </Grid>
        <Grid xs={6}>
          <AppWidgetSummary title="Minimum (24h)" total={Number(minPrice)} color="error" />
        </Grid>

        <Grid xs={12}>
          <AppInfoChart
            title="Prices"
            subheader="Ethereum"
            chart={{
              labels: dates,
              series: [
                {
                  name: 'Price',
                  type: 'line',
                  fill: 'solid',
                  data: prices,
                },
              ],
            }}
          />
        </Grid>
        <Grid xs={12}>
          <AppInfoChart
            title="Total volume"
            subheader="Ethereum"
            chart={{
              labels: dates,
              series: [
                {
                  name: 'Total volume',
                  type: 'column',
                  fill: 'solid',
                  data: totalVolumes,
                },
              ],
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={8}>
          <AppInfoChart
            title="Market cap"
            subheader="Ethereum"
            chart={{
              labels: dates,
              series: [
                {
                  name: 'Market cap',
                  type: 'area',
                  fill: 'gradient',
                  data: marketCaps,
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Top by Capitalization"
            chart={{
              series: Object.keys(capitalization)
                .sort((a, b) => b - a)
                .slice(0, 4)
                .map((key) => ({
                  label: key,
                  value: capitalization[key],
                })),
            }}
          />
        </Grid>

        <Grid xs={12}>
          <AppConversionRates
            title="Capitalization Rates"
            subheader="cryptocurrencies"
            chart={{
              series: Object.keys(capitalization).map((key) => ({
                label: key,
                value: capitalization[key],
              })),
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
