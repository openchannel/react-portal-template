import { find } from 'lodash';
import { UserAccountGridModel, UserGridActionModel } from '@openchannel/react-common-services';

export const getUserByAction = (userAction: UserGridActionModel, users: UserAccountGridModel[]) => {
  if (users.length === 0) {
    return null;
  } else if (userAction?.inviteId) {
    return find(users, (developer) => developer?.inviteId === userAction.inviteId);
  } else {
    return find(users, (developer) => developer?.userAccountId === userAction.userAccountId);
  }
};
