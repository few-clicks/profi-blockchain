import { Helmet } from 'react-helmet-async';

import NewsView from './news-view';

// ----------------------------------------------------------------------

export default function NewsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <NewsView />
    </>
  );
}
