import { OcEditUserFormConfig } from '@openchannel/react-common-components/dist/ui/auth/organisms';

export const formPassword = {
  formId: 'password-form',
  fields: [
    {
      id: 'password',
      label: 'Current Password',
      type: 'password',
      attributes: [],
      defaultValue: '',
    },
    {
      id: 'newPassword',
      label: 'New Password',
      type: 'password',
      attributes: { required: true },
      defaultValue: '',
    },
  ],
};

export const formConfigsWithoutTypeData: OcEditUserFormConfig[] = [
  {
    name: 'Custom',
    account: {
      type: 'custom-account-type',
      typeData: {
        fields: [],
      },
      includeFields: ['name', 'username', 'email', 'customData.about-me'],
    },
    organization: {
      type: '',
      typeData: {
        fields: [],
      },
      includeFields: [],
    },
  },
  {
    name: 'Default',
    account: {
      type: 'default',
      typeData: {
        fields: [],
      },
      includeFields: ['name', 'email'],
    },
    organization: {
      type: '',
      typeData: {
        fields: [],
      },
      includeFields: [],
    },
  },
];
