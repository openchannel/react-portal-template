import * as React from 'react';
import { useDispatch } from 'react-redux';
import { isEmptyInputValue } from '@openchannel/react-common-components/dist/ui/form/lib';
import { OcForgotPasswordComponent } from '@openchannel/react-common-components/dist/ui/auth/organisms';

import companyLogo from '../../../../../public/assets/img/company-logo-2x.png';
import forgotPasswordDoneIcon from '../../../../../public/assets/img/forgot-password-complete-icon.svg';

import { sendResetCode } from 'features/common/store/session';
import { invalidMassageEmail, requiredField, validateEmail } from '../constants';

import './styles.scss';

const ForgotPassword = (): JSX.Element => {
  const [inputValue, setInputValue] = React.useState('');
  const [inputError, setInputError] = React.useState('');
  const [showResultPage, setShowResultPage] = React.useState(false);
  const [loadingRequest, setLoadingRequest] = React.useState(false);
  const dispatch = useDispatch();

  const onChange = React.useCallback((e: { target: HTMLInputElement }) => {
    setInputValue(e.target.value);
    if (validateEmail()(e.target.value) !== null) {
      setInputError(invalidMassageEmail);
    } else {
      setInputError('');
    }
    if (isEmptyInputValue(e.target.value)) {
      setInputError(requiredField);
    }
  }, []);

  const onSubmit = React.useCallback(async () => {
    if (validateEmail()(inputValue) === null && !isEmptyInputValue(inputValue)) {
      try {
        setLoadingRequest(true);
        await dispatch(sendResetCode(inputValue));
        setShowResultPage(true);
        setInputValue('');
        setLoadingRequest(false);
      } catch {
        setLoadingRequest(false);
      }
    }
    if (isEmptyInputValue(inputValue)) {
      setInputError(requiredField);
    }
  }, [inputValue]);

  return (
    <div className="bg-container pt-sm-5">
      <div className="forgot-pass-position">
        <OcForgotPasswordComponent
          inputProps={{
            value: inputValue,
            onChange,
          }}
          companyLogoUrl={companyLogo}
          loginUrl="/login"
          showResultPage={showResultPage}
          forgotPasswordDoneUrl={forgotPasswordDoneIcon}
          signupUrl="/signup"
          onSubmit={onSubmit}
          inputError={inputError}
          process={loadingRequest}
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
