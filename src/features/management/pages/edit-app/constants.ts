import {
    ChartStatisticDataModel,
    ChartLayoutTypeModel,
  } from '@openchannel/react-common-components/dist/ui/portal/organisms';
import { ConfirmUserModal } from './types';
  
export const chartPeriod: ChartStatisticDataModel = {
  labelsY: [],
  labelsX: [],
  tabularLabels: [],
};

export const defaultProps = {
chartData: {
    layout: ChartLayoutTypeModel.standard,
    data: chartPeriod,
    periods: [
    {
        id: 'month',
        label: 'Monthly',
        active: true,
        tabularLabel: 'Month',
    },
    {
        id: 'day',
        label: 'Daily',
        tabularLabel: 'Day',
    },
    ],
    fields: [
    {
        id: 'downloads',
        label: 'Downloads',
        active: true,
    },
    {
        id: 'reviews',
        label: 'Reviews',
    },
    {
        id: 'leads',
        label: 'Leads',
    },
    {
        id: 'views',
        label: 'Views',
    },
    ],
},
count: 0,
countText: '',
};

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

export const submitModalPending: ConfirmUserModal = {
    isOpened: true,
    type: 'primary',
    modalTitle: 'Submit app',
    modalText: 'Submit this app to the marketplace now?',
    confirmButtonText: 'Yes, submit it',
    rejectButtonHide: true,
    submitButton: true,
    toDraft: false,
  };

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
  