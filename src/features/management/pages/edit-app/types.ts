import { ChartStatisticModel } from '@openchannel/react-common-components';
import { ButtonVariants } from '@openchannel/react-common-components/dist/ui/common';

export interface ChartDataType {
  chartData: ChartStatisticModel;
  count: number;
  countText: string;
};

export interface EditPage {
    appId: string,
    version: string,
};

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