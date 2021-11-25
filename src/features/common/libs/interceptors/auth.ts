import { storage, interceptors } from '@openchannel/react-common-services';

import settings from '../../../../settings';

const BASE_URL = settings.PRODUCTION ? settings.API_URL : settings.API_URL_DEVELOPMENT;

interceptors.request.use((request) => {
  const token = storage.getAccessToken();

  if (token && request.baseURL?.startsWith(BASE_URL)) {
    request.headers['Authorization'] = `Bearer ${token}`;
  }

  return request;
});
