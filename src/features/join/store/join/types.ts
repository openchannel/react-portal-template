import { InviteUserModel } from '@openchannel/react-common-services';

import { ActionTypes } from './action-types';

export type JoinState = {
  userInviteData: InviteUserModel | null;
};

export type Action = {
  type: ActionTypes.SET_USER_INVITES_DATA;
  payload: InviteUserModel;
};
