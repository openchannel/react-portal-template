import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { isEmptyInputValue } from '@openchannel/react-common-components/dist/ui/form/lib';
import { OcResendActivation } from '@openchannel/react-common-components/dist/ui/auth/organisms';

import companyLogo from '../../../../../public/assets/img/company-logo-2x.png';
import { resendActivationCode } from '../../../common/store/session';

import { invalidMassageEmail, requiredField, validateEmail } from '../constants';

import './styles.scss';

const ResendActivatePage = (): JSX.Element => {
  const [inputValue, setInputValue] = React.useState('');
  const [inputError, setInputError] = React.useState('');
  const [loadingRequest, setLoadingRequest] = React.useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const onChange = React.useCallback((e: { target: HTMLInputElement }) => {
    setInputValue(e.target.value);
    if (validateEmail()(e.target.value) !== null) {
      setInputError(invalidMassageEmail);
    } else if (isEmptyInputValue(e.target.value)) {
      setInputError(requiredField);
    } else {
      setInputError('');
    }
  }, []);

  const onSubmit = React.useCallback(async () => {
    if (validateEmail()(inputValue) === null && !isEmptyInputValue(inputValue)) {
      try {
        setLoadingRequest(true);
        await dispatch(resendActivationCode(inputValue));
        history.push('/login');
      } catch {
        setLoadingRequest(false);
      }
    }
  }, [inputValue]);

  return (
    <div className="bg-container pt-sm-5">
      <div className="resend-activation-position">
        <OcResendActivation
          companyLogoUrl={companyLogo}
          signupUrl="/signup"
          loginUrl="/login"
          inputProps={{
            value: inputValue,
            onChange,
          }}
          inputError={inputError}
          onSubmit={onSubmit}
          process={loadingRequest}
        />
      </div>
    </div>
  );
};

export default ResendActivatePage;
