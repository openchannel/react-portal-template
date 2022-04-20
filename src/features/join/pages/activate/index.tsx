import * as React from 'react';
import { OcActivation } from '@openchannel/react-common-components/dist/ui/auth/organisms';
import companyLogo from '../../../../../public/assets/img/logo-company-2x.png';
import { getUserToken, LocationParams, requiredField } from '../constants';
import { isEmptyInputValue } from '@openchannel/react-common-components/dist/ui/form/lib';
import { useDispatch } from 'react-redux';
import { activeUserAccount } from '../../../common/store/session/actions';
import { useHistory, useLocation } from 'react-router-dom';
import './styles.scss';

const ActivatePage = (): JSX.Element => {
  const location = useLocation<LocationParams>();
  const userToken = getUserToken(location);
  const [loadingRequest, setLoadingRequest] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(userToken || '');
  const [inputError, setInputError] = React.useState('');
  const dispatch = useDispatch();
  const history = useHistory();

  const onChange = React.useCallback((e: { target: HTMLInputElement }) => {
    setInputValue(e.target.value);
    if (isEmptyInputValue(e.target.value)) {
      setInputError(requiredField);
    } else {
      setInputError('');
    }
  }, []);

  const onSubmit = React.useCallback(async () => {
    if (!isEmptyInputValue(inputValue)) {
      try {
        setLoadingRequest(true);
        await dispatch(activeUserAccount(inputValue));
        history.push('/login');
        setInputValue('');
        setLoadingRequest(false);
        // eslint-disable-next-line
      } catch (e: any) {
        if (e.response?.status === 400) {
          setInputError(e.response?.data['validation-errors'][0].message);
          setLoadingRequest(false);
        }
      }
    }
    if (isEmptyInputValue(inputValue)) {
      setInputError(requiredField);
    }
  }, [inputValue]);

  return (
    <div className="bg-container pt-sm-5">
      <div className="activation-position">
        <OcActivation
          signupUrl="/signup"
          companyLogoUrl={companyLogo}
          resendActivationUrl="/resend-activation"
          inputProps={{
            value: inputValue,
            onChange,
          }}
          inputError={inputError}
          handleButtonClick={onSubmit}
          process={loadingRequest}
        />
      </div>
    </div>
  );
};

export default ActivatePage;
