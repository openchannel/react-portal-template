import { ActionTypes } from './action-types';

export interface Session {
  isLoading: boolean;
  isExist: boolean;
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export type Action =
  | {
      type: ActionTypes.START_LOADING;
    }
  | {
      type: ActionTypes.FINISH_LOADING;
    }
  | {
      type: ActionTypes.SET;
      payload: {
        accessToken: string;
        refreshToken: string;
      };
    }
  | {
      type: ActionTypes.REMOVE;
    }
  | {
      type: ActionTypes.SET_USER_ID;
      payload: string;
    };
