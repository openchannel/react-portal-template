import {
  OcEditUserFormConfig,
  OcEditUserResult,
  TypeFieldModel,
  TypeModel,
} from '@openchannel/react-common-components';
import {
  TypeMapperUtils,
  UserAccount,
  userAccount,
  userAccountTypes,
  users,
  storage,
} from '@openchannel/react-common-services';
import { Dispatch } from 'redux';
import { cloneDeep, keyBy, get, uniqueId } from 'lodash';

import { normalizeError } from '../utils';

import { ActionTypes } from './action-types';
import { defaultFormConfig } from './constants';

const EMPTY_TYPE_RESPONSE = {
  list: [],
  pages: 1,
  count: 0,
  pageNumber: 1,
};

const startLoading = () => ({ type: ActionTypes.START_LOADING });
const finishLoading = () => ({ type: ActionTypes.FINISH_LOADING });
const saveConfig = (configs: OcEditUserFormConfig[]) => ({
  type: ActionTypes.GET_USER_CONFIG,
  payload: { configs },
});
const saveAccount = (account: UserAccount) => ({
  type: ActionTypes.GET_USER_ACCOUNT,
  payload: { account },
});
const saveCompanyForm = (companyForm: TypeModel<TypeFieldModel>) => ({
  type: ActionTypes.GET_USER_COMPANY_FORM,
  payload: { companyForm },
});
const resetCompanyForm = () => ({ type: ActionTypes.RESET_USER_COMPANY_FORM });

const getUserTypes = async (injectOrganizationType: boolean, configs: OcEditUserFormConfig[]) => {
  if (injectOrganizationType) {
    const orgTypesIDs = configs.map((config) => config?.organization?.type).filter((type) => type);
    const searchQuery =
      orgTypesIDs?.length > 0 ? `{'userTypeId':{'$in': ['${orgTypesIDs.join("','")}']}}` : '';

    if (searchQuery) {
      const response = await users.getUserTypes(searchQuery, '', 1, 100);

      return response.data;
    }
  }

  return EMPTY_TYPE_RESPONSE;
};

const getUserAccountTypes = async (injectAccountType: boolean, configs: OcEditUserFormConfig[]) => {
  if (injectAccountType) {
    const accTypesIDs = configs.map((config) => config?.account?.type).filter((type) => type);
    const searchQuery =
      accTypesIDs?.length > 0
        ? `{'userAccountTypeId':{'$in': ['${accTypesIDs.join("','")}']}}`
        : '';

    if (searchQuery) {
      const response = await userAccountTypes.getUserAccountTypes(1, 100, searchQuery);

      return response.data;
    }
  }
  return EMPTY_TYPE_RESPONSE;
};

export const loadUserProfileForm =
  (
    configs: OcEditUserFormConfig[],
    injectOrganizationTypes: boolean,
    injectAccountTypes: boolean,
  ) =>
  async (dispatch: Dispatch) => {
    dispatch(startLoading());

    try {
      const { list: userAccountTypes } = await getUserAccountTypes(injectAccountTypes, configs);
      const { list: organizationTypes } = await getUserTypes(injectOrganizationTypes, configs);

      const isLoggedIn = storage.isUserLoggedIn();
      const account = isLoggedIn ? await getUserAccount() : null;

      const accTypes = keyBy(userAccountTypes, 'userAccountTypeId');
      const orgTypes = keyBy(organizationTypes, 'userTypeId');

      const newConfigs: OcEditUserFormConfig[] = cloneDeep(configs)
        .map((config) => {
          if (injectOrganizationTypes) {
            if (config?.organization?.type) {
              const organizationTypeData = orgTypes[config.organization.type];

              // put organization type
              if (organizationTypeData) {
                config.organization.typeData = organizationTypeData as TypeModel<TypeFieldModel>;
              } else {
                console.error(config.organization.type, ' is not a valid user type');
                return null;
              }
            }
          }

          // put account type
          if (injectAccountTypes) {
            const accountTypeData = accTypes[config.account.type];
            if (accountTypeData) {
              config.account.typeData = accountTypeData as TypeModel<TypeFieldModel>;
            } else {
              console.error(config.account.type, ' is not a valid user account type');
              return null;
            }

            if (isLoggedIn && account) {
              dispatch(saveAccount(account));

              config.account.typeData.fields?.forEach((field) => {
                field.defaultValue = get(account, field.id, '');
              });
            }
          }

          return config;
        })
        .filter(Boolean) as OcEditUserFormConfig[];

      dispatch(saveConfig(newConfigs));
      dispatch(finishLoading());
    } catch (error) {
      dispatch(finishLoading());
      throw error;
    }
  };

export const saveUserData = (accountData: OcEditUserResult) => async (dispatch: Dispatch) => {
  try {
    const { data: savedUser } = await userAccount.updateUserAccount(accountData);
    dispatch(saveAccount(savedUser));
    // eslint-disable-next-line
  } catch (error: any) {
    throw normalizeError(error);
  }
};

export const getUserAccount = async () => {
  const { data: account } = await userAccount.getUserAccount();

  return account;
};

export const getUserCompanyForm = () => async (dispatch: Dispatch) => {
  dispatch(startLoading());

  try {
    const { data: company } = await users.getUserCompany();
    let formConfig: TypeModel<TypeFieldModel>;

    try {
      if (company.type != null) {
        const { data: typeDefinition } = await users.getUserTypeDefinition(company.type);
        formConfig = TypeMapperUtils.createFormConfig(typeDefinition, company);
      } else {
        formConfig = TypeMapperUtils.createFormConfig(defaultFormConfig, company);
      }
    } catch (e) {
      formConfig = TypeMapperUtils.createFormConfig(defaultFormConfig, company);
    }

    // Assign formId as required key for the formJsonData
    // eslint-disable-next-line
    // @ts-ignore
    if (!formConfig.formId) {
      // eslint-disable-next-line
      // @ts-ignore
      formConfig.formId = uniqueId();
    }

    dispatch(saveCompanyForm(formConfig));
    dispatch(finishLoading());
  } catch (error) {
    dispatch(finishLoading());
    throw error;
  }
};

export const clearUserCompanyForm = () => (dispatch: Dispatch) => dispatch(resetCompanyForm());

// eslint-disable-next-line
export const saveUserCompany = (value: any) => async (dispatch: Dispatch) => {
  try {
    const valueForSaving = TypeMapperUtils.buildDataForSaving(value);
    await users.updateUserCompany(valueForSaving);
  } catch (error) {
    throw normalizeError(error);
  }
};
