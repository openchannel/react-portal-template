import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';
import {
  auth,
  axiosRequest,
  interceptors,
  storage,
  InterceptorError,
} from '@openchannel/react-common-services';

import { store } from '../../../../store';
import { setSession, removeSession } from '../../store/session/actions';

let isRefreshing = false;
let skipByErrorCode: number[] = [];

const process401Error = async <T>(config: T) => {
  console.log('process401Error');

  if (!isRefreshing) {
    isRefreshing = true;

    try {
      const {
        data: { accessToken, refreshToken },
      } = await auth.refreshToken({ refreshToken: storage.getRefreshToken() });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      store.dispatch(setSession({ accessToken, refreshToken }));
      isRefreshing = false;

      return axiosRequest(config);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      store.dispatch(removeSession());
      isRefreshing = false;

      window.location.replace('/login');
    }
  } else {
    return axiosRequest(config);
  }
};

const isCsrfError = ({ response }: InterceptorError) => {
  return response?.status === 403 && response?.data?.toLowerCase()?.includes('csrf');
};

const reInitCSRF = async <T>(config: T) => {
  await auth.initCsrf();

  return axiosRequest(config);
};

const processError = (response: InterceptorError['response']) => {
  if (!response) return null;

  let errorMessages: string[];
  const { data, status } = response;

  if (data.errors?.length > 0) {
    errorMessages = data.errors.map(
      ({ message }: { message: string }) => `Error Code: ${data.status}\nMessage: ${message}`,
    );
  } else if (data.error?.message) {
    errorMessages = [`Error Code: ${data.status}\nMessage: ${response.data.message}`];
  } else if (status === 403) {
    errorMessages = [`Error Code: ${status}\nYou are not authorized to perform this action`];
  } else {
    errorMessages = [`Error Code: ${status}\nMessage: ${data.message}`];
  }

  skipByErrorCode = [];

  errorMessages.forEach((message) => {
    notify.error(message);
  });
};

// eslint-disable-next-line
const errorHandler = (error: InterceptorError): Promise<any> | InterceptorError => {
  const data = error.response?.data;
  const config = error.response?.config;
  const status = error.response?.status;

  if (isCsrfError(error)) {
    return reInitCSRF<typeof config>(config);
  }

  if (status === 401 && !config?.url?.includes('refresh')) {
    return process401Error<typeof config>(config);
  }

  if (data?.['validation-errors'] || (data?.errors?.length >= 1 && data?.errors[0]?.field)) {
    throw error;
  }

  const shouldShowToast = !skipByErrorCode.includes(status || 0);
  if (shouldShowToast) {
    processError(error.response);
  }

  throw error;
};

interceptors.request.use((request) => {
  const errorHeader = request.headers['x-handle-error'];
  skipByErrorCode = errorHeader ? errorHeader.split(',').map(Number) : [];
  delete request.headers['x-handle-error'];

  return request;
});

interceptors.response.use((response) => response, errorHandler);
