import {
  email,
  errorMessages,
  password,
} from '@openchannel/react-common-components/dist/ui/form/lib';
import * as H from 'history';

export const invalidMassageEmail = () => errorMessages.email();
export const validateEmail = () => email();
export const validatePassword = () => password();
export const requiredField = () => errorMessages.required();
export const invalidMassagePassword = () => errorMessages.password();

export interface LocationParams {
  pathname: string;
  search: string;
  hash: string;
  state: string;
}

export const getUserToken = (location: H.Location<LocationParams>) => {
  const paramsString = location.search;
  const searchParams = new URLSearchParams(paramsString);
  return searchParams.get('token');
};
