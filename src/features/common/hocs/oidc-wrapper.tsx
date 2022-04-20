import * as React from 'react';
import { useDispatch } from 'react-redux';

import { useTypedSelector } from '../hooks';
import { fetchAuthConfig } from '../store/oidc';
import { AuthWrapper } from './auth-wrapper';

export const OidcWrapper: React.FC = ({ children }) => {
  const dispatch = useDispatch();
  const { isLoaded, isLoading } = useTypedSelector((state) => state.oidc);

  React.useEffect(() => {
    if (!isLoaded && !isLoading) {
      dispatch(fetchAuthConfig());
    }
  }, []);

  if (!isLoaded || isLoading) {
    return <div>Open ID Loading</div>;
  }

  return <AuthWrapper>{children}</AuthWrapper>;
};
