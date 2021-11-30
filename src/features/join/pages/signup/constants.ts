export const ACCOUNT_PREFIX = 'acc--';
export const ORGANIZATION_PREFIX = 'org--';
export const prefixRegex = new RegExp(`(?:${ACCOUNT_PREFIX}|${ORGANIZATION_PREFIX})`, 'g');

export const ACCOUNT_TYPE_REGEX = new RegExp(`(?:${ACCOUNT_PREFIX})`);
export const ORGANIZATION_TYPE_REGEX = new RegExp(`(?:${ORGANIZATION_PREFIX})`);

export const mockConfig = [
  {
    name: 'Default',
    organization: {
      type: 'default',
      typeData: {
        fields: [],
      },
      includeFields: ['name', 'customData.company'],
    },
    account: {
      type: 'default',
      typeData: {
        fields: [],
      },
      includeFields: ['name', 'email'],
    },
    fieldsOrder: ['name', 'email', 'org--name', 'password'],
  },
  {
    name: 'Custom',
    organization: {
      type: 'custom-user-type',
      typeData: {
        fields: [],
      },
      includeFields: ['name', 'customData.about-my-company'],
    },
    account: {
      type: 'custom-account-type',
      typeData: {
        fields: [],
      },
      includeFields: ['name', 'username', 'email', 'customData.about-me'],
    },
  },
];
