import { ActionTypes } from './action-types';
import { Action, CmsContent } from './types';

const initialState = {
  isLoading: false,
  isLoaded: false,
  cmsData: {},
  app: {},
  header: {},
  home: {},
  login: {},
  footer: {},
};

export const cmsContentReducer = (state: CmsContent = initialState, action: Action): CmsContent => {
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

    case ActionTypes.SET_CMS_CONTENT: {
      return {
        ...state,
        ...action.payload,
      };
    }

    default:
      return state;
  }
};
