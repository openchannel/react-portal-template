import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { OcLoginComponent } from '@openchannel/react-common-components/dist/ui/auth/organisms';

import { ErrorResponse } from 'types';
import { nativeLogin } from 'features/common/store/session';
import { getSearchParams } from 'features/common/libs/helpers';
import { sendActivationCode } from '../../store/join';

import companyLogo from '../../../../../public/assets/img/company-logo-2x.png';
import './styles.scss';
import { useTypedSelector } from 'features/common/hooks';

const LoginPage = (): JSX.Element => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [serverErrorValidation, setServerErrorValidation] = React.useState(false);
  const [isUnverifiedEmail, setIsUnverifiedEmail] = React.useState(false);
  const searchParams = React.useMemo(() => getSearchParams(window.location.search), []);
  const { config, isSamlLogin } = useTypedSelector(({ oidc }) => oidc);
  React.useEffect(() => {
    if (isSamlLogin) {
      searchParams?.return &&  localStorage.setItem('redirectUrl', searchParams.return);
      window.open(`${config?.singleSignOnUrl}?RelayState=${window.location.origin}`, "_self");
    }
  },[]);

  const onActivationLinkClick = React.useCallback((email) => {
    dispatch(sendActivationCode(email));
  }, []);

  const onSubmit = React.useCallback(
    async ({
      email,
      password,
      remember,
    }: {
      email: string;
      password: string;
      remember: boolean;
    }) => {
      if (serverErrorValidation) {
        setServerErrorValidation(false);
      }
      if (isUnverifiedEmail) {
        setIsUnverifiedEmail(false);
      }

      try {
        await dispatch(nativeLogin({ email, password, isChecked: remember }));

        if (Object.keys(searchParams).includes('return')) {
          history.push(searchParams.return);
        } else {
          history.push('/');
        }
      } catch (e) {
        const error = e as ErrorResponse;
        if (error.response.data?.errors?.find((e) => e.code?.includes('_incorrect'))) {
          setServerErrorValidation(true);
        } else if (error.response.data?.errors?.find((e) => e.code === 'email_not_verified')) {
          setIsUnverifiedEmail(true);
        } else {
          notify.error(error.response?.data?.message ?? "Can't parse server error.");
        }
      }
    },
    [history, serverErrorValidation, searchParams],
  );

  return (
    <div className="bg-container pt-sm-5">
      <div className="login-position">
        {!isSamlLogin && (<OcLoginComponent
          signupUrl="/signup"
          forgotPwdUrl="/forgot-password"
          handleSubmit={onSubmit}
          onActivationLinkClick={onActivationLinkClick}
          companyLogoUrl={companyLogo}
          isIncorrectEmail={serverErrorValidation}
          isUnverifiedEmail={isUnverifiedEmail}
        />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
