import * as React from 'react';

const ProfilePage = React.lazy(() => import('./pages/profile'));
const MyCompanyPage = React.lazy(() => import('./pages/my-company'));
const ManageAppsPage = React.lazy(() => import('./pages/manage-apps'));

export const managementRoutes = [
  {
    path: '/my-profile',
    exact: false,
    private: true,
    Component: ProfilePage,
  },
  {
    path: '/my-company',
    exact: false,
    private: true,
    Component: MyCompanyPage,
  },
  {
    path: '/manage-apps',
    exact: false,
    private: true,
    Component: ManageAppsPage,
  },
];
