import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { MainTemplate } from 'features/common/templates';
import {
  OcNavigationBreadcrumbs,
  OcSelect,
} from '@openchannel/react-common-components/dist/ui/common/molecules';
import { useTypedSelector } from 'features/common/hooks';
import { fileService } from '@openchannel/react-common-services';
import { OcLabelComponent } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { OcConfirmationModalComponent } from '@openchannel/react-common-components/dist/ui/common/organisms';
import {
  OcFormValues,
  OcFormFormikHelpers,
  AppTypeModel,
  FullAppData,
} from '@openchannel/react-common-components';
import { OcForm, OcSingleForm } from '@openchannel/react-common-components/dist/ui/form/organisms';
import { getAppTypesOnly, updateFields, toDraftAndSubmit } from '../../store/app-data';
import { ConfirmUserModal } from './types';
import { cancelModal, initialConfirmAppModal, submitModal } from './constants';
import './styles.scss';

const mappedFileService = {
  fileUploadRequest: fileService.uploadToOpenChannel,
  fileDetailsRequest: fileService.downloadFileDetails,
};

const CreateApp = (): JSX.Element => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [modalState, setModalState] = React.useState<ConfirmUserModal>(initialConfirmAppModal);
  const [formValues, setFormValues] = React.useState<OcFormValues>();
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [maxStepsToShow, setMaxStepsToShow] = React.useState<number>(3);
  const [isWizard, setIsWizard] = React.useState<boolean>(false);
  const [blockGoBack, setBlockGoBack] = React.useState<boolean>(true);
  const [goTo, setGoTo] = React.useState<string>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formik, pullFormik] = React.useState<any>({
    errors: {},
    touched: {},
    isSubmitting: false,
    values: {},
    isValidating: false,
    submitCount: 0,
  });

  const {
    singleAppData: { listApps, selectedType, appTypes, appFields },
  } = useTypedSelector(({ appData }) => appData);

  React.useEffect(() => {
    dispatch(getAppTypesOnly());

    return () => setModalState(initialConfirmAppModal);
  }, []);

  React.useEffect(() => {
    const unblock = history.block(({ pathname }) => {
      setGoTo(pathname);
      handleEditFormCancel();
      if (blockGoBack) {
        return false;
      }
    });

    return () => unblock();
  }, [blockGoBack]);

  React.useEffect(() => {
    const curFormType = appFields?.fields?.some(
      (field: FullAppData) => field.type === 'fieldGroup',
    );
    setIsWizard(curFormType);
  }, [appFields]);

  const setSelected = React.useCallback(
    (selected: { label: string }) => {
      const form = listApps.find((e: AppTypeModel) => e.appTypeId === selected.label);
      dispatch(updateFields(selected.label, form));
    },
    [listApps],
  );

  const onCancelModal = () => {
    if (modalState.toDraft && formValues) {
      try {
        dispatch(
          toDraftAndSubmit(formValues, 'App has been saved as draft', false, selectedType.id),
        );
        history.goBack();
      } catch (e) {
        // donothing
      }
    } else {
      setBlockGoBack(true);
    }
    setModalState(initialConfirmAppModal);
  };

  const onCloseModal = () => {
    setModalState(initialConfirmAppModal);
    setBlockGoBack(true);
  };

  const handleEditFormCancel = () => {
    setModalState(cancelModal);
    setBlockGoBack(false);
  };

  const handleSubmitModal = async () => {
    if (modalState.submitButton && formValues) {
      try {
        await dispatch(
          toDraftAndSubmit(
            formValues,
            'App has been submitted for approval',
            true,
            selectedType.id,
            formik,
            setModalState,
            goToBack,
          ),
        );
      } catch (e) {
        // donothing
      }
    } else {
      goToBack();
    }
  };

  const handleEditFormSubmit = (
    values: OcFormValues,
    formikHelpers: OcFormFormikHelpers,
    action: string,
  ) => {
    setBlockGoBack(false);
    if (action === 'submit') {
      formikHelpers.setSubmitting(false);
      setFormValues(values);
      setModalState(submitModal);
    } else if (action === 'save') {
      try {
        dispatch(
          toDraftAndSubmit(
            values,
            'App has been saved as draft',
            false,
            selectedType.id,
            formik,
            setModalState,
            goToBack,
          ),
        );
        history.goBack();
      } catch (e) {
        // donothing
      }
    }
  };

  const goToBack = () => {
    if (goTo && goTo.length > 0) {
      history.push(goTo);
    } else {
      history.goBack();
    }
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
                labelField="label"
              />
            </div>
          </div>
        </form>
        {appFields && !isWizard && (
          <OcSingleForm
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
        {appFields && isWizard && (
          <OcForm
            formJsonData={appFields}
            fileService={mappedFileService}
            displayType="wizard"
            onSubmit={handleEditFormSubmit}
            onCancel={handleEditFormCancel}
            submitButtonText="Submit"
            buttonPosition="between"
            showSaveBtn={true}
            showButton={true}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            maxStepsToShow={maxStepsToShow}
            setMaxStepsToShow={setMaxStepsToShow}
            showProgressBar={true}
            showGroupDescription={true}
            showGroupHeading={true}
            formik={formik}
            pullFormik={pullFormik}
          />
        )}
        <OcConfirmationModalComponent
          isOpened={modalState.isOpened}
          onSubmit={handleSubmitModal}
          onClose={onCloseModal}
          onCancel={onCancelModal}
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
