import React from 'react';
const LoginPage = React.lazy(() => import('./pages/login'));
const ForgotPasswordPage = React.lazy(() => import('./pages/forgot-password'));
const ResetPasswordPage = React.lazy(() => import('./pages/reset-password'));
const SignupPage = React.lazy(() => import('./pages/signup'));
const ActivatePage = React.lazy(() => import('./pages/activate'));
const InvitedSignUpPage = React.lazy(() => import('./pages/invited-signup'));
const ResendActivatePage = React.lazy(() => import('./pages/resend-activate'));

export const joinRoutes = [
  {
    path: '/login',
    exact: false,
    private: true,
    Component: LoginPage,
  },
  {
    path: '/signup',
    exact: true,
    private: true,
    Component: SignupPage,
  },
  {
    path: '/forgot-password',
    exact: true,
    private: true,
    Component: ForgotPasswordPage,
  },
  {
    path: '/reset-password',
    exact: true,
    private: true,
    Component: ResetPasswordPage,
  },
  {
    path: '/activate',
    exact: true,
    private: true,
    Component: ActivatePage,
  },
  {
    path: '/invite/:inviteId',
    Component: InvitedSignUpPage,
  },
  {
    path: '/resend-activation',
    exact: true,
    Component: ResendActivatePage,
  },
];
