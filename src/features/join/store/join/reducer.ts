import { Action, JoinState } from './types';
import { ActionTypes } from './action-types';

const initialState: JoinState = {
  userInviteData: null,
};

export const joinReducer = (state: JoinState = initialState, action: Action): JoinState => {
  switch (action.type) {
    case ActionTypes.SET_USER_INVITES_DATA: {
      return {
        ...state,
        userInviteData: action.payload,
      };
    }

    default:
      return state;
  }
};
