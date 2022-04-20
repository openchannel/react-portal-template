import * as React from 'react';
import { useDispatch } from 'react-redux';

import { fetchCmsContent } from '../store/cms-content';
import { useTypedSelector } from './useTypedSelector';

export const useCmsData = () => {
  const dispatch = useDispatch();
  const { app, header, home, login, footer } = useTypedSelector(({ cmsContent }) => cmsContent);

  const getCmsData = React.useCallback(() => {
    dispatch(fetchCmsContent());
  }, []);

  return {
    app,
    header,
    home,
    login,
    footer,
    getCmsData,
  };
};
