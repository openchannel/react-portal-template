import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { notifyErrorResp } from 'features/common/libs/helpers';
import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { MainTemplate } from 'features/common/templates';
import { OcNavigationBreadcrumbs, OcSelect } from '@openchannel/react-common-components/dist/ui/common/molecules';
import { useTypedSelector } from 'features/common/hooks';
import { fileService, apps } from '@openchannel/react-common-services';
import { OcLabelComponent } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { OcConfirmationModalComponent } from '@openchannel/react-common-components/dist/ui/common/organisms';
import { OcFormValues, OcFormFormikHelpers, AppTypeModel } from '@openchannel/react-common-components';
import { OcForm } from '@openchannel/react-common-components/dist/ui/form/organisms';
import { getAppTypesOnly, updateFields} from '../../store/app-data';
import { ConfirmUserModal } from './types';
import { cancelModal, initialConfirmAppModal, submitModal } from './constants';
import './styles.scss';

const CreateApp = (): JSX.Element => {
  const history = useHistory();
  const dispatch = useDispatch();
  const mappedFileService = {
    fileUploadRequest: fileService.uploadToOpenChannel,
    fileDetailsRequest: fileService.downloadFileDetails,
  };
  const [modalState, setModalState] = React.useState<ConfirmUserModal>(initialConfirmAppModal);
  const [formValues, setFormValues] = React.useState<OcFormValues>();

  const { singleAppData: { listApps, selectedType, appTypes, appFields }
  } = useTypedSelector(({ appData }) => appData);

  React.useEffect(() => {
    dispatch(getAppTypesOnly());
    
    return () => setModalState(initialConfirmAppModal);
  }, []);
 
  const setSelected = React.useCallback( (selected: {label:string}) => {
    const form = listApps.find((e: AppTypeModel) => e.appTypeId === selected.label);
    dispatch(updateFields(selected.label, form));
  },[listApps]);

  const closeModal = () => {
    if (modalState.toDraft && formValues) {
      toDraftAndSubmit(formValues, 'App has been saved as draft', false);
    }
    setModalState(initialConfirmAppModal);
  };

  const handleEditFormCancel = () => {
    setModalState(cancelModal);
  };

  const handleSubmitModal = () => {    
    if (modalState.submitButton && formValues) {
        toDraftAndSubmit(formValues, 'App has been submitted for approval', true);
    } else {
      history.goBack();
    }
  };

  const handleEditFormSubmit = (values: OcFormValues, formikHelpers: OcFormFormikHelpers, action:string) => {
    if(action === 'submit') {
      formikHelpers.setSubmitting(false);
      setFormValues(values);
      setModalState(submitModal);
    } else if(action === 'save') {
      toDraftAndSubmit(values, 'App has been saved as draft', false);
    }
  };

  const toDraftAndSubmit = async (values: OcFormValues, massage: string, toSubmit: boolean) => {
    try {  
      const customData:OcFormValues = {};

      for (const prop in values) {
        if(prop.includes('customData.')) {
          const toReplace = prop.replace('customData.','');
          customData[toReplace] = values[prop];
        }
      }
      const  { data } = await apps.createApp({name: values.name, type: selectedType.id , customData: customData});

      if (toSubmit) {
        await apps.publishAppByVersion(data.appId, {
          version: data.version,
          autoApprove: false,
        }); 
      }
      notify.success(massage);
    } catch(e) {
      notifyErrorResp(e);
    }
    history.goBack();
  };

  return (
    <MainTemplate>
      <div className="bg-container create-app-header">
        <OcNavigationBreadcrumbs
          pageTitle="Create app"
          navigateText="Back"
          navigateClick={handleEditFormCancel}
        />
      </div>
      <div className="container mt-5 create-app-body">
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
                value={selectedType?.label}
                labelField='label'
              />
            </div>
          </div>
        </form>
        {appFields && (
          <OcForm
            formJsonData={appFields}
            fileService={mappedFileService}
            onSubmit={handleEditFormSubmit}
            submitButtonText="Submit"
            onCancel={handleEditFormCancel}
            buttonPosition="between"
            showSaveBtn={true}
            showSubmitBtn={true}
          />
        )}
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

export default CreateApp;
