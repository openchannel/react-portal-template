import { Permission, UserAccountGridModel } from '@openchannel/react-common-services';
import { UserAccountInviteStatusTypeModel } from '@openchannel/react-common-services/dist/model/api/user.model';

export interface UserData extends UserAccountGridModel {
  [index: string]: string | string[] | number | boolean | UserAccountInviteStatusTypeModel | undefined;
}

export type InviteModalState = { isOpened: boolean; user: UserAccountGridModel | null };

export interface InviteUserModalProps {
  userData: UserAccountGridModel | null;
  isOpened: boolean;
  closeModal(): void;
}

export interface Page {
  pageId: string;
  placeholder: string;
  permissions: Permission[];
}

export interface UserManagementProps {
  inviteModal: InviteModalState;
  openInviteModalWithUserData(user: UserAccountGridModel): void;
  closeInviteModal(): void;
}

export interface ConfirmDeleteUserModal {
  isOpened: boolean;
  type: string;
  modalTitle: string;
  modalText: string;
  confirmButtonText: string;
  rejectButtonText?: string;
  userId: string | undefined;
  user: UserAccountGridModel;
}
