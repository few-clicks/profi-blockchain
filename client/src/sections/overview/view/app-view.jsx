import { faker } from '@faker-js/faker';
import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import AppTasks from '../app-tasks';
import AppInfoChart from '../app-info-chart';
import AppNewsUpdate from '../app-news-update';
import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import AppWidgetSummary from '../app-widget-summary';
import AppTrafficBySite from '../app-traffic-by-site';
import AppCurrentSubject from '../app-current-subject';
import AppConversionRates from '../app-conversion-rates';

// ----------------------------------------------------------------------

export default function AppView() {
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
    fetch('http://localhost:4000/info')
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
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={4}>
          <AppWidgetSummary
            title="Current Price"
            total={Number(currentPrice)}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={4}>
          <AppWidgetSummary
            title="Market Cap"
            total={Number(marketCap)}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
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
            title="Current Visits"
            chart={{
              series: Object.keys(capitalization)
                .sort((a, b) => b - a)
                .slice(0, 3)
                .map((key) => ({
                  label: key,
                  value: capitalization[key],
                })),
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppConversionRates
            title="Conversion Rates"
            subheader="(+43%) than last year"
            chart={{
              series: Object.keys(capitalization).map((key) => ({
                label: key,
                value: capitalization[key],
              })),
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentSubject
            title="Current Subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppNewsUpdate
            title="News Update"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: faker.person.jobTitle(),
              description: faker.commerce.productDescription(),
              image: `/assets/images/covers/cover_${index + 1}.jpg`,
              postedAt: faker.date.recent(),
            }))}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppOrderTimeline
            title="Order Timeline"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: [
                '1983, orders, $4220',
                '12 Invoices have been paid',
                'Order #37745 from September',
                'New order placed #XF-2356',
                'New order placed #XF-2346',
              ][index],
              type: `order${index + 1}`,
              time: faker.date.past(),
            }))}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTrafficBySite
            title="Traffic by Site"
            list={[
              {
                name: 'FaceBook',
                value: 323234,
                icon: <Iconify icon="eva:facebook-fill" color="#1877F2" width={32} />,
              },
              {
                name: 'Google',
                value: 341212,
                icon: <Iconify icon="eva:google-fill" color="#DF3E30" width={32} />,
              },
              {
                name: 'Linkedin',
                value: 411213,
                icon: <Iconify icon="eva:linkedin-fill" color="#006097" width={32} />,
              },
              {
                name: 'Twitter',
                value: 443232,
                icon: <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={32} />,
              },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppTasks
            title="Tasks"
            list={[
              { id: '1', name: 'Create FireStone Logo' },
              { id: '2', name: 'Add SCSS and JS files if required' },
              { id: '3', name: 'Stakeholder Meeting' },
              { id: '4', name: 'Scoping & Estimations' },
              { id: '5', name: 'Sprint Showcase' },
            ]}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
