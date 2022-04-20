import { OcEditUserTypeConfig } from '@openchannel/react-common-components/dist/ui/auth/organisms/oc-edit-user-form/types';
import { cloneDeep, merge } from 'lodash';

import { OcEditUserFormConfig } from '@openchannel/react-common-components/dist/ui/auth/organisms';

import { ORGANIZATION_PREFIX, ACCOUNT_PREFIX } from './constants';

const addFieldPrefix = {
  account: (str: string) => `${ACCOUNT_PREFIX}${str}`,
  organization: (str: string) => `${ORGANIZATION_PREFIX}${str}`,
};

const mapConfig = (
  config: OcEditUserTypeConfig | undefined,
  addPrefixFn: (s: string) => string,
) => {
  const mappedConfig = cloneDeep(config);

  merge(mappedConfig, {
    includeFields: (config?.includeFields || []).map(addPrefixFn),
    typeData: {
      fields: (config?.typeData.fields || []).map((f) => ({ ...f, id: addPrefixFn(f.id) })),
    },
  });

  return mappedConfig as OcEditUserTypeConfig;
};

export const prefixedConfigs = (configs: OcEditUserFormConfig[]): OcEditUserFormConfig[] =>
  configs.length > 0
    ? configs.map((config) => ({
        ...config,
        account: mapConfig(config.account, addFieldPrefix.account),
        organization: config.organization
          ? mapConfig(config.organization, addFieldPrefix.organization)
          : undefined,
        fieldsOrder: (config.fieldsOrder || []).map((fo) =>
          fo.includes(`${ORGANIZATION_PREFIX}`) ? addFieldPrefix.account(fo) : fo,
        ),
      }))
    : [];
