import { useEffect, useContext, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { WalletContext } from 'src/app/WalletContext';

/* eslint-disable import/no-extraneous-dependencies */
import employmentContractFactoryJSON from '@contracts/EmploymentContractFactory.json';
/* eslint-enable import/no-extraneous-dependencies */

import Iconify from 'src/components/iconify';

import PostSearch from '../components/post-search';
import JobCard from '../components/JobCard';
import CreateObjectModal from '../components/CreateContractModal';
import SignObjectModal from '../components/SignContractModal';

// ----------------------------------------------------------------------

const CONTRACT_FACTORY_ADDRESS = employmentContractFactoryJSON.networks['5777'].address;
const CONTRACT_FACTORY_ABI = employmentContractFactoryJSON.abi;

console.log('contractFactory factory address', CONTRACT_FACTORY_ADDRESS);
console.log('contractFactory factory abi', CONTRACT_FACTORY_ABI);

function formatDate(inputDate) {
  const day = String(inputDate.getDate()).padStart(2, '0');
  const month = String(inputDate.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0, поэтому нужно прибавить 1
  const year = inputDate.getFullYear();

  return `${day}.${month}.${year}`;
}

export default function BlockchainView() {
  const { web3 } = useContext(WalletContext);
  const [rerender, setRerender] = useState(false);
  const [contracts, setContracts] = useState();
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [modalSignOpen, setModalSignOpen] = useState(false);
  const [currentContractAddress, setCurrentContractAddress] = useState('');

  const navigate = useNavigate();

  const handleCreateOpen = () => {
    setModalCreateOpen(true);
  };
  const handleSignOpen = () => {
    setModalSignOpen(true);
  };

  const handleCreateClose = () => {
    setModalCreateOpen(false);
  };
  const handleSignClose = () => {
    setModalSignOpen(false);
  };

  const contractFactory = useMemo(
    () => web3 && new web3.eth.Contract(CONTRACT_FACTORY_ABI, CONTRACT_FACTORY_ADDRESS),
    [web3]
  );

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const contractsDetails = await contractFactory?.methods.getContractsDetails().call();
        setContracts(contractsDetails);
      } catch (error) {
        console.error('Error fetching contracts:', error);
        navigate('/login');
      }
    };

    fetchContracts();
  }, [contractFactory, navigate, rerender]);

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Blockchain</Typography>

          <Button
            onClick={handleCreateOpen}
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Contract
          </Button>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <PostSearch posts={[]} />
        </Stack>

        <Grid container spacing={2}>
          {contracts &&
            contracts.map((contract, index) => (
              <Grid xs={12} md={6} lg={4} key={index}>
                <JobCard
                  title={contract.title}
                  description={contract.description}
                  salary={Number(contract.salary) / 1e18}
                  isSigned={contract.isSigned}
                  startDate={formatDate(new Date(Number(contract.startDate) * 1000))}
                  endDate={formatDate(new Date(Number(contract.endDate) * 1000))}
                  employee={contract.employee}
                  employer={contract.employer}
                  handleSignOpen={handleSignOpen}
                  contractAddress={contract.contractAddress}
                  setCurrentContractAddress={setCurrentContractAddress}
                />
              </Grid>
            ))}
        </Grid>
      </Container>
      <CreateObjectModal
        open={modalCreateOpen}
        handleClose={handleCreateClose}
        contractFactory={contractFactory}
        rerender={rerender}
        setRerender={setRerender}
      />
      <SignObjectModal
        contractAddress={currentContractAddress}
        open={modalSignOpen}
        handleClose={handleSignClose}
        rerender={rerender}
        setRerender={setRerender}
      />
    </>
  );
}
