import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';
import {
  InviteUserModel,
  userAccountTypes,
  userInvites,
  nativeLogin,
  SignUpByInviteRequest,
  storage,
} from '@openchannel/react-common-services';

import { GetState, TypedDispatch } from 'types';
import { logout } from 'features/common/store/session';
import { notifyErrorResp } from 'features/common/libs/helpers';
import { mapDataToField } from '../../utils';

import { ActionTypes } from './action-types';

export const setUserInviteData = (payload: InviteUserModel) => ({
  type: ActionTypes.SET_USER_INVITES_DATA,
  payload,
});

const getUserAccountFormType = async (userInviteData: InviteUserModel) => {
  if (userInviteData.type) {
    try {
      const { data } = await userAccountTypes.getUserAccountType(userInviteData.type);

      return {
        ...data,
        fields: mapDataToField(data.fields, userInviteData),
      };
    } catch {
      console.error("Can't load UserAccountType");
      // return config which is presented bellow
    }
  }

  return {
    fields: [
      {
        id: 'name',
        label: 'Name',
        type: 'text',
        attributes: { required: false },
        defaultValue: userInviteData?.name,
      },
      {
        id: 'email',
        label: 'Email',
        type: 'emailAddress',
        attributes: { required: true },
        defaultValue: userInviteData?.email,
      },
      {
        id: 'password',
        label: 'Password',
        type: 'password',
        attributes: { required: true },
      },
    ],
  };
};

export const getUserInviteInfoByToken = (token: string) => async (dispatch: TypedDispatch) => {
  try {
    const { data } = await userInvites.getDeveloperInviteInfoByToken(token);

    dispatch(setUserInviteData(data));

    const formConfig = await getUserAccountFormType(data);

    return {
      isExpired: data.expireDate ? new Date(data.expireDate) < new Date() : false,
      formConfig: {
        name: 'sign-up',
        account: {
          type: 'account-type',
          typeData: formConfig,
        },
      },
    };
  } catch {
    return {
      redirect: true,
    };
  }
};

export const sendInvite =
  (payload: SignUpByInviteRequest) => async (dispatch: TypedDispatch, getState: GetState) => {
    const { userInviteData } = getState().join;

    try {
      await nativeLogin.signupByInvite({
        userCustomData: payload,
        inviteToken: userInviteData!.token!,
      });

      if (storage.isUserLoggedIn()) {
        // remove existed session. issue - AT-1082
        await dispatch(logout());
      }
    } catch (e) {
      notifyErrorResp(e);
      throw e;
    }
  };

export const sendActivationCode = (email: string) => async () => {
  try {
    await nativeLogin.sendActivationCode(email);

    notify.success('Activation email was sent to your inbox!');
  } catch (e) {
    notifyErrorResp(e);
    throw e;
  }
};
