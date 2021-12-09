import { FullAppData, ChartStatisticFiledModel } from '@openchannel/react-common-components';
import { ActionTypes } from './action-types';
import { Action, DataReducer } from './types';

const initialState: DataReducer = {
  chart: {
    labelsY: [],
    labelsX: [],
    tabularLabels: [],
  },
  count: 0,
  countText: '',
  list: [],
  apps: [
    {
      id: 'allApps',
      label: 'All apps',
      active: true,
    },
  ],
};

export const appDataReducer = (state = initialState, action: Action): DataReducer => {
  switch (action.type) {
    case ActionTypes.SET_CHART: {
      const list: FullAppData[] = [];
      const apps: ChartStatisticFiledModel[] = [initialState.apps[0]];
      action.payload.list.forEach((item: FullAppData) => {
        if (item.status.value === 'approved') {
          apps.push({ id: item.appId, label: item.name, active: false });
        }
        item.status = item.parent && item.parent.status ? item.parent.status : item.status;
        
        list.push(item);
      });
      return {
        ...state,
        list,
        apps,
      };
    }

    case ActionTypes.SET_APP: {
      const labelsX: Array<string | number> = [];
      const labelsY: number[] = [];
      const tabularLabels: string[] = [];

      action.payload.data.forEach((item: number[]) => {
        const date = new Date(item[0]);
        const monthTo = date.toLocaleString('default', { month: 'short' });
        if (action.payload.periodVal === 'day') {
          const dayTo = date.toLocaleString('default', { day: 'numeric' });
          const finalStr = monthTo.concat(' ', dayTo.toString());
          labelsX.push(finalStr);
          tabularLabels!.push(finalStr);
        } else {
          labelsX.push(monthTo);
          tabularLabels!.push(date.toLocaleString('default', { month: 'long' }));
        }

        labelsY.push(item[1]);
      });
      state.apps = state.apps.map((item: ChartStatisticFiledModel) => ({
        ...item,
        active: action.payload.appVal === item.id,
      }));

      return {
        ...state,
        chart: { labelsX, labelsY, tabularLabels },
        count: labelsY.reduce((a: number, b: number) => a + b, 0),
        countText: `Total ${action.payload.fieldLabel}`,
      };
    }
    case ActionTypes.SET_CHILD: {
      const list = state.list.map((parent) => {
        const exist = action.payload.list.find((child) => parent.appId === child.appId);
        if (exist) {
          return {
            ...parent,
            children: parent.children ? [...parent.children, exist] : [exist]
          }
        }
        return parent;
      });
      return {
        ...state,
        list,
      };
    }
    default:
      return state;
  }
};
