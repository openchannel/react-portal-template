import {
  OcEditUserFormConfig,
  OcEditUserResult,
  TypeFieldModel,
  TypeModel,
} from '@openchannel/react-common-components';
import {
  TypeMapperUtils,
  UserAccount,
  developerAccount,
  developerAccountTypes,
  storage,
  developerService,
  DeveloperTypeService,
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
  type: ActionTypes.GET_DEV_CONFIG,
  payload: { configs },
});
const saveAccount = (account: UserAccount) => ({
  type: ActionTypes.GET_DEV_ACCOUNT,
  payload: { account },
});
const saveDevCompanyForm = (companyForm: TypeModel<TypeFieldModel>) => ({
  type: ActionTypes.GET_DEV_COMPANY_FORM,
  payload: { companyForm },
});
const resetDevCompanyForm = () => ({ type: ActionTypes.RESET_DEV_COMPANY_FORM });

const getDevTypes = async (injectOrganizationType: boolean, configs: OcEditUserFormConfig[]) => {
  if (injectOrganizationType) {
    const orgTypesIDs = configs.map((config) => config?.organization?.type).filter((type) => type);
    const searchQuery =
      orgTypesIDs?.length > 0 ? `{'developerTypeId':{'$in': ['${orgTypesIDs.join("','")}']}}` : '';

    if (searchQuery) {
      const response = await developerService.getDeveloper();

      return response.data;
    }
  }

  return EMPTY_TYPE_RESPONSE;
};

const getDevAccountTypes = async (injectAccountType: boolean, configs: OcEditUserFormConfig[]) => {
  if (injectAccountType) {
    const accTypesIDs = configs.map((config) => config?.account?.type).filter((type) => type);
    const searchQuery =
      accTypesIDs?.length > 0
        ? `{'developerAccountTypeId':{'$in': ['${accTypesIDs.join("','")}']}}`
        : '';

    if (searchQuery) {
      const response = await developerAccountTypes.getUserAccountTypes(1, 100, searchQuery);

      return response.data;
    }
  }
  return EMPTY_TYPE_RESPONSE;
};

export const loadDevProfileForm =
  (
    configs: OcEditUserFormConfig[],
    injectOrganizationTypes: boolean,
    injectAccountTypes: boolean,
  ) =>
  async (dispatch: Dispatch) => {
    dispatch(startLoading());

    try {
      const { list: userAccountTypes } = await getDevAccountTypes(injectAccountTypes, configs);
      const { list: organizationTypes } = await getDevTypes(injectOrganizationTypes, configs);

      const isLoggedIn = storage.isUserLoggedIn();
      const account = isLoggedIn ? await getDevAccount() : null;

      const accTypes = keyBy(userAccountTypes, 'developerAccountTypeId');
      const orgTypes = keyBy(organizationTypes, 'developerTypeId');

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

export const saveDevData = (accountData: OcEditUserResult) => async (dispatch: Dispatch) => {
  try {
    const { data: savedUser } = await developerAccount.updateAccountFields(accountData);
    dispatch(saveAccount(savedUser));
    // eslint-disable-next-line
  } catch (error: any) {
    throw normalizeError(error);
  }
};

export const getDevAccount = async () => {
  const { data: account } = await developerAccount.getUserAccount();

  return account;
};

export const getDevCompanyForm = () => async (dispatch: Dispatch) => {
  dispatch(startLoading());

  try {
    const { data: company } = await developerService.getDeveloper();
    let formConfig: TypeModel<TypeFieldModel>;

    try {
      if (company.type != null) {
        const { data: typeDefinition } = await DeveloperTypeService.getDeveloperType(company.type);
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

    dispatch(saveDevCompanyForm(formConfig));
    dispatch(finishLoading());
  } catch (error) {
    dispatch(finishLoading());
    throw error;
  }
};

export const clearDevCompanyForm = () => (dispatch: Dispatch) => dispatch(resetDevCompanyForm());

// eslint-disable-next-line
export const saveDevCompany = async (value: any) => {
  try {
    const valueForSaving = TypeMapperUtils.buildDataForSaving(value);
    await developerService.updateDeveloper(valueForSaving);
  } catch (error) {
    throw normalizeError(error);
  }
};
