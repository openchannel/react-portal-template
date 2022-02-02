import { ActionTypes } from './action-types';
import { Action, Oidc } from './types';

const initialState = {
  isLoading: false,
  isLoaded: false,
  isSsoLogin: true,
  isSamlLogin: false,
  userManager: null,
  config: null,
};

export const oidcReducer = (state: Oidc = initialState, action: Action): Oidc => {
  switch (action.type) {
    case ActionTypes.START_LOADING: {
      return {
        ...state,
        isLoaded: false,
        isLoading: true,
      };
    }

    case ActionTypes.FINISH_LOADING: {
      return {
        ...state,
        isLoaded: true,
        isLoading: false,
      };
    }

    case ActionTypes.SET_USER_MANAGER: {
      return {
        ...state,
        userManager: action.payload.userManager,
        isSsoLogin: action.payload.isSsoLogin,
        isSamlLogin: action.payload.isSamlLogin,
        config: action.payload.config,
      };
    }

    default:
      return state;
  }
};
