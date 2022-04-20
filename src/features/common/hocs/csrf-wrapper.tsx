import * as React from 'react';
import { auth } from '@openchannel/react-common-services';

type CsrfWrapper = {
  children: JSX.Element;
};

export const CsrfWrapper: React.FC<CsrfWrapper> = ({ children }) => {
  React.useEffect(() => {
    const fetchCsrf = async () => {
      try {
        await auth.initCsrf();
      } catch (error) {
        console.error('CsrfWrapper fetchCsrf error', error);
      }
    };

    fetchCsrf();
  }, []);

  return children;
};
