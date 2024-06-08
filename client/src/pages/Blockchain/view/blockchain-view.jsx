import { useEffect, useContext } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { WalletContext } from 'src/app/WalletContext';
import { posts } from 'src/_mock/blog';

/* eslint-disable import/no-extraneous-dependencies */
import employmentContractJSON from '@contracts/EmploymentContract.json';
import employmentContractFactoryJSON from '@contracts/EmploymentContractFactory.json';
/* eslint-enable import/no-extraneous-dependencies */

import Iconify from 'src/components/iconify';

import PostCard from '../components/post-card';
import PostSort from '../components/post-sort';
import PostSearch from '../components/post-search';

// ----------------------------------------------------------------------

const CONTRACT_ADDRESS = employmentContractJSON.networks;
const CONTRACT_ABI = employmentContractJSON.abi;

const CONTRACT_FACTORY_ADDRESS = employmentContractFactoryJSON.networks['5777'].address;
const CONTRACT_FACTORY_ABI = employmentContractFactoryJSON.abi;

console.log('contract address', CONTRACT_ADDRESS);
console.log('contract abi', CONTRACT_ABI);

console.log('contract factory address', CONTRACT_FACTORY_ADDRESS);
console.log('contract factory abi', CONTRACT_FACTORY_ABI);

export default function BlockchainView() {
  const { account, web3 } = useContext(WalletContext);

  const contract = new web3.eth.Contract(CONTRACT_FACTORY_ABI, CONTRACT_FACTORY_ADDRESS);

  const test = async () => {
    const res = await contract.methods.createEmploymentContract(
      web3.utils.toWei('10000000', 'ether'), // salary
      web3.utils.toWei('0.1', 'ether'), // bonus
      web3.utils.toWei('0.05', 'ether'), // vacationPay
      web3.utils.toWei('0.02', 'ether'), // sickLeavePay
      Math.floor(Date.now() / 1000), // startDate
      Math.floor(Date.now() / 1000) + 4 * 60, // endDate
      web3.utils.toWei('0.5', 'ether'), // penalty
      10, // paymentInterval
      '0x977C25AB464BADeB2552F0A0cC7A9d86749aFA73' // reserve address
    );
    // .send({ from: account, gas: 5000000, gasPrice: web3.utils.toWei('10', 'gwei') });

    console.log('was created', res, account);

    const contracts = await contract.methods.getContractsDetails().call();
    console.log('contracts', contracts);
  };

  useEffect(() => {
    test().catch(console.error);
  });

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Blockchain</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          New Card
        </Button>
      </Stack>

      <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
        <PostSearch posts={posts} />
        <PostSort
          options={[
            { value: 'latest', label: 'Latest' },
            { value: 'popular', label: 'Popular' },
            { value: 'oldest', label: 'Oldest' },
          ]}
        />
      </Stack>

      <Grid container spacing={3}>
        {posts.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </Grid>
    </Container>
  );
}
