import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { OcChartComponent, ChartLayoutTypeModel,ChartOptionsChange, OcAppTable } from '@openchannel/react-common-components/dist/ui/portal/organisms';
import { OcNavigationBreadcrumbs } from '@openchannel/react-common-components/dist/ui/common/molecules';
import { chartService, ChartStatisticPeriodModelResponse, AppVersionService} from '@openchannel/react-common-services';
import { MainTemplate } from 'features/common/templates';
import { FullAppData,ChartStatisticDataModel } from '@openchannel/react-common-components';
import { AppListing } from '@openchannel/react-common-components/dist/ui/portal/models';


import './styles.scss';


const ManageApp = (): JSX.Element => {
  const [isSelectedPage, setSelectedPage] = React.useState('manageApps');
  const history = useHistory();
  const onClickPass = React.useCallback((val : string) => {
    switch (val) {
      case 'manageApps':
        history.replace('/manage-apps');
        break;
      case 'createApp':
        history.replace('/manage-apps/create');
        break;
      default:
        break;
    }
    setSelectedPage(val);
  }, []);

  React.useEffect(() => {
    switch (isSelectedPage) {
      case 'manageApps':
        history.replace('/manage-apps');
        break;
      case 'createApp':
        history.replace('/manage-apps/create');
        break;
      default:
        break;
    }
  }, []);

  const chartPeriod:ChartStatisticDataModel = {
    labelsY: [],
    labelsX: [],
    tabularLabels: [],
  };

  const defaultProps = {
    chartData: {
      layout: ChartLayoutTypeModel.standard,
      data: chartPeriod,
      periods: [
        {
            id: 'month',
            label: 'Monthly',
            active: true,
            tabularLabel: 'Month',
        },
        {
            id: 'day',
            label: 'Daily',
            tabularLabel: 'Day',
        },
    ],
    fields: [
        {
            id: 'downloads',
            label: 'Downloads',
            active: true,
        },
        {
            id: 'reviews',
            label: 'Reviews',
        },
        {
            id: 'leads',
            label: 'Leads',
        },
        {
            id: 'views',
            label: 'Views',
        },
    ],
      apps: [
        {
          id: 'allApps',
          label: 'All apps',
          active: true,
        }
      ],
    },
    count: chartPeriod.labelsY.reduce((a, b) => a + b, 0),
    countText: 'Total',
  };

  const appsConfig = {
    layout: 'table',
    data: {
      pages: 30,
      pageNumber: 1,
      list: [],
      count: 30,
    },
    options: ['Edit', 'Preview', 'Submit', 'Delete'],
  };

  const [chartData, setChartData] = React.useState(defaultProps.chartData);
  const [count, setCount] = React.useState<number>(defaultProps.count);
  const [countText, setCountText] = React.useState<string>(defaultProps.countText);
  const [appData, setAppData] = React.useState<AppListing>(appsConfig);



  React.useEffect( () => {
  const period = defaultProps.chartData.periods.find(v => v.active);
  const field = defaultProps.chartData.fields.find(v => v.active);
  const app = defaultProps.chartData.apps.find(v => v.active);
  updateChartData(period!.id, field!.id, app!.id , period!);
  appVersions();
  }, []);

  const sortOptionsQueryPattern = {
    created: (order:number) => `{'created': ${order}}`,
    name: (order:number)  => `{'name': ${order}}`,
    status: (order:number)  => `{'status.value': ${order}, 'parent.status.value': ${order}}`,
  };

  const appVersions = async () => {
    const newChartDat = { ...defaultProps.chartData };
    const newAppsConfig = {...appData};
    const sortQuery: string = sortOptionsQueryPattern.created(-1);

    const query = {
      $or: [
          {
              'status.value': { $in: ['inReview', 'pending', 'inDevelopment', 'rejected'] },
              'parent.status': {
                  $exists: false,
              },
          },
          {
              'parent.status.value': 'approved',
              isLive: true,
          },
          {
              'parent.status.value': 'suspended',
              isLive: true,
          },
      ],
    };

    const statElement = {
      '90day': 0,
      '30day': 0,
      total: 0,
    };
    
    try {
      await AppVersionService.getAppsVersions(appsConfig.data.pageNumber, appsConfig.data.count, sortQuery, JSON.stringify(query))
        .then((res) => {
          res.data.list.map((item: FullAppData) => {
            if(item.status.value === 'approved') {
              newChartDat.apps.push({id: item.appId, label: item.name, active: false});
            }

            const newApp:FullAppData = {
              appId: item.appId,
              safeName: item.safeName,
              customData: item.customData,
              status: item.status,
              developerId: item.developerId,
              model: item.model,
              name: item.name,
              lastUpdated: item.lastUpdated,
              isLive: item.isLive,
              version: item.version,
              submittedDate: item.submittedDate,
              created: item.created,
              rating: 0,
              reviewCount: 0,
              statistics: {
                views: statElement,
                downloads: statElement,
                developerSales: statElement,
                totalSales: statElement,
                ownerships: statElement,
                reviews: statElement,
              },
            }
            newAppsConfig.data.list.push({...newApp});

          });
        });
        setAppData(newAppsConfig);
        setChartData(newChartDat);
    } catch {
      notify.error('Error occured while rendering apps');
    }
  };


  const updateChartData = async (periodVal: string, fieldVal: string, appVal: string, period:ChartStatisticPeriodModelResponse) => {
    const dateEnd = new Date();
    const dateStart = chartService.getDateStartByCurrentPeriod(dateEnd, period);
    const newChartDat = { ...defaultProps.chartData };
    const newChart = { ...chartPeriod };
	  const appReq = (appVal !== 'allApps' ? appVal : '');

    try {
		await chartService.getTimeSeries(periodVal, fieldVal, dateStart.getTime(), dateEnd.getTime(), appReq)
			.then((res) => {
				res.data.map((item:number[]) => {
          const date = new Date(item[0]);
          const monthTo = date.toLocaleString('default', { month: 'short' });

          if (periodVal === 'day') {
            const dayTo = date.toLocaleString('default', { day: 'numeric' });
            const finalStr = monthTo.concat( ' ', dayTo.toString());
            newChart.labelsX.push(finalStr); 
            newChart.tabularLabels!.push(finalStr);
          } else {
            newChart.labelsX.push(monthTo); 
            newChart.tabularLabels!.push(date.toLocaleString('default', { month: 'long' }));
          }    

          newChart.labelsY.push(item[1]);
          newChartDat.data = newChart;
				});

				newChartDat.fields = chartData.fields.map((item) => ({
				...item,
				active: fieldVal === item.id,
				}));
				newChartDat.periods = chartData.periods.map((item) => ({
				...item,
				active: periodVal === item.id,
				}));
				newChartDat.apps = chartData.apps.map((item) => ({
				...item,
				active: appVal === item.id,
				}));
			
				setChartData(newChartDat);
				setCountText(`Total ${fieldVal}`);
				setCount(newChartDat.data.labelsY.reduce((a, b) => a + b, 0));
			})
	} catch {
     		notify.error('Error occured while rendering data');
		}
 };

	const changeChartOptions = ({ period, field, app }: ChartOptionsChange) => {
    updateChartData(period.id, field.id, app!.id, period);
	};

  return (
    <MainTemplate>
      <div className="bg-container height-unset">
        {isSelectedPage === 'manageApps' && (
            <OcNavigationBreadcrumbs pageTitle="Manage apps" buttonText="Create app" buttonClick={() => onClickPass('createApp')} />
        )}
        {isSelectedPage === 'createApp' && (
            <OcNavigationBreadcrumbs pageTitle="Create app" navigateText="Back" navigateClick={() => onClickPass('manageApps')} />
        )}
      </div>

      <div className="container manage-app">
      {isSelectedPage === 'manageApps' && 
        <>
      	<div className="container my-3 px-0">
          <OcChartComponent 
            chartData={chartData}
            count={count}
            countText={countText}
            changeChartOptions={changeChartOptions} 
            downloadUrl={'assets/img/cloud-download.svg'}
            activeDataType= 'graph'
          />
		</div> 
		<div className="manage-app-table pb-2">
			<OcAppTable
				descendingSortIcon={'assets/img/dropdown.svg'}
				ascendingSortIcon={'assets/img/dropdown.svg'}
				defaultAppIcon={'assets/img/default-app-icon.svg'}
				onSort={() => sortOptionsQueryPattern.created(-1)}
				properties={appData}
				noAppMessage = {'No Apps Has Been Added Yet'} 
			/> 
		 </div>
        </>
      } 
      </div>
    </MainTemplate>
  );
};

export default ManageApp;

