# React Client Application for Smart Contract Management

This is a React client application that leverages Material UI for styling and Metamask for authentication. The application serves as a personal dashboard for a service that manages Ethereum smart contracts between employees and employers. Additionally, the client allows interaction with a server to fetch Ethereum coin information and news from the crypto world.

## Features

- **User Authentication:** Secure login using Metamask.
- **Smart Contract Management:** Interface for managing Ethereum smart contracts.
- **Crypto Information:** Fetch and display Ethereum coin data.
- **Crypto News:** Display the latest news from the crypto world.

## Prerequisites

- Node.js (>= 14.x)
- Yarn (>= 1.x)
- Metamask extension installed in your browser

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-repo/react-smart-contract-dashboard.git
cd react-smart-contract-dashboard
```

### Install Dependencies

```bash
yarn install
```

### Environment Variables

Create a `.env` file in the root directory of the project. You can use the provided `.env.example` file as a template:

```bash
cp .env.example .env
```

Edit the `.env` file to include your API base URL:

```env
VITE_API_BASE_URL=https://your-api-base-url.com
```

### Running the Application

To start the development server, run:

```bash
yarn dev
```

This will start the application on `http://localhost:3000`.

### Building for Production

To build the application for production, run:

```bash
yarn build
```

This will create a `dist` directory with the production build of the application.

## Usage

### Authentication with Metamask

The application uses Metamask for user authentication. Ensure that you have the Metamask extension installed in your browser. When you open the application, you will be prompted to connect your Metamask wallet.

### Managing Smart Contracts

Once authenticated, you can navigate to the smart contract management section to create, view, and manage Ethereum smart contracts between employees and employers.

### Fetching Ethereum Information

The application fetches Ethereum coin data and displays it in real-time. You can view the latest price, market cap, and other relevant information.

### Viewing Crypto News

Stay updated with the latest news from the crypto world. The application fetches and displays news articles related to cryptocurrencies.

## Contributing

We welcome contributions to improve this project. Please fork the repository and submit pull requests.
