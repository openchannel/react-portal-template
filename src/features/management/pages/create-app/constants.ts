import { ConfirmUserModal } from './types';
  

export const initialConfirmAppModal: ConfirmUserModal = {
    isOpened: false,
    type: 'primary',
    modalTitle: '',
    modalText: '',
    confirmButtonText: '',
    rejectButtonText: 'No, cancel',
    rejectButtonHide: false,
    submitButton: false,
    toDraft: false,
}

  export const submitModal: ConfirmUserModal = {
    isOpened: true,
    type: 'primary',
    modalTitle: 'Submit app',
    modalText: 'Submit this app to the marketplace now?',
    confirmButtonText: 'Yes, submit it',
    rejectButtonHide: false,
    submitButton: true,
    rejectButtonText: 'Save as draft',
    toDraft: true,
  };

  export const cancelModal: ConfirmUserModal = {
    isOpened: true,
    type: 'primary',
    modalTitle: 'Skip unsaved data',
    modalText: 'Unsaved data detected. Want to exit?',
    confirmButtonText: 'Agree',
    rejectButtonText:"Cancel",
    rejectButtonHide: false,
    submitButton: false,
    toDraft: false,
  };
  