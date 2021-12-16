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
  };