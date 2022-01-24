import { ButtonVariants } from '@openchannel/react-common-components/dist/ui/common';

export interface ConfirmUserModal {
  isOpened: boolean;
  type: Exclude<ButtonVariants, 'none'>;
  modalTitle: string;
  modalText: string;
  confirmButtonText: string;
  rejectButtonText?: string;
  rejectButtonHide?: boolean;
  submitButton?:boolean;
  toDraft?: boolean;
};