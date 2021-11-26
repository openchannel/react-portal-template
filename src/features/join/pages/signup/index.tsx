import * as React from 'react';
import { set } from 'lodash';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { OCNativeCustomSignup } from '@openchannel/react-common-services';
import { OcFormFormikHelpers, OcFormValues } from '@openchannel/react-common-components';
import { OcSignupComponent } from '@openchannel/react-common-components/dist/ui/auth/organisms';

import { ErrorResponse } from 'types';
import { nativeSignup } from 'features/common/store/session';
import { useTypedSelector } from 'features/common/hooks';
import { loadUserProfileForm } from 'features/common/store/user-types';
import companyLogo from '../../../../../public/assets/img/company-logo-2x.png';
import doneIcon from '../../../../../public/assets/img/forgot-password-complete-icon.svg';

import { prefixedConfigs } from './utils';
import { mockConfig, ACCOUNT_TYPE_REGEX, ORGANIZATION_TYPE_REGEX } from './constants';

import './styles.scss';

const SignupPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const [serverErrorValidation, setServerErrorValidation] = React.useState(false);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const { configs, isLoading } = useTypedSelector(({ userTypes }) => userTypes);

  React.useEffect(() => {
    dispatch(loadUserProfileForm(mockConfig, true, true));
  }, []);

  const prefixedFormConfigs = React.useMemo(() => prefixedConfigs(configs), [configs]);

  const onSubmit = async (values: OcFormValues, { setSubmitting }: OcFormFormikHelpers) => {
    if (serverErrorValidation) {
      setServerErrorValidation(false);
    }

    const formData = Object.entries(values).reduce((fd, [key, value]) => {
      if (ACCOUNT_TYPE_REGEX.test(key)) {
        set(fd, `account.${key.replace(ACCOUNT_TYPE_REGEX, '')}`, value);
      } else if (ORGANIZATION_TYPE_REGEX.test(key)) {
        set(fd, `organization.${key.replace(ORGANIZATION_TYPE_REGEX, '')}`, value);
      } else if (key === 'terms') {
        set(fd, `account.terms`, value);
      } else if (key === 'password') {
        set(fd, 'password', value);
      } else if (key === 'info') {
        set(fd, 'account.type', value.formType);
        set(fd, 'organization.type', value.formType);
      }

      return fd;
    }, {} as OCNativeCustomSignup);

    try {
      await dispatch(nativeSignup(formData));
      setShowFeedback(true);
    } catch (error) {
      const { response } = error as ErrorResponse;

      setSubmitting(false);
      if (response.data?.code === 'VALIDATION') {
        setServerErrorValidation(true);
      }
    }
  };

  const goToActivationPage = React.useCallback(() => {
    push('/activate');
  }, [push]);

  return (
    <div className="bg-container pt-sm-5">
      <div className="signup-position">
        {!isLoading && (
          <OcSignupComponent
            showFeedback={showFeedback}
            forgotPasswordDoneUrl={doneIcon}
            loginUrl="/login"
            companyLogoUrl={companyLogo}
            formConfigs={prefixedFormConfigs}
            onSubmit={onSubmit}
            defaultEmptyConfigsErrorMessage="There are no configuration"
            enablePasswordField
            enableTermsCheckbox
            goToActivationPage={goToActivationPage}
            ordinaryTermsDescription={
              <>
                I agree to{' '}
                <a
                  target="_blank"
                  href="https://my.openchannel.io/terms-of-service"
                  className="edit-user-form__content__link"
                  rel="noreferrer"
                >
                  Terms of service
                </a>{' '}
                and{' '}
                <a
                  target="_blank"
                  className="edit-user-form__content__link"
                  href="https://my.openchannel.io/data-processing-policy"
                  rel="noreferrer"
                >
                  Data processing policy
                </a>
              </>
            }
          />
        )}
      </div>
    </div>
  );
};

export default SignupPage;
