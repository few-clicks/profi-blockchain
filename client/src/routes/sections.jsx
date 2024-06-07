import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const InfoPage = lazy(() => import('src/pages/Info'));
export const LoginPage = lazy(() => import('src/pages/Login'));
export const NewsPage = lazy(() => import('src/pages/News'));
export const BlockchainPage = lazy(() => import('src/pages/Blockchain'));
export const ProjectPage = lazy(() => import('src/pages/Project'));
export const Page404 = lazy(() => import('src/pages/NotFound'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
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
