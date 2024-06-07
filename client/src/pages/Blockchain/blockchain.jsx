import { Helmet } from 'react-helmet-async';

import BlockchainView from './view/blockchain-view';

// ----------------------------------------------------------------------

export default function Blockchain() {
  return (
    <>
      <Helmet>
        <title> Blockchain </title>
      </Helmet>

      <BlockchainView />
    </>
  );
}
