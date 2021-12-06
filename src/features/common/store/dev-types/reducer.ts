import { Action, UserTypes } from './types';
import { ActionTypes } from './action-types';

const initialState = {
  configs: [],
  account: {},
  companyForm: null,
  isLoading: false,
};

export const devTypesReducer = (state: UserTypes = initialState, action: Action): UserTypes => {
  switch (action.type) {
    case ActionTypes.GET_DEV_CONFIG: {
      return {
        ...state,
        configs: action.payload.configs,
      };
    }

    case ActionTypes.GET_DEV_ACCOUNT: {
      return {
        ...state,
        account: action.payload.account,
      };
    }

    case ActionTypes.GET_DEV_COMPANY_FORM: {
      return {
        ...state,
        companyForm: action.payload.companyForm,
      };
    }

    case ActionTypes.RESET_DEV_COMPANY_FORM: {
      return {
        ...state,
        companyForm: null,
      };
    }

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

    default:
      return state;
  }
};
