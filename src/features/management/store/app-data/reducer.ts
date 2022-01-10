import { get } from 'lodash';
import { FullAppData, ChartStatisticFiledModel, AppTypeModel, AppTypeFieldModel } from '@openchannel/react-common-components';
import { ActionTypes } from './action-types';
import { Action, DataReducer, AppType } from './types';
import { defaultProps } from 'features/management/pages/manage-apps/constants';

const initialState: DataReducer = {
  chart: {
    ...defaultProps.chartData,
    data: {
      labelsY: [],
      labelsX: [],
      tabularLabels: [],
    }
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
  singleAppData: {},
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
      const { data, appId, field, period } = action.payload;
      
      const labelsX: Array<string | number> = [];
      const labelsY: number[] = [];
      const tabularLabels: string[] = [];

      data.forEach((item) => {
        const date = new Date(item[0]);
        const monthTo = date.toLocaleString('default', { month: 'short' });

        if (period.id === 'day') {
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
      return {
        ...state,
        apps: state.apps.map((item) => (appId !== '' ? { ...item, active: appId === item.id }: { ...item } )),
        chart: {
          ...state.chart,
          fields: state.chart.fields.map((f) => ({ ...f, active: field.id === f.id })),
          periods: state.chart.periods.map((p) => ({ ...p, active: period.id === p.id })),
          data: { labelsX, labelsY, tabularLabels },
        },
        count: labelsY.reduce((a: number, b: number) => a + b, 0),
        countText: `Total ${action.payload.field.label}`,
      };
    }

    case ActionTypes.SET_CHILD: {
      const list = state.list.map((parent) => {
        const exist = action.payload.list.filter((child) => parent.appId === child.appId);
        if (exist) {
          return {
            ...parent,
            children: parent.children ? [...parent.children, ...exist] : exist
          }
        }
        return parent;
      });
      return {
        ...state,
        list,
      };
    }
    case ActionTypes.SET_APP_TYPES: {
      const newArrTypes:string[] = [];
      const { curApp } = action.payload;
      let newAppFields:AppType | null = null;

      action.payload.singleAppData.list.forEach((item:AppTypeModel) => {
        if (item.appTypeId === curApp!.type) {  

          newAppFields = {
            ...item,
            formId: item.appTypeId,
            fields: (item.fields || []).map((field: AppTypeFieldModel) => ({
              ...field,
              defaultValue: get(curApp, field.id) || '',
            })),
          };
        };
        newArrTypes.push( item.appTypeId );
      });
      
      return {
        ...state,
        apps: [],
        singleAppData:{
          appFields: newAppFields,
          listApps: action.payload.singleAppData.list,
          selectedType: curApp!.type,
          curAppStatus: curApp!.parent?.status.value === 'suspended' ? curApp.parent.status.value : curApp.status.value,
          appTypes: newArrTypes,
        }
      }
    }
    case ActionTypes.UPDATE_FIELDS: {
      return {
        ...state,
        singleAppData: {
          ...state.singleAppData,
          appFields: action.payload.fields,
          selectedType: action.payload.selected,
        }
      }
    }
    case ActionTypes.SET_VERSION: {
      return {
        ...state,
        singleAppData: {
          ...state.singleAppData,
          newAppVer: action.payload.appVer,
        }
      }
    }
    default:
      return state;
  }
};
