import { Dispatch } from 'redux';
import {
  FullAppData,
  ChartStatisticFiledModel,
  AppTypeModel,
  OcFormValues,
} from '@openchannel/react-common-components';
import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { chartService, appVersion, apps, AppTypeService } from '@openchannel/react-common-services';
import { appsConfig, query } from './constants';
import { ActionTypes } from './action-types';
import { notifyErrorResp } from 'features/common/libs/helpers';
import { AppListMenuAction } from '@openchannel/react-common-components/dist/ui/portal/models';
import { AppTypesList, ParamToDraftType } from './types';
import { initialConfirmAppModal } from 'features/management/pages/create-app/constants';
import { ConfirmUserModal } from 'features/management/pages/create-app/types';

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

export const setChartData = (
  data: number[][],
  appId: string,
  field: ChartStatisticFiledModel,
  period: ChartStatisticFiledModel,
) => {
  return { type: ActionTypes.SET_APP, payload: { data, appId, field, period } };
};

export const setAppTypes = (
  type: string,
  val: { singleAppData: AppTypesList; curApp: FullAppData },
) => {
  return { type, payload: val };
};

export const appVersions = () => async (dispatch: Dispatch) => {
  try {
    const { data } = await appVersion.getAppsVersions(
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
    const appReq = app && app!.id !== 'allApps' ? app!.id : '';
    try {
      const { data }: { data: number[][] } = await chartService.getTimeSeries(
        period!.id,
        field!.id,
        dateStart.getTime(),
        dateEnd.getTime(),
        appReq,
      );

      dispatch(setChartData(data, app ? app!.id : '', field, period));
    } catch (e) {
      notifyErrorResp(e);
    }
  };

export const getAppsChildren = (parentList: FullAppData[]) => async (dispatch: Dispatch) => {
  const parentIds: string[] = parentList.map((parent) => parent.appId);

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
      const { data } = await appVersion.getAppsVersions(
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
};

export const handleApp = (appData: AppListMenuAction) => async (dispatch: Dispatch) => {
  try {
    switch (appData.action) {
      case 'DELETE': {
        if (appData.isChild) {
          await appVersion.deleteAppVersion(appData.appId, appData.appVersion);
        } else {
          await apps.deleteApp(appData.appId);
        }

        notify.success('Your app has been deleted');
        break;
      }
      case 'SUBMIT': {
        await apps.publishAppByVersion(appData.appId, {
          version: appData.appVersion,
          autoApprove: false,
        });
        notify.success('Your app has been submitted for approval');
        break;
      }
    }
    appVersions()(dispatch);
  } catch (e) {
    notifyErrorResp(e);
  }
};

export const getAppTypes = (appId: string, version: number) => async (dispatch: Dispatch) => {
  try {
    const { data } = await AppTypeService.getAppTypes(1, 100);
    const curApp = await appVersion.getAppByVersion(appId, version);
    dispatch(setAppTypes(ActionTypes.SET_APP_TYPES, { singleAppData: data, curApp: curApp.data }));
  } catch (e) {
    notifyErrorResp(e);
  }
};

export const getAppTypesOnly = () => async (dispatch: Dispatch) => {
  try {
    const { data } = await AppTypeService.getAppTypes(1, 100);
    dispatch({ type: ActionTypes.SET_TYPES_ONLY, payload: { singleAppData: data } });
  } catch (e) {
    notifyErrorResp(e);
  }
};

export const updateFields =
  (selected: string, fields: AppTypeModel | null) => (dispatch: Dispatch) => {
    dispatch({ type: ActionTypes.UPDATE_FIELDS, payload: { selected, fields } });
  };

export const saveToDraft =
  (
    paramToDraft: ParamToDraftType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formik?: any,
    closeModal?: React.Dispatch<React.SetStateAction<ConfirmUserModal>>,
    goToBack?: () => void,
  ) =>
  async (dispatch: Dispatch) => {
    const { values, message, appId, version, selectedType, curAppStatus, toSubmit } = paramToDraft;
    const newArrTypes: OcFormValues = {};
    const customData: OcFormValues = {};

    for (const prop in values) {
      const fieldName = Object.keys(values).filter((key) => key.includes('name'))[0];
      newArrTypes['name'] = values[fieldName];
      if (prop.includes('customData#')) {
        const toReplace = prop.replace('customData#', '').split('-')[0];
        customData[toReplace] = values[prop];
      } else customData[prop.split('-')[0]] = values[prop];
    }

    newArrTypes.approvalRequired = true;
    newArrTypes.customData = customData;
    newArrTypes.type = selectedType;

    try {
      const { data } = await appVersion.updateAppByVersion(appId, version, { body: newArrTypes });

      if (curAppStatus !== 'pending' && data.version && toSubmit) {
        await apps.publishAppByVersion(appId, {
          version: data.version,
          autoApprove: false,
        });
      }
      dispatch({ type: ActionTypes.SET_VERSION, payload: { appVer: data.version } });
      notify.success(message);
      if (goToBack) {
        goToBack();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      formik.setSubmitting(false);
      const errorName = e.response.data.errors[0].message.toString();
      const fieldName = Object.keys(formik.initialValues).filter((key) => key.includes('name'))[0];
      formik.setFieldError(fieldName, [errorName]);
      if (closeModal) {
        closeModal(initialConfirmAppModal);
      }
    }
  };

export const toDraftAndSubmit =
  (
    values: OcFormValues,
    message: string,
    toSubmit: boolean,
    selectedType: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formik?: any,
    closeModal?: React.Dispatch<React.SetStateAction<ConfirmUserModal>>,
    goToBack?: () => void,
  ) =>
  async () => {
    try {
      const customData: OcFormValues = {};
      for (const prop in values) {
        if (prop.includes('customData#')) {
          const toReplace = prop.replace('customData#', '').split('-')[0];
          customData[toReplace] = values[prop];
        } else customData[prop.split('-')[0]] = values[prop];
      }
      const { data } = await apps.createApp({
        name: customData.name,
        type: selectedType,
        customData: customData,
      });

      if (toSubmit) {
        await apps.publishAppByVersion(data.appId, {
          version: data.version,
          autoApprove: false,
        });
      }
      if (goToBack) {
        goToBack();
      }
      notify.success(message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      formik.setSubmitting(false);
      const errorName = e.response.data.errors[0].message.toString();
      const fieldName = Object.keys(formik.initialValues).filter((key) => key.includes('name'))[0];
      formik.setFieldError(fieldName, [errorName]);
      if (closeModal) {
        closeModal(initialConfirmAppModal);
      }
    }
  };
