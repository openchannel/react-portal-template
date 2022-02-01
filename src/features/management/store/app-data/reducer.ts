import { get } from 'lodash';
import { FullAppData, ChartStatisticFiledModel, AppTypeModel, AppTypeFieldModel, AppFormField } from '@openchannel/react-common-components';
import { ActionTypes } from './action-types';
import { Action, DataReducer, AppType, AppTypeSelecton } from './types';
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
      const newArrTypes:AppTypeSelecton[] = [];
      const { curApp } = action.payload;
      let newAppFields:AppType | null = null;
      let typeLabel:AppTypeSelecton | boolean = false;

      action.payload.singleAppData.list.forEach((item:AppTypeModel) => {
        if (item.appTypeId === curApp!.type || action.payload.singleAppData.count === 1) {
          typeLabel = { id: item.appTypeId, label: item.label || ''}
          newAppFields = {
            ...item,
            formId: item.appTypeId,
            fields: (item.fields || []).map((field: AppTypeFieldModel) => ({
              ...field,
              defaultValue: get(curApp, field.id) || '',
            })),
          };
        };
        newArrTypes.push({ id: item.appTypeId, label: item.label || ''});
      });

      return {
        ...state,
        apps: [],
        singleAppData:{
          appFields: newAppFields,
          listApps: action.payload.singleAppData.list,
          selectedType: typeLabel,
          curAppStatus: curApp!.parent?.status?.value === 'suspended' ? curApp.parent.status.value : curApp.status.value,
          appTypes: newArrTypes,
          curApp,
        }
      }
    }
    case ActionTypes.SET_TYPES_ONLY: {
      const newArrTypes:AppTypeSelecton[] = [];
      const typeLabel = action.payload.singleAppData.list[0] ? action.payload.singleAppData.list[0] : null;
      
      action.payload.singleAppData.list.forEach((item:AppTypeModel) => {
        newArrTypes.push({ id: item.appTypeId, label: item.label || ''});
      });
      return {
        ...state,
        singleAppData:{
          ...state.singleAppData,
          appFields: typeLabel,
          listApps: action.payload.singleAppData.list,
          selectedType: typeLabel ? { id: typeLabel.appTypeId, label: typeLabel.label} : 'App Not Found',
          appTypes: newArrTypes,
        }
      }
    }
    case ActionTypes.UPDATE_FIELDS: {
      const typeLabel = state.singleAppData.listApps.find((v:AppTypeModel) => v.appTypeId === action.payload.selected);
      let newFields: AppFormField[] | undefined = action.payload.fields?.fields;
      
      if (state.singleAppData.curApp) {
        newFields = newFields?.map((field) => {
          return {
            ...field,
            ...(get(state.singleAppData.curApp, field.id) && { defaultValue: get(state.singleAppData.curApp, field.id) }),
          }
        });
      }
      
      return {
        ...state,
        singleAppData: {
          ...state.singleAppData,
          appFields: {...action.payload.fields, fields: newFields},
          selectedType: typeLabel ? { id: typeLabel.appTypeId, label: typeLabel.label} : '',
          curApp: action.payload.fields?.fields ? state.singleAppData.curApp : null,
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
