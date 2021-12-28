import * as React from 'react';

const ProfilePage = React.lazy(() => import('./pages/profile'));
const MyCompanyPage = React.lazy(() => import('./pages/my-company'));
const ManageAppsPage = React.lazy(() => import('./pages/manage-apps'));
const CreateApp = React.lazy(() => import('./pages/create-app'));
const EditApp = React.lazy(() => import('./pages/edit-app'));

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
    exact: true,
    private: true,
    Component: ManageAppsPage,
  },
  {
    path: '/manage-apps/create',
    private: true,
    Component: CreateApp,
  },
  {
    path: '/manage-apps/edit/:appId/:version',
    private: true,
    Component: EditApp,
  },
];
