import isEmpty from 'lodash.isempty';
import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';

import { ErrorResponse } from 'types';

export const isNonEmpty = <T>(value: T) => {
  return !isEmpty(value);
};

export const getSearchParams = (search: string) => {
  const hashes = search.slice(search.indexOf('?') + 1).split('&');
  const params: { [key: string]: string } = {};
  hashes.forEach((hash) => {
    const [key, val] = hash.split('=');
    params[key] = decodeURIComponent(val);
  });
  return params;
};

export const notifyErrorResp = (e: unknown) => {
  const { response } = <ErrorResponse>e;

  if (response?.data === undefined) {
    console.error('Error', e, response, response?.data);
    return;
  }

  const validationErrors = response.data?.['validation-errors'];

  if (response.data?.errors) {
    response.data.errors.forEach((err) => {
      if (err.message) {
        notify.error(err.message);
      }
    });
  } else if (validationErrors != null && validationErrors?.length > 0) {
    validationErrors.forEach((error: { message: string }) => {
      notify.error(error.message);
    });
  }
};

export { isEmpty };
