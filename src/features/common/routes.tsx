import * as React from 'react';

const HomePage = React.lazy(() => import('./pages/home'));
const NotFoundPage = React.lazy(() => import('./pages/not-found'));

export const commonRoutes = [
  {
    path: '/',
    exact: true,
    private: false,
    Component: HomePage,
  },
  {
    path: '*',
    Component: NotFoundPage,
    private: false,
  },
];
