import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { MainTemplate } from 'features/common/templates';
import { OcNavigationBreadcrumbs } from '@openchannel/react-common-components/dist/ui/common/molecules';
import { OcAppTable } from '@openchannel/react-common-components/dist/ui/portal/organisms';
import {
  ChartOptionsChange,
  OcChartComponent,
} from '@openchannel/react-common-components/dist/ui/portal/organisms';
import { defaultProps, appsConfig } from './constants';
import { appVersions, updateChartData } from '../../store/app-data';
import { useTypedSelector } from 'features/common/hooks';
import { ChartDataType } from './types';
import './styles.scss';

const ManageApp = (): JSX.Element => {
  const appData = useTypedSelector(({ appData }) => appData);
  const history = useHistory();
  const dispatch = useDispatch();
  const onClickPass = React.useCallback(() => {
    history.push('/create');
  }, []);

  const [chartState, setChartState] = React.useState<ChartDataType>(defaultProps);

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
      chartData: { ...chartState.chartData, apps: appData.apps, data: appData.chart },
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
        <>
          <div className="container my-3 px-0">
            <OcChartComponent
              chartData={chartState.chartData}
              count={chartState.count}
              countText={chartState.countText}
              changeChartOptions={changeChartOptions}
              downloadUrl={'assets/img/cloud-download.svg'}
              activeDataType="graph"
            />
          </div>
          <div className="manage-app-table pb-2">
            <OcAppTable
              descendingSortIcon={'assets/img/dropdown.svg'}
              ascendingSortIcon={'assets/img/dropdown.svg'}
              defaultAppIcon={'assets/img/default-app-icon.svg'}
              properties={allAppsData}
              noAppMessage={'No Apps Has Been Added Yet'}
            />
          </div>
        </>
      </div>
    </MainTemplate>
  );
};

export default ManageApp;
