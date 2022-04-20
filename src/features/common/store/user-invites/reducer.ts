import { Action, UserInvites } from './types';
import { ActionTypes } from './action-types';

const initialState: UserInvites = {
  listRoles: {},
  sortQuery: { sortBy: 'name', sortOrder: 1 },
  userProperties: {
    data: {
      pageNumber: 1,
      pages: 1,
      list: [],
      count: 0,
    },
    layout: 'table',
    options: ['DELETE', 'EDIT'],
  },
};

export const userInvitesReducer = (
  state: UserInvites = initialState,
  action: Action,
): UserInvites => {
  switch (action.type) {
    case ActionTypes.SET_LIST_ROLES: {
      return {
        ...state,
        listRoles: action.payload,
      };
    }

    case ActionTypes.SET_SORT_QUERY: {
      return {
        ...state,
        sortQuery: action.payload,
      };
    }

    case ActionTypes.SET_USER_PROPERTIES: {
      return {
        ...state,
        userProperties: action.payload,
      };
    }

    case ActionTypes.RESET_USER_PROPERTIES: {
      return { ...state, userProperties: initialState.userProperties };
    }

    default:
      return state;
  }
};
