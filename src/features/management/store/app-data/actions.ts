import { Dispatch } from 'redux';
import { FullAppData, ChartStatisticFiledModel } from '@openchannel/react-common-components';
import { chartService, AppVersionService } from '@openchannel/react-common-services';
import { appsConfig, query } from './constants';
import { ActionTypes } from './action-types';
import { notifyErrorResp } from 'features/common/libs/helpers';

const sortOptionsQueryPattern = {
  created: (order: number) => `{'created': ${order}}`,
  name: (order: number) => `{'name': ${order}}`,
  status: (order: number) => `{'status.value': ${order}, 'parent.status.value': ${order}}`,
};
const sortQuery = sortOptionsQueryPattern.created(-1);

export const setReducer = (
  type: string,
  val: { data: FullAppData; periodVal: string; fieldLabel: string; appVal: string },
) => {
  return { type, payload: val };
};

export const appVersions = () => async (dispatch: Dispatch) => {
  try {
    const { data } = await AppVersionService.getAppsVersions(
      appsConfig.data.pageNumber,
      appsConfig.data.count,
      sortQuery,
      JSON.stringify(query),
    );
    dispatch(setReducer(ActionTypes.SET_CHART, data));
    getAppsChildren(data.list)(dispatch);
      
  } catch (e) {
    notifyErrorResp(e);
  }
};

export const updateChartData =
  (
    period: ChartStatisticFiledModel,
    field: ChartStatisticFiledModel,
    app: ChartStatisticFiledModel,
  ) =>
  async (dispatch: Dispatch) => {
    const dateEnd = new Date();
    const dateStart = chartService.getDateStartByCurrentPeriod(dateEnd, period!);
    const appReq = app!.id !== 'allApps' ? app!.id : '';

    try {
      const { data } = await chartService.getTimeSeries(
        period!.id,
        field!.id,
        dateStart.getTime(),
        dateEnd.getTime(),
        appReq,
      );
      dispatch(
        setReducer(ActionTypes.SET_APP, {
          data,
          periodVal: period!.id,
          fieldLabel: field!.label,
          appVal: app!.id,
        }),
      );
    } catch (e) {
      notifyErrorResp(e);
    }
  };


 export const getAppsChildren = (parentList: FullAppData[]) => async (dispatch: Dispatch) => {
    const parentIds: string[] = parentList.map(parent => parent.appId);
    
    if (parentIds.length > 0) {
        const childQuery = {
            'status.value': {
                $in: ['inReview', 'pending', 'inDevelopment'],
            },
            appId: {
                $in: parentIds,
            },
            'parent.status': {
                $exists: true,
            },
        };

        try {
          const { data } = await AppVersionService.getAppsVersions(
            appsConfig.data.pageNumber,
            appsConfig.data.count,
            sortQuery,
            JSON.stringify(childQuery),
          );
          dispatch(setReducer(ActionTypes.SET_CHILD, data));
        } catch (e) {
          notifyErrorResp(e);
        }
    }

    return parentList;
}
