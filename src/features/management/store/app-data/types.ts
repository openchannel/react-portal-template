import { ActionTypes } from './action-types';
import {
  FullAppData,
  ChartStatisticFiledModel,
  AppTypeModel,
  AppFormModel,
  ChartStatisticModel,
  OcFormValues,
} from '@openchannel/react-common-components';

export type Action = {
  type: ActionTypes.UPDATE_FIELDS;
  payload: {
    selected:string;
    fields: AppFormModel | null;
  };
} | {
  type: ActionTypes.SET_APP_TYPES;
  payload: {
    curApp: FullAppData;
    singleAppData: AppTypesList;
  };
} | {
  type: ActionTypes.SET_TYPES_ONLY;
  payload: {
    singleAppData: AppTypesList;
  };
} | {
  type: ActionTypes.SET_CHART | ActionTypes.SET_CHILD;
  payload: {
    list: FullAppData[];
  };
} | {
  type: ActionTypes.SET_APP;
  payload: {
    data: number[][];
    appId: string;
    field: ChartStatisticFiledModel;
    period: ChartStatisticFiledModel;
  };
} | {
  type: ActionTypes.SET_VERSION;
  payload: {
    appVer: number;
  };
}

export interface DataReducer {
  count: number;
  countText: string;
  chart: ChartStatisticModel;
  list: FullAppData[];
  apps: ChartStatisticFiledModel[];
  singleAppData: any;
};

export interface AppTypesList {
  list: AppTypeModel[];
  pages: number;
  count: number;
  pageNumber: number;
};

export interface AppType extends AppTypeModel {
  formId:string;
};

export interface ParamToDraftType {
  values: OcFormValues, 
  message: string, 
  appId: string, 
  version: number, 
  selectedType: string, 
  curAppStatus: string, 
  toSubmit: boolean
};

export interface AppTypeSelecton {
  id: string, 
  label: string, 
};