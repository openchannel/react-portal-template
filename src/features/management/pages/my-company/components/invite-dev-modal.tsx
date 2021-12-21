import * as React from 'react';
import { useDispatch } from 'react-redux';
import { update, cloneDeep, merge } from 'lodash';
import { OcFormValues, AppFormField, AppFormModel } from '@openchannel/react-common-components';
import {
  OcInviteModal,
  inviteFormConfig,
} from '@openchannel/react-common-components/dist/ui/common/organisms';

import { useTypedSelector } from '../../../../common/hooks';
import { inviteUser, updateUser } from '../../../../common/store/dev-invites';
import { InviteUserModalProps } from '../types';

const InviteDevModal: React.FC<InviteUserModalProps> = React.memo(
  ({ userData, isOpened, closeModal }) => {
    const dispatch = useDispatch();
    const { listRoles } = useTypedSelector(({ userInvites }) => userInvites);

    const updatedInviteFormConfig = React.useMemo(() => {
      const config: AppFormModel = merge(cloneDeep(inviteFormConfig), { formId: '123' });

      // convert roles to a valid format for the oc-form
      const roleOptions = Object.entries(listRoles).reduce((list, [, name]) => {
        list.push(name);
        return list;
      }, [] as string[]);

      // set options to the 'select role' field
      update(config, 'fields[2].options', () => roleOptions);

      if (userData) {
        // set default value to the each field from the userData
        update(config, 'fields', (fields: AppFormField[]) => {
          return fields.map((f) => ({
            ...f,
            // eslint-disable-next-line
            defaultValue: f.id === 'roles' ? userData[f.id]![0] : (userData as any)[f.id],
          }));
        });
      }

      return config;
    }, [listRoles, userData]);

    const onSubmitInviteUser = React.useCallback(
      async (values: OcFormValues) => {
        // convert selected roles to correct format (['role']) before dispatch
        const roleIds = Object.entries(listRoles).reduce((list, [id, name]) => {
          if ((values.roles || []).includes(name)) {
            list.push(id);
          }
          return list;
        }, [] as string[]);
        // eslint-disable-next-line
        const payload: any = userData ? cloneDeep(userData) : {};
        const formData = {
          name: values.name,
          email: values.email,
          roles: roleIds,
          customData: {
            roles: roleIds,
          },
        };

        // override existed userData
        merge(payload, formData);

        if (userData) {
          // update account user data or invite data
          await dispatch(updateUser(payload, userData.developerInviteId));
        } else {
          // send new invite
          await dispatch(inviteUser(payload));
        }

        closeModal();
      },
      [listRoles, userData, closeModal],
    );

    const modalProps = React.useMemo(() => {
      if (userData?.inviteStatus === 'INVITED') {
        return { modalTitle: 'Edit invite', successButtonText: 'Save' };
      } else if (userData?.inviteStatus === 'ACTIVE') {
        return { modalTitle: 'Edit member', successButtonText: 'Save' };
      }
      return { modalTitle: 'Invite a member', successButtonText: 'Send Invite' };
    }, [userData]);

    return (
      <OcInviteModal
        {...modalProps}
        size="sm"
        buttonPosition="between"
        formConfig={updatedInviteFormConfig}
        isOpened={isOpened}
        onClose={closeModal}
        onSubmit={onSubmitInviteUser}
      />
    );
  },
);

export default InviteDevModal;
