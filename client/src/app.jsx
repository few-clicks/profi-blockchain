/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import { WalletProvider } from './app/WalletContext';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <WalletProvider>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </WalletProvider>
  );
}
