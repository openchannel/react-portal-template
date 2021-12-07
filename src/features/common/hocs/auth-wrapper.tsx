import * as React from 'react';
import { User } from 'oidc-client';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { joinRoutes } from 'features/join';

import { useAuth, useTypedSelector } from '../hooks';
import { loginWithSSOTokens } from '../store/session';

export const AuthWrapper: React.FC = ({ children }) => {
  const [isAuthWithOidcLoading, setAuthWithOidcLoading] = React.useState(false);
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isSessionLoading, checkSession } = useAuth();
  const {
    isLoading: isOidcLoading,
    userManager,
    isSsoLogin,
  } = useTypedSelector((state) => state.oidc);

  // create session on oidc response
  const loginWithOidcTokens = React.useCallback(
    async ({ id_token, access_token }: User) => {
      try {
        await dispatch(loginWithSSOTokens(id_token, access_token));
        history.replace('/');
      } catch (e) {
        console.error('e', e);
        setAuthWithOidcLoading(false);
      }
    },
    [history.replace],
  );

  // process response after redirect from okta
  const processResponse = React.useCallback(async () => {
    if (!userManager) return;

    const response = await userManager.signinRedirectCallback(location.hash);
    await loginWithOidcTokens(response);
  }, [userManager, loginWithOidcTokens, location.hash]);

  // try creating session with oidc
  const authWithOidc = async () => {
    if (!userManager) return;

    try {
      if (!location.hash) {
        await userManager.signinRedirect();
      } else {
        await processResponse();
      }
    } catch (e) {
      console.error('auth with oidc Error: ', e);
      setAuthWithOidcLoading(false);
      history.replace('/login');
    }
  };

  const checkAuthType = async () => {
    if (!userManager || !isSsoLogin) {
      return;
    }

    setAuthWithOidcLoading(true);
    await authWithOidc();
  };

  React.useEffect(() => {
    const init = async () => {
      const joinPaths = joinRoutes.map(({ path }) => path);

      try {
        await checkSession();

        if (joinPaths.includes(location.pathname as never)) {
          history.replace('/');
        }
      } catch {
        if (joinPaths.includes(location.pathname as never)) {
          await checkAuthType();
        } else {
          history.replace(`/login?return=${location.pathname}`);
        }
      }
    };

    init();
  }, []);

  if (isSessionLoading || isOidcLoading || isAuthWithOidcLoading) {
    return <div>Authentication...</div>;
  }

  return children as React.ReactElement;
};
