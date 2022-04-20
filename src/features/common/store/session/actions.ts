import { Dispatch } from 'redux';
import {
  auth,
  ChangePasswordRequest,
  nativeLogin as native,
  storage,
  UserLoginModel,
  userAccount,
  UserResetPassword,
  OCNativeDefaultSignup,
  OCNativeCustomSignup,
} from '@openchannel/react-common-services';

import { ErrorResponse, RootState } from 'types';
import { notifyErrorResp } from '../../libs/helpers';
import { ActionTypes } from './action-types';
import { normalizeError } from '../utils';
import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';

const startLoading = () => ({ type: ActionTypes.START_LOADING });
const finishLoading = () => ({ type: ActionTypes.FINISH_LOADING });
const setUserId = (payload: string) => ({ type: ActionTypes.SET_USER_ID, payload });

export const setSession = (payload: { accessToken: string; refreshToken: string }) => {
  storage.persist(payload.accessToken, payload.refreshToken);

  return { type: ActionTypes.SET, payload };
};

export const removeSession = () => {
  storage.removeTokens();

  return { type: ActionTypes.REMOVE };
};

export const nativeLogin = (body: UserLoginModel) => async (dispatch: Dispatch) => {
  const response = await native.signIn(body);
  dispatch(setSession(response.data));

  return response.data;
};

export const nativeSignup = (body: OCNativeCustomSignup | OCNativeDefaultSignup) => async () => {
  try {
    await native.signup(body);
  } catch (e) {
    notifyErrorResp(e);
    throw e;
  }
};

export const loginWithSSOTokens =
  (idToken: string, accessToken: string) => async (dispatch: Dispatch) => {
    dispatch(startLoading());

    const { data } = await auth.login({ idToken, accessToken });

    dispatch(setSession(data));
    dispatch(finishLoading());

    return data;
  };

export const tryLoginByRefreshToken = () => async (dispatch: Dispatch) => {
  try {
    const validSession = await auth.tryLoginByRefreshToken();

    if (!validSession) {
      throw 'Refresh token does not exist';
    }

    dispatch(
      setSession({
        accessToken: storage.getAccessToken(),
        refreshToken: storage.getRefreshToken(),
      }),
    );
  } catch (error) {
    dispatch(removeSession());
    throw error;
  }
};

export const logout = () => async (dispatch: Dispatch, getState: () => RootState) => {
  const {
    oidc: { isSsoLogin, userManager, config, isSamlLogin },
  } = getState();

  await auth.logOut();
  dispatch(removeSession());

  if (isSsoLogin) {
    if (!userManager) return;

    await userManager.signoutRedirect();
  } else if (isSamlLogin) {
    window.location.href = config?.singleLogOutUrl;
  }
};

export const changePassword = (body: ChangePasswordRequest) => async (dispatch: Dispatch) => {
  try {
    const response = await native.changePassword({
      ...body,
      jwtRefreshToken: storage.getRefreshToken(),
    });
    const { accessToken, refreshToken } = response.data;
    dispatch(setSession({ accessToken, refreshToken }));
    // eslint-disable-next-line
  } catch (error: any) {
    throw normalizeError(error);
  }
};

export const fetchUserId = () => async (dispatch: Dispatch) => {
  dispatch(startLoading());
  try {
    const { data } = await userAccount.getUserAccount();
    dispatch(setUserId(data.userId));
    dispatch(finishLoading());
  } catch (error) {
    dispatch(finishLoading());
    throw error;
  }
};

export const sendResetCode = (email: string) => async () => {
  try {
    await native.sendResetCode(email);
  } catch (e) {
    notifyErrorResp(e);
    throw e;
  }
};

export const resetPassword = (body: UserResetPassword) => async () => {
  try {
    await native.resetPassword(body);
  } catch (e) {
    notifyErrorResp(e);
    throw e;
  }
};

export const activeUserAccount = (token: string) => async () => {
  await native.activate(token);
};

export const resendActivationCode = (email: string) => async () => {
  try {
    await native.sendActivationCode(email);
    notify.success('Code sent');
  } catch (e) {
    const { response } = <ErrorResponse>e;

    notifyErrorResp(e);

    if (response.data?.code === 'VALIDATION') {
      notify.error(response.data.message);
    }
    throw e;
  }
};
