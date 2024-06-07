import { lazy, Suspense, useContext } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import { WalletContext } from 'src/app/WalletContext';

import DashboardLayout from 'src/layouts/dashboard';

export const InfoPage = lazy(() => import('src/pages/Info'));
export const LoginPage = lazy(() => import('src/pages/Login'));
export const NewsPage = lazy(() => import('src/pages/News'));
export const BlockchainPage = lazy(() => import('src/pages/Blockchain'));
export const ProjectPage = lazy(() => import('src/pages/Project'));
export const Page404 = lazy(() => import('src/pages/NotFound'));

// ----------------------------------------------------------------------

const PrivateRoute = ({ children }) => {
  const { account } = useContext(WalletContext);
  return account ? children : <Navigate to="/login" />;
};

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <PrivateRoute>
          <DashboardLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </PrivateRoute>
      ),
      children: [
        { element: <ProjectPage />, index: true },
        { path: 'news', element: <NewsPage /> },
        { path: 'info', element: <InfoPage /> },
        { path: 'blockchain', element: <BlockchainPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
