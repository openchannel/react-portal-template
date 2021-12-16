import { ActionTypes } from './action-types';
import {
  FullAppData,
  ChartStatisticFiledModel,
  ChartStatisticDataModel,
  AppTypeModel,
  AppTypeFieldModel,
  AppFormModel,
  ChartStatisticModel,
} from '@openchannel/react-common-components';

export type Action = {
  type: ActionTypes.SET_CHART | ActionTypes.SET_CHILD | ActionTypes.SET_APP_TYPES | ActionTypes.UPDATE_FIELDS;
  payload: {
    data: Array<[number]>;
    periodVal: string;
    fieldLabel: string;
    appVal: string;
    list: FullAppData[];
    curApp?: FullAppData;
    singleAppData?: any;
    selected?:string;
    fields?: AppFormModel | null;
  };
} | {
  type: ActionTypes.SET_APP;
  payload: {
    data: number[][];
    appId: string;
    field: ChartStatisticFiledModel;
    period: ChartStatisticFiledModel;
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

export interface CurrentAppField {
  formId: string,
  fields: AppTypeFieldModel[] | undefined,
};

export interface AppType extends AppTypeModel {
  formId:string;
};
