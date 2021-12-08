import {
  ChartStatisticDataModel,
  ChartLayoutTypeModel,
} from '@openchannel/react-common-components/dist/ui/portal/organisms';

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
    apps: [
      {
        id: 'allApps',
        label: 'All apps',
        active: true,
      },
    ],
  },
  count: 0,
  countText: '',
};

export const appsConfig = {
  layout: 'table',
  data: {
    pages: 30,
    pageNumber: 1,
    list: [],
    count: 30,
  },
  options: ['Edit', 'Preview', 'Submit', 'Delete'],
};
