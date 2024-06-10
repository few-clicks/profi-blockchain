import React from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';

const ProjectView = () => (
  <Container>
    <Box my={4}>
      <Typography variant="h4" component="h1" gutterBottom>
        DApp for Managing Employment Relationships
      </Typography>
      <Typography variant="body1" paragraph>
        This project is a decentralized application (DApp) designed for creating and managing smart
        contracts that regulate employment relationships between employees and employers. The
        primary goal of this service is to provide a transparent, secure, and efficient way to
        handle employment agreements, ensuring that all parties adhere to the agreed-upon terms.
      </Typography>
      <Typography variant="body1" paragraph>
        The relevance of this service stems from the common issues in traditional employment
        relationships, such as disputes over contract terms, delayed payments, and lack of
        transparency. By leveraging blockchain technology, this DApp ensures that all contract terms
        are immutable and automatically enforced, reducing the risk of disputes and enhancing trust
        between parties.
      </Typography>
      <Typography variant="body1" paragraph>
        The technology stack used in this project includes:
      </Typography>
      <Typography variant="body1" paragraph>
        <Typography variant="body1" component="span" fontWeight="bold">
          React:
        </Typography>{' '}
        The client-side application is built using React, providing a responsive and user-friendly
        interface for interacting with the smart contracts.
      </Typography>
      <Typography variant="body1" paragraph>
        <Typography variant="body1" component="span" fontWeight="bold">
          MetaMask:
        </Typography>{' '}
        User authentication and authorization are handled through MetaMask, a popular Ethereum
        wallet, ensuring secure and seamless interactions with the blockchain.
      </Typography>
      <Typography variant="body1" paragraph>
        <Typography variant="body1" component="span" fontWeight="bold">
          Go:
        </Typography>{' '}
        The server-side application is developed using Go, known for its performance and
        scalability, to handle auxiliary data storage and business logic.
      </Typography>
      <Typography variant="body1" paragraph>
        <Typography variant="body1" component="span" fontWeight="bold">
          CouchDB:
        </Typography>{' '}
        The server uses CouchDB for storing auxiliary information, providing a reliable and scalable
        NoSQL database solution.
      </Typography>
      <Typography variant="body1" paragraph>
        <Typography variant="body1" component="span" fontWeight="bold">
          Node.js:
        </Typography>{' '}
        The API microservice is built with Node.js, enabling efficient parsing of news and
        information about the Ethereum coin.
      </Typography>
      <Typography variant="body1" paragraph>
        <Typography variant="body1" component="span" fontWeight="bold">
          Solidity:
        </Typography>{' '}
        The smart contracts are written in Solidity, the programming language for Ethereum, ensuring
        secure and reliable execution of employment agreements on the blockchain.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Main Components
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6" component="h3">
              Client
            </Typography>
            <Typography variant="body2">
              The client-side application for interacting with the contract through a web browser.
              It provides users with a convenient interface for creating, viewing, and managing
              smart contracts.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6" component="h3">
              API Microservice
            </Typography>
            <Typography variant="body2">
              A microservice for parsing news and information about the Ethereum coin. This
              component ensures up-to-date information on market conditions and news related to
              Ethereum.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6" component="h3">
              Server
            </Typography>
            <Typography variant="body2">
              A server for storing auxiliary information for the smart contract. It is responsible
              for storing data that cannot be directly saved on the blockchain.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6" component="h3">
              Smart Contract
            </Typography>
            <Typography variant="body2">
              The smart contract written in Solidity. This contract defines the terms and rules of
              employment relationships and ensures their execution on the blockchain.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  </Container>
);

export default ProjectView;
