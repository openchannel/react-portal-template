import * as React from 'react';
import { OcResetPasswordComponent } from '@openchannel/react-common-components/dist/ui/auth/organisms';
import companyLogo from '../../../../../public/assets/img/company-logo-2x.png';
import {
  getUserToken,
  invalidMassagePassword,
  LocationParams,
  validatePassword,
} from '../constants';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { resetPassword } from '../../../common/store/session/actions';
import { isEmptyInputValue } from '@openchannel/react-common-components/dist/ui/form/lib';
import './styles.scss';

const ResetPassword = (): JSX.Element => {
  const [loadingRequest, setLoadingRequest] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [inputError, setInputError] = React.useState('');
  const [validationError, setValidationError] = React.useState(false);

  const dispatch = useDispatch();
  const location = useLocation<LocationParams>();
  const history = useHistory();

  React.useEffect(() => {
    if (!getUserToken(location)) {
      history.replace('/login');
    }
  }, []);

  const onChange = React.useCallback((e) => {
    setInputValue(e.target.value);
    if (validatePassword()(e.target.value) !== null) {
      setInputError(invalidMassagePassword());
      setValidationError(true);
    } else {
      setInputError('');
      setValidationError(false);
    }
  }, []);

  const onSubmit = React.useCallback(async () => {
    if (validatePassword()(inputValue) === null && !isEmptyInputValue(inputValue)) {
      try {
        setLoadingRequest(true);
        const userToken = getUserToken(location) || '';
        await dispatch(resetPassword({ newPassword: inputValue, code: userToken }));
        history.replace('/login');
        setInputValue('');
        setLoadingRequest(false);
      } catch {
        setLoadingRequest(false);
      }
    }
  }, [inputValue, getUserToken]);
  return (
    <div className="bg-container pt-sm-5 ">
      <div className="reset-position">
        <OcResetPasswordComponent
          handleButtonClick={onSubmit}
          inputProps={{
            value: inputValue,
            onChange,
          }}
          companyLogoUrl={companyLogo}
          customClass={''}
          loginUrl="/login"
          signupUrl="/signup"
          validationError={validationError}
          inputError={inputError}
          process={loadingRequest}
        />
      </div>
    </div>
  );
};

export default ResetPassword;
