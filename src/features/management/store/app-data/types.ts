import { ActionTypes } from './action-types';
import {
  FullAppData,
  ChartStatisticFiledModel,
  ChartStatisticDataModel,
} from '@openchannel/react-common-components';

export interface Action {
  type: ActionTypes.SET_CHART | ActionTypes.SET_APP;
  payload: {
    data: Array<[number]>;
    periodVal: string;
    fieldLabel: string;
    appVal: string;
    list: FullAppData[];
  };
}

export interface DataReducer {
  count: number;
  countText: string;
  chart: ChartStatisticDataModel;
  list: FullAppData[];
  apps: ChartStatisticFiledModel[];
}
