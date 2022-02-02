import { Dispatch } from 'redux';
import { UserManager } from 'oidc-client';
import { auth } from '@openchannel/react-common-services';

import { normalizeOIdConfig, ConfigObject } from '../../libs';
import { ActionTypes } from './action-types';

const startLoading = () => ({ type: ActionTypes.START_LOADING });
const finishLoading = () => ({ type: ActionTypes.FINISH_LOADING });

const setUserManager = (config?: ConfigObject, type?: string) => {
  if (!config) {
    return {
      type: ActionTypes.SET_USER_MANAGER,
      payload: { isSsoLogin: false, userManager: null },
    };
  }
  const loginType = type === 'SAML_20' ? false : true;

  return {
    type: ActionTypes.SET_USER_MANAGER,
    payload: {
      isSsoLogin: loginType,
      isSamlLogin: !loginType,
      userManager: new UserManager(normalizeOIdConfig(config)),
      config,
    },
  };
};

export const fetchAuthConfig = () => async (dispatch: Dispatch) => {
  dispatch(startLoading());

  try {
    const { data } = await auth.getAuthConfig();

    dispatch(setUserManager(data as ConfigObject, data.type));
    dispatch(finishLoading());
  } catch (error) {
    dispatch(setUserManager());
    dispatch(finishLoading());

    throw error;
  }
};
