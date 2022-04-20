import { DevRoles } from '../utils';
import { ActionTypes } from './action-types';
import { UsersGridParametersModel } from '@openchannel/react-common-services';

export type SortQuery = { sortBy: string; sortOrder: number };

export type DevInvites = {
  listRoles: DevRoles;
  sortQuery: SortQuery;
  userProperties: UsersGridParametersModel;
};

export type Action =
  | {
      type: ActionTypes.SET_LIST_ROLES;
      payload: DevRoles;
    }
  | {
      type: ActionTypes.SET_SORT_QUERY;
      payload: SortQuery;
    }
  | {
      type: ActionTypes.SET_USER_PROPERTIES;
      payload: UsersGridParametersModel;
    }
  | {
      type: ActionTypes.RESET_USER_PROPERTIES;
    };
