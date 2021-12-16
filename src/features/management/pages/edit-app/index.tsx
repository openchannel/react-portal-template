import * as React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { OcNavigationBreadcrumbs, OcSelect } from '@openchannel/react-common-components/dist/ui/common/molecules';
import { OcForm } from '@openchannel/react-common-components/dist/ui/form/organisms';
import { OcLabelComponent, notify } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { ChartStatisticFiledModel, OcFormValues, OcFormFormikHelpers, AppTypeModel } from '@openchannel/react-common-components';
import { OcChartComponent, ChartOptionsChange } from '@openchannel/react-common-components/dist/ui/portal/organisms';
import { appVersion, fileService, apps } from '@openchannel/react-common-services';
import { OcConfirmationModalComponent } from '@openchannel/react-common-components/dist/ui/common/organisms';
import { MainTemplate } from 'features/common/templates';
import { useTypedSelector } from 'features/common/hooks';
import { notifyErrorResp } from 'features/common/libs/helpers';
import { updateChartData, getAppTypes, updateFields } from '../../store/app-data';
import { editPage, ConfirmUserModal } from './types';
import { defaultProps, initialConfirmAppModal } from './constants';
import './styles.scss';


const mappedFileService = {
  fileUploadRequest: fileService.uploadToOpenChannel,
  fileDetailsRequest: fileService.downloadFileDetails,
};

const EditApp = (): JSX.Element => {
  const {
    chart, count, countText,
    singleAppData: { listApps, selectedType, appTypes, appFields, curAppStatus },
  } = useTypedSelector(({ appData }) => appData);

  const history = useHistory();
  const dispatch = useDispatch();
  const params:editPage = useParams();
  const [modalState, setModalState] = React.useState<ConfirmUserModal>(initialConfirmAppModal);
  const [formValues, setFormValues] = React.useState<OcFormValues>();
  const appToEdit: ChartStatisticFiledModel = ({ id: params.appId,  label: ''});
  React.useEffect(() => {
    const period = defaultProps.chartData.periods.find((v) => v.active);
    const field = defaultProps.chartData.fields.find((v) => v.active);

    dispatch(updateChartData(period!, field!, appToEdit));
    dispatch(getAppTypes(params.appId, parseInt(params.version, 10)));

    return () => {
      dispatch(updateFields(selectedType, null));
    };
  }, []);
  
  const setSelected = React.useCallback((selected:string) => {
    const form = listApps.find((e:AppTypeModel) => e.appTypeId === selected);
    dispatch(updateFields(selected, form));
  },[listApps]);

  const changeChartOptions = React.useCallback(({ period, field }: ChartOptionsChange) => {
    dispatch(updateChartData(period, field, appToEdit));
  }, [appToEdit]);
  
  const handleEditFormSubmit = (values:OcFormValues, formikHelpers:OcFormFormikHelpers) => {
    formikHelpers.setSubmitting(false);
    setFormValues(values);
    if(curAppStatus === 'pending') {
      setModalState({
        isOpened: true,
        type: 'primary',
        modalTitle: 'Submit app',
        modalText: 'Submit this app to the marketplace now?',
        confirmButtonText: 'Yes, submit it',
        rejectButtonHide: true,
        submitButton: true,
        toDraft: false,
      });
    } else {
      setModalState({
        isOpened: true,
        type: 'primary',
        modalTitle: 'Submit app',
        modalText: 'Submit this app to the marketplace now?',
        confirmButtonText: 'Yes, submit it',
        rejectButtonHide: false,
        submitButton: true,
        rejectButtonText: 'Save as draft',
        toDraft: true,
      });
    }
  };

  const saveToDraft = React.useCallback( async (values:OcFormValues, message:string) => {
    const newArrTypes:OcFormValues = {};
    const customData:OcFormValues = {};
    
    for (const prop in values) {
      newArrTypes['name'] = values.name;
      if(prop.includes('customData.')) {
        const toReplace = prop.replace('customData.','');
        customData[toReplace] = values[prop];
      }
    }
    
    newArrTypes.approvalRequired = true;
    newArrTypes.customData = customData;
    newArrTypes.type = selectedType;

    try {
      const newAppV  = await appVersion.updateAppByVersion(params.appId, parseInt(params.version, 10), {body:newArrTypes});
      notify.success(message);
      return newAppV.data.version;
    } catch(e) {
      notifyErrorResp(e);
    }
  }, [params, selectedType]);

  const handleEditFormSave = async (values:OcFormValues) => {
    let statusMsg = '';
    if (curAppStatus === 'approved') {
      statusMsg = 'New app version created and saved as draft';
    } else {
      statusMsg = 'App has been saved as draft';
    }
    saveToDraft(values, statusMsg);
    history.goBack();
  };

  const handleEditFormCancel = () => {
    setModalState({
      isOpened: true,
      type: 'primary',
      modalTitle: 'Skip unsaved data',
      modalText: 'Unsaved data detected. Want to exit?',
      confirmButtonText: 'Agree',
      rejectButtonText:"Cancel",
      rejectButtonHide: false,
      submitButton: false,
      toDraft: false,
    });
  };

  const closeModal = () => {
    if(modalState.toDraft && formValues) {
      let statusMsg = '';
      if (curAppStatus === 'approved') {
        statusMsg = 'New app version created and saved as draft';
      } else {
        statusMsg = 'App has been saved as draft';
      }
      saveToDraft(formValues, statusMsg);
      history.goBack();
    }
    setModalState(initialConfirmAppModal);
  };

  const handleSubmitModal = React.useCallback( async () => {
    if(modalState.submitButton && formValues) {
      let statusMsg = '';
      if (curAppStatus === 'approved') {
        statusMsg = 'New app version has been submitted for approval';
      } else {
        statusMsg = 'App has been submitted for approval';
      }
      saveToDraft(formValues, statusMsg)
      .then((res) => {
        if(curAppStatus !== 'pending') {
          apps.publishAppByVersion(params.appId, {
            version: res,
            autoApprove: false,
          }); 
        }
      });
    }
    setModalState(initialConfirmAppModal);
    history.goBack();
  },[modalState, formValues, params]);

  return (
    <MainTemplate>
      <div className="bg-container edit-app-header">
          <OcNavigationBreadcrumbs
          pageTitle="Edit app"
          navigateText="Back"
          navigateClick={handleEditFormCancel}
          />
      </div>
      <div className="container mt-5 edit-app-body">
        <div className="container my-5 px-0">
          <OcChartComponent
            chartData={chart}
            count={count}
            countText={countText}
            changeChartOptions={changeChartOptions}
            downloadUrl={'/assets/img/cloud-download.svg'}
            activeDataType="graph"
          />
        </div>
        <form className="mb-2">
        <div className="d-flex flex-column flex-md-row align-items-md-center mb-2">
            <OcLabelComponent 
              text="Choose your app type" 
              required={true} 
              className="apps-type-label text-nowrap col-md-3 mr-1 mb-1 mb-md-0 pl-0" 
            />
            <div className="d-flex flex-column w-100 apps-type-select">
              <OcSelect
                onSelectionChange={setSelected}
                selectValArr={appTypes}
                value={selectedType}
              />
            </div>
            </div>
        </form>
        {appFields && <OcForm
          formJsonData={appFields}
          fileService={mappedFileService}
          onSubmit={handleEditFormSubmit}
          submitButtonText="Submit"
          onCancel={handleEditFormCancel}
          buttonPosition="between"
          onSave={handleEditFormSave}
          showSaveBtn={ curAppStatus === 'pending' ? false : true }
          showSubmitBtn={ curAppStatus === 'suspended' ? false : true }
        />}
        <OcConfirmationModalComponent
          isOpened={modalState.isOpened}
          onSubmit={handleSubmitModal}
          onClose={closeModal}
          onCancel={closeModal}
          modalTitle={modalState.modalTitle}
          modalText={modalState.modalText}
          confirmButtonText={modalState.confirmButtonText}
          confirmButtonType={modalState.type}
          rejectButtonText={modalState.rejectButtonText}
          rejectButtonHide={modalState.rejectButtonHide}
        />
      </div>
    </MainTemplate>
  );
};

export default EditApp;
