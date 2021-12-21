import { find } from 'lodash';
import { DeveloperAccountGridModel } from './types';

export const getUserByAction = (
  userAction: DeveloperAccountGridModel,
  users: DeveloperAccountGridModel[],
) => {
  if (users.length === 0) {
    return null;
  } else if (userAction?.inviteId) {
    // eslint-disable-next-line
    return find(users, (developer: any) => developer?.developerInviteId === userAction.inviteId);
  } else {
    return find(users, (developer) => developer?.userAccountId === userAction.userAccountId);
  }
};
