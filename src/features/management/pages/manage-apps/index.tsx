import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { MainTemplate } from 'features/common/templates';
import { OcNavigationBreadcrumbs } from '@openchannel/react-common-components/dist/ui/common/molecules';
import { OcAppTable } from '@openchannel/react-common-components/dist/ui/portal/organisms';
import { OcConfirmationModalComponent } from '@openchannel/react-common-components/dist/ui/common/organisms';
import { AppListMenuAction } from '@openchannel/react-common-components/dist/ui/portal/models';
import {
  ChartOptionsChange,
  OcChartComponent,
} from '@openchannel/react-common-components/dist/ui/portal/organisms';
import { defaultProps, appsConfig, initialConfirmAppModal, initialModalData } from './constants';
import { appVersions, updateChartData, handleApp } from '../../store/app-data';
import { useTypedSelector } from 'features/common/hooks';
import { ChartDataType, ConfirmUserModal } from './types';
import './styles.scss';

const ManageApp = (): JSX.Element => {
  const appData = useTypedSelector(({ appData }) => appData);
  const history = useHistory();
  const dispatch = useDispatch();
  const onClickPass = React.useCallback(() => {
    history.push('/manage-apps/create');
  }, []);

  const [chartState, setChartState] = React.useState<ChartDataType>(defaultProps);
  const [state, setState] = React.useState<ConfirmUserModal>(initialConfirmAppModal);
  const [modalAppData, setModalAppData] = React.useState<AppListMenuAction>(initialModalData);

  React.useEffect(() => {
    const period = chartState.chartData.periods.find((v) => v.active);
    const field = chartState.chartData.fields.find((v) => v.active);
    const app = chartState.chartData.apps!.find((v) => v.active);

    dispatch(appVersions());
    dispatch(updateChartData(period!, field!, app!));
  }, []);

  React.useEffect(() => {
    const allChartData: ChartDataType = {
      ...chartState,
      chartData: { ...chartState.chartData, apps: appData.apps, data: appData.chart.data },
      count: appData.count,
      countText: appData.countText,
    };

    setChartState(allChartData);
  }, [appData]);

  const allAppsData = {
    ...appsConfig,
    data: { ...appsConfig.data, list: appData.list },
  };

  const changeChartOptions = React.useCallback(
    ({ period, field, app }: ChartOptionsChange) => {
      const newChartDat = { ...chartState };

      newChartDat.chartData.fields = chartState.chartData.fields.map((item) => ({
        ...item,
        active: field.id === item.id,
      }));
      newChartDat.chartData.periods = chartState.chartData.periods.map((item) => ({
        ...item,
        active: period.id === item.id,
      }));

      setChartState(newChartDat);
      dispatch(updateChartData(period, field, app!));
    },
    [appData, chartState],
  );

  const handleManageApps = (appsData: AppListMenuAction) => {
    setModalAppData(appsData);
    switch (appsData.action) {
      case 'DELETE': {
        setState({
          isOpened: true,
          type: 'danger',
          modalTitle: 'Delete app',
          modalText: 'Delete this app from the marketplace now?',
          confirmButtonText: 'Yes, delete it',
        });
        break;
      }
      case 'SUBMIT': {
        setState({
          isOpened: true,
          type: 'primary',
          modalTitle: 'Submit app',
          modalText: 'Submit this app to the marketplace now?',
          confirmButtonText: 'Yes, submit it',
        });
        break;
      }
      case 'EDIT': {
        history.push(`/manage-apps/edit/${appsData.appId}/${appsData.appVersion}`);
      }
    }
  };

  const closeModal = () => {
    setState(initialConfirmAppModal);
    setModalAppData(initialModalData);
  };

  const handleSubmitModal = () => {
    dispatch(handleApp(modalAppData));
    setState(initialConfirmAppModal);
    setModalAppData(initialModalData);
  };
  return (
    <MainTemplate>
      <div className="bg-container manage-app-header">
        <OcNavigationBreadcrumbs
          pageTitle="Manage apps"
          buttonText="Create app"
          buttonClick={onClickPass}
        />
      </div>
      <div className="container manage-app">
        <div className="container my-3 px-0">
          <OcChartComponent
            chartData={chartState.chartData}
            count={chartState.count}
            countText={chartState.countText}
            changeChartOptions={changeChartOptions}
            downloadUrl={'/assets/img/cloud-download.svg'}
            activeDataType="graph"
          />
        </div>
        <div className="manage-app-table pb-2">
          <OcAppTable
            descendingSortIcon={'assets/img/dropdown-down.svg'}
            ascendingSortIcon={'assets/img/dropdown-up.svg'}
            defaultAppIcon={'assets/img/default-app-icon.svg'}
            properties={allAppsData}
            noAppMessage={'No apps in your list'}
            onMenuClick={handleManageApps}
          />
        </div>
        <OcConfirmationModalComponent
          isOpened={state.isOpened}
          onSubmit={handleSubmitModal}
          onClose={closeModal}
          onCancel={closeModal}
          modalTitle={state.modalTitle}
          modalText={state.modalText}
          confirmButtonText={state.confirmButtonText}
          confirmButtonType={state.type}
          rejectButtonText={state.rejectButtonText}
        />
      </div>
    </MainTemplate>
  );
};

export default ManageApp;
