import { InviteUserModel, UserTypeFieldModel } from '@openchannel/react-common-services';

export const mapDataToField = (fields: UserTypeFieldModel[], userInviteData: InviteUserModel) => {
  const mappedFields = fields.map((field) => {
    // eslint-disable-next-line
    if (!field.id.includes('customData') && (userInviteData as any)[field.id]) {
      // eslint-disable-next-line
      field.defaultValue = (userInviteData as any)[field.id];
    } else if (field.id.includes('company')) {
      field.defaultValue = userInviteData.customData?.company;
    }
    return field;
  });

  mappedFields.push({
    id: 'password',
    label: 'Password',
    type: 'password',
    attributes: { required: true },
  });

  return mappedFields;
};
