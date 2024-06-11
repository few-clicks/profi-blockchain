import { useEffect, useContext, useState } from 'react';
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

function formatDate(inputDate) {
  const day = String(inputDate.getDate()).padStart(2, '0');
  const month = String(inputDate.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0, поэтому нужно прибавить 1
  const year = inputDate.getFullYear();

  return `${day}.${month}.${year}`;
}

export default function BlockchainView() {
  const { web3, account } = useContext(WalletContext);
  const [rerender, setRerender] = useState(false);
  const [contracts, setContracts] = useState();
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [modalSignOpen, setModalSignOpen] = useState(false);
  const [currentContract, setCurrentContract] = useState();
  const [contractFactory, setContractFactory] = useState(null);

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

  useEffect(() => {
    console.log('OP', web3, account);
    if (web3) {
      const factory = new web3.eth.Contract(CONTRACT_FACTORY_ABI, CONTRACT_FACTORY_ADDRESS);
      setContractFactory(factory);
    }
  }, [web3, account]);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        console.log('TEST', contractFactory);
        const contractsDetails = await contractFactory?.methods.getContractsDetails().call();

        fetch(import.meta.env.VITE_SERVER_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            return response.json();
          })
          .then((contractsFromServer) => {
            const updatedContracts = contractsDetails.map((contract) => {
              const detail = contractsFromServer.find(
                (d) => d.contractId === contract.contractAddress
              );
              if (detail) {
                return {
                  ...contract,
                  title: detail.title,
                  description: detail.description,
                };
              }
              return contract;
            });
            setContracts(updatedContracts);
          })
          .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
            setContracts(contractsDetails);
          });
      } catch (error) {
        console.error('Error fetching contracts:', error);
        navigate('/login');
      }
    };

    if (contractFactory) {
      fetchContracts();
    }
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
                  contract={{
                    contractAddress: contract.contractAddress,
                    title: contract.title || 'No title',
                    description: contract.desctiption || 'No description',
                    salary: Number(contract.salary) / 1e18,
                    isSigned: contract.isSigned,
                    isConfirmed: contract.isConfirmed,
                    penalty: Number(contract.penalty) / 1e18,
                    startDate: formatDate(new Date(Number(contract.startDate) * 1000)),
                    endDate: formatDate(new Date(Number(contract.endDate) * 1000)),
                    employee: contract.employee,
                    employer: contract.employer,
                  }}
                  handleSignOpen={handleSignOpen}
                  setCurrentContract={setCurrentContract}
                  rerender={rerender}
                  setRerender={setRerender}
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
        currentContract={currentContract}
        open={modalSignOpen}
        handleClose={handleSignClose}
        rerender={rerender}
        setRerender={setRerender}
      />
    </>
  );
}
