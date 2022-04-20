import * as React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  OcNavigationBreadcrumbs,
  OcSelect,
} from '@openchannel/react-common-components/dist/ui/common/molecules';
import { OcForm, OcSingleForm } from '@openchannel/react-common-components/dist/ui/form/organisms';
import {
  OcError,
  OcLabelComponent,
} from '@openchannel/react-common-components/dist/ui/common/atoms';
import {
  ChartStatisticFiledModel,
  OcFormValues,
  OcFormFormikHelpers,
  AppTypeModel,
  AppTypeFieldModel,
  FullAppData,
} from '@openchannel/react-common-components';
import {
  OcChartComponent,
  ChartOptionsChange,
} from '@openchannel/react-common-components/dist/ui/portal/organisms';
import { fileService } from '@openchannel/react-common-services';
import { OcConfirmationModalComponent } from '@openchannel/react-common-components/dist/ui/common/organisms';
import { MainTemplate } from 'features/common/templates';
import { useTypedSelector } from 'features/common/hooks';
import { updateChartData, getAppTypes, updateFields, saveToDraft } from '../../store/app-data';
import { EditPage, ConfirmUserModal } from './types';
import {
  cancelModal,
  defaultProps,
  initialConfirmAppModal,
  submitModal,
  submitModalPending,
} from './constants';
import './styles.scss';

const mappedFileService = {
  fileUploadRequest: fileService.uploadToOpenChannel,
  fileDetailsRequest: fileService.downloadFileDetails,
};

const EditApp = (): JSX.Element => {
  const {
    chart,
    count,
    countText,
    singleAppData: { listApps, selectedType, appTypes, appFields, curAppStatus },
  } = useTypedSelector(({ appData }) => appData);

  const history = useHistory();
  const dispatch = useDispatch();
  const params: EditPage = useParams();
  const [modalState, setModalState] = React.useState<ConfirmUserModal>(initialConfirmAppModal);
  const [formValues, setFormValues] = React.useState<OcFormValues>();
  const appToEdit: ChartStatisticFiledModel = { id: params.appId, label: '' };
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
  const paramToDraft = {
    values: formValues,
    message: '',
    appId: params.appId,
    version: parseInt(params.version, 10),
    selectedType: selectedType?.id,
    curAppStatus,
    toSubmit: false,
  };

  React.useEffect(() => {
    const period = defaultProps.chartData.periods.find((v) => v.active);
    const field = defaultProps.chartData.fields.find((v) => v.active);

    dispatch(updateChartData(period!, field!, appToEdit));
    dispatch(getAppTypes(params.appId, paramToDraft.version));

    return () => {
      dispatch(updateFields(selectedType, null));
    };
  }, []);

  React.useEffect(() => {
    const curFormType = appFields?.fields?.some(
      (field: FullAppData) => field.type === 'fieldGroup',
    );
    setIsWizard(curFormType);
  }, [appFields]);

  React.useEffect(() => {
    const unblock = history.block(({ pathname }) => {
      setGoTo(pathname);
      handleEditFormCancel();
      if (blockGoBack) {
        return false;
      }
    });

    return () => unblock();
  }, [blockGoBack, goTo]);

  const setSelected = React.useCallback(
    (selected: { label: string }) => {
      const form = listApps.find((e: AppTypeModel) => e.appTypeId === selected.label);
      const savedName = appFields?.fields.find((e: AppTypeFieldModel) => e.id === 'name');
      form.fields.find((e: AppTypeFieldModel) => e.id === 'name').defaultValue =
        savedName?.defaultValue;

      dispatch(updateFields(selected.label, form));
    },
    [listApps],
  );

  const changeChartOptions = React.useCallback(
    ({ period, field }: ChartOptionsChange) => {
      dispatch(updateChartData(period, field, appToEdit));
    },
    [appToEdit],
  );

  const handleEditFormSubmit = (
    values: OcFormValues,
    formikHelpers: OcFormFormikHelpers,
    action: string,
  ) => {
    setBlockGoBack(false);
    if (action === 'submit') {
      formikHelpers.setSubmitting(false);
      setFormValues(values);
      if (curAppStatus === 'pending') {
        setModalState(submitModalPending);
      } else {
        setModalState(submitModal);
      }
    } else if (action === 'save') {
      let statusMsg = '';
      if (curAppStatus === 'approved') {
        statusMsg = 'New app version created and saved as draft';
      } else {
        statusMsg = 'App has been saved as draft';
      }
      dispatch(
        saveToDraft(
          { ...paramToDraft, values: { ...values }, message: statusMsg },
          formik,
          setModalState,
          history.goBack,
        ),
      );
      // history.goBack();
    }
  };

  const handleEditFormCancel = () => {
    setModalState(cancelModal);
    setBlockGoBack(false);
  };

  const onCancelModal = () => {
    if (modalState.toDraft && formValues) {
      let statusMsg = '';
      if (curAppStatus === 'approved') {
        statusMsg = 'New app version created and saved as draft';
      } else {
        statusMsg = 'App has been saved as draft';
      }
      dispatch(saveToDraft({ ...paramToDraft, values: formValues, message: statusMsg }));
      history.goBack();
    } else {
      setBlockGoBack(true);
    }
    setModalState(initialConfirmAppModal);
  };

  const onCloseModal = () => {
    setModalState(initialConfirmAppModal);
    setBlockGoBack(true);
  };

  const handleSubmitModal = () => {
    if (modalState.submitButton && formValues) {
      let statusMsg = '';
      if (curAppStatus === 'approved') {
        statusMsg = 'New app version has been submitted for approval';
      } else {
        statusMsg = 'App has been submitted for approval';
      }
      try {
        dispatch(
          saveToDraft(
            { ...paramToDraft, values: formValues, toSubmit: true, message: statusMsg },
            formik,
            setModalState,
            goToBack,
          ),
        );
        // goToBack();
      } catch (e) {
        // donothing
      }
    } else {
      goToBack();
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
                value={selectedType?.label}
                labelField="label"
              />
            </div>
          </div>
          {selectedType === false && (
            <OcError message="The type for this app no longer exists, please choose a new type" />
          )}
        </form>
        {appFields && !isWizard && selectedType && (
          <OcSingleForm
            formJsonData={appFields}
            fileService={mappedFileService}
            onSubmit={handleEditFormSubmit}
            submitButtonText="Submit"
            onCancel={handleEditFormCancel}
            buttonPosition="between"
            showSaveBtn={curAppStatus === 'pending' ? false : true}
            showSubmitBtn={curAppStatus === 'suspended' ? false : true}
          />
        )}
        {appFields && isWizard && selectedType && (
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

export default EditApp;
