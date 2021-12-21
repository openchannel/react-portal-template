import { AccessLevel, PermissionType } from '@openchannel/react-common-services';

import { ConfirmDeleteUserModal, DeveloperAccountGridModel, Page } from './types';

export const myCompanyRoutes = {
  userManagement: '/my-company/user-management',
  companyDetails: '/my-company/company-details',
};

export const page: Page[] = [
  {
    pageId: myCompanyRoutes.companyDetails,
    placeholder: 'Company details',
    permissions: [
      {
        type: PermissionType.ORGANIZATIONS,
        access: [AccessLevel.MODIFY, AccessLevel.READ],
      },
    ],
  },
  {
    pageId: myCompanyRoutes.userManagement,
    placeholder: 'User management',
    permissions: [
      {
        type: PermissionType.ACCOUNTS,
        access: [AccessLevel.MODIFY, AccessLevel.READ],
      },
    ],
  },
];

export const initialConfirmDeleteUserModal: ConfirmDeleteUserModal = {
  isOpened: false,
  type: '',
  modalTitle: '',
  modalText: '',
  confirmButtonText: '',
  rejectButtonText: '',
  userId: '',
  user: {} as DeveloperAccountGridModel,
};
