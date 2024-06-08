import { Helmet } from 'react-helmet-async';

import InfoView from './view/info-view';

// ----------------------------------------------------------------------

export default function InfoPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <InfoView />
    </>
  );
}
