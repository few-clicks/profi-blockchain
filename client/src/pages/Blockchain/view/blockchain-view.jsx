import { useEffect, useContext, useState, useMemo } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { WalletContext } from 'src/app/WalletContext';

/* eslint-disable import/no-extraneous-dependencies */
import employmentContractJSON from '@contracts/EmploymentContract.json';
import employmentContractFactoryJSON from '@contracts/EmploymentContractFactory.json';
/* eslint-enable import/no-extraneous-dependencies */

import Iconify from 'src/components/iconify';

import PostSort from '../components/post-sort';
import PostSearch from '../components/post-search';
import JobCard from '../components/JobCard';

// ----------------------------------------------------------------------

const CONTRACT_ADDRESS = employmentContractJSON.networks;
const CONTRACT_ABI = employmentContractJSON.abi;

const CONTRACT_FACTORY_ADDRESS = employmentContractFactoryJSON.networks['5777'].address;
const CONTRACT_FACTORY_ABI = employmentContractFactoryJSON.abi;

console.log('smartContract address', CONTRACT_ADDRESS);
console.log('smartContract abi', CONTRACT_ABI);

console.log('smartContract factory address', CONTRACT_FACTORY_ADDRESS);
console.log('smartContract factory abi', CONTRACT_FACTORY_ABI);

const test = [
  {
    title: 'Frontend Developer',
    description: 'Разработка и поддержка пользовательского интерфейса веб-приложений.',
    salary: 0.8,
    isSigned: true,
    date: '2024-06-01',
  },
  {
    title: 'Backend Developer',
    description: 'Создание и поддержка серверной логики и баз данных.',
    salary: 1.2,
    isSigned: false,
    date: '2024-06-05',
  },
];

export default function BlockchainView() {
  const { account, web3 } = useContext(WalletContext);
  const [contracts, setContracts] = useState();

  console.log(account);

  const smartContract = useMemo(
    () => new web3.eth.Contract(CONTRACT_FACTORY_ABI, CONTRACT_FACTORY_ADDRESS),
    [web3]
  );

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const contractsDetails = await smartContract.methods.getContractsDetails().call();
        setContracts(contractsDetails);
      } catch (error) {
        console.error('Error fetching contracts:', error);
      }
    };

    fetchContracts();
  }, [smartContract]);

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Blockchain</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          New Contract
        </Button>
      </Stack>

      <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
        <PostSearch posts={[]} />
        <PostSort
          options={[
            { value: 'latest', label: 'Latest' },
            { value: 'popular', label: 'Popular' },
            { value: 'oldest', label: 'Oldest' },
          ]}
        />
      </Stack>

      <Grid container spacing={2}>
        {contracts &&
          test.map((contract, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <JobCard
                title={contract.title}
                description={contract.description}
                salary={contract.salary}
                isSigned={contract.isSigned}
                date={contract.date}
              />
            </Grid>
          ))}
      </Grid>
    </Container>
  );
}
