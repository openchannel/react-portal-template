import * as React from 'react';
import { useDispatch } from 'react-redux';
import { apps, fileService } from '@openchannel/react-common-services';
import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { AppFormModel } from '@openchannel/react-common-components/dist/ui/form/models';
import {
  OcFormFormikHelpers,
  OcFormValues,
  OcSingleForm,
} from '@openchannel/react-common-components/dist/ui/form/organisms';

import { useTypedSelector } from 'features/common/hooks';
import {
  clearDevCompanyForm,
  getDevCompanyForm,
  saveDevCompany,
} from 'features/common/store/dev-types/actions';

const mappedFileService = {
  fileUploadRequest: fileService.uploadToOpenChannel,
  fileDetailsRequest: fileService.downloadFileDetails,
};

const CompanyDetails: React.FC = () => {
  const dispatch = useDispatch();
  const { companyForm } = useTypedSelector(({ userDevTypes }) => userDevTypes);

  React.useEffect(() => {
    dispatch(getDevCompanyForm());

    return () => {
      dispatch(clearDevCompanyForm());
    };
  }, []);

  const handleSubmit = async (
    value: OcFormValues,
    { setErrors, setSubmitting }: OcFormFormikHelpers,
  ) => {
    try {
      await dispatch(saveDevCompany(value));
      notify.success('Your company details has been updated');
      // eslint-disable-next-line
    } catch (e: any) {
      if (e.errors != null) {
        setErrors(e.errors);
      }
    }

    setSubmitting(false);
  };

  if (companyForm == null) {
    return null;
  }

  return (
    <OcSingleForm
      fileService={mappedFileService}
      formJsonData={companyForm as AppFormModel}
      onSubmit={handleSubmit}
      service={apps}
      buttonPosition="between"
      submitButtonText="Save"
    />
  );
};

export default CompanyDetails;
