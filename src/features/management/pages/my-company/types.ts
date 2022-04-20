import { Permission, UserAccountGridModel } from '@openchannel/react-common-services';
import {
  UserAccount,
  UserAccountInviteStatusTypeModel,
} from '@openchannel/react-common-services/dist/model/api/user.model';

export interface DeveloperAccountGridModel extends UserAccount {
  inviteStatus?: UserAccountInviteStatusTypeModel;
  inviteId?: string;
  inviteToken?: string;
  developerAccountId: string;
  developerId: string;
  developerInviteId: string;
}

export interface UserData extends DeveloperAccountGridModel {
  [index: string]:
    | string
    | string[]
    | number
    | boolean
    | UserAccountInviteStatusTypeModel
    | undefined;
}

export type InviteModalState = { isOpened: boolean; user: DeveloperAccountGridModel | null };

export interface InviteUserModalProps {
  userData: DeveloperAccountGridModel | null;
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
  openInviteModalWithUserData(user: DeveloperAccountGridModel): void;
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
  devInviteId?: string | undefined;
  user: DeveloperAccountGridModel;
}
