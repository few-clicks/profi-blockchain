import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Web3 from 'web3';

import { posts } from 'src/_mock/blog';
import employmentContractJSON from 'src/contracts/EmploymentContract.json';
import employmentContractFactoryJSON from 'src/contracts/EmploymentContractFactory.json';

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

console.log('privider', Web3.givenProvider);
const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
const contract = new web3.eth.Contract(CONTRACT_FACTORY_ABI, CONTRACT_FACTORY_ADDRESS);
console.log('contract', contract);

export default function BlockchainView() {
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
