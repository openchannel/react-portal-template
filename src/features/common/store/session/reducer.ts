import { ActionTypes } from './action-types';
import { Action, Session } from './types';

const initialState = {
  isLoading: false,
  isExist: false,
  accessToken: '',
  refreshToken: '',
  userId: '',
};

export const sessionReducer = (state: Session = initialState, action: Action): Session => {
  switch (action.type) {
    case ActionTypes.START_LOADING: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case ActionTypes.FINISH_LOADING: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case ActionTypes.SET: {
      return {
        ...state,
        isExist: true,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    case ActionTypes.SET_USER_ID: {
      return {
        ...state,

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        userId: action.payload,
      };
    }

    case ActionTypes.REMOVE: {
      return { ...initialState };
    }

    default:
      return state;
  }
};
