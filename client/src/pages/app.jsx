import { Helmet } from 'react-helmet-async';

import AppView from 'src/sections/overview/view/app-view';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <AppView />
    </>
  );
}
