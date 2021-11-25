import * as React from 'react';
import { useDispatch } from 'react-redux';

import { fetchAuthConfig } from '../store/oidc';
import { tryLoginByRefreshToken } from '../store/session';
import { useTypedSelector } from './useTypedSelector';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isLoaded } = useTypedSelector(({ oidc }) => oidc);
  const { isLoading, isExist } = useTypedSelector(({ session }) => session);

  const checkSession = React.useCallback(async () => await dispatch(tryLoginByRefreshToken()), []);
  const getAuthConfig = React.useCallback(async () => await dispatch(fetchAuthConfig()), []);

  return {
    isSessionExist: isExist,
    isSessionLoading: isLoading,
    isConfigLoaded: isLoaded,
    checkSession,
    getAuthConfig,
  };
};
