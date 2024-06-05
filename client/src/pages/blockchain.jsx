import { Helmet } from 'react-helmet-async';

import { BlockchainView } from 'src/sections/blockchain/view';

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
