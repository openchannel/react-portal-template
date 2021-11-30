import { ActionTypes } from './action-types';
import { OcEditUserFormConfig, OcEditUserResult } from '@openchannel/react-common-components';
import { TypeFieldModel, TypeModel } from '@openchannel/react-common-services';

export interface UserTypes {
  configs: OcEditUserFormConfig[];
  account: OcEditUserResult;
  companyForm: TypeModel<TypeFieldModel> | null;
  isLoading: boolean;
}

export type Action =
  | {
      type: ActionTypes.GET_USER_CONFIG;
      payload: {
        configs: OcEditUserFormConfig[];
      };
    }
  | {
      type: ActionTypes.GET_USER_ACCOUNT;
      payload: {
        account: OcEditUserResult;
      };
    }
  | {
      type: ActionTypes.GET_USER_COMPANY_FORM;
      payload: {
        companyForm: TypeModel<TypeFieldModel>;
      };
    }
  | {
      type: ActionTypes.RESET_USER_COMPANY_FORM;
    }
  | {
      type: ActionTypes.START_LOADING;
    }
  | {
      type: ActionTypes.FINISH_LOADING;
    };
