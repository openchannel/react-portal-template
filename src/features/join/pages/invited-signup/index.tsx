import * as React from 'react';
import { set, merge } from 'lodash';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { OcEditUserFormConfig } from '@openchannel/react-common-components';
import { OcSignupComponent } from '@openchannel/react-common-components/dist/ui/auth/organisms';

import companyLogo from '../../../../../public/assets/img/company-logo-2x.png';
import { useTypedSelector } from 'features/common/hooks';

import { getUserInviteInfoByToken, sendInvite } from '../../store/join';

import './styles.scss';
import { SignUpByInviteRequest } from '@openchannel/react-common-services';

const TERMS_OF_SERVICE_LINK = 'https://my.openchannel.io/terms-of-service';
const DATA_PROCESSING_POLICY_LINK = 'https://my.openchannel.io/data-processing-policy';

const InvitedSignUpPage = (): JSX.Element => {
  const { inviteId } = useParams<{ inviteId?: string }>();
  const history = useHistory();
  const dispatch = useDispatch();
  const [formConfigs, setFormConfigs] = React.useState<OcEditUserFormConfig[]>([]);
  const [isExpired, setIsExpired] = React.useState(false);
  const formWrapperRef = React.useRef<HTMLDivElement>(null);
  const userInviteData = useTypedSelector(({ join }) => join.userInviteData);

  React.useEffect(() => {
    if (!inviteId) {
      return history.replace('/');
    }

    const loadInfo = async () => {
      const info = await dispatch(getUserInviteInfoByToken(inviteId));
      const { redirect, isExpired, formConfig } = info as unknown as {
        redirect: boolean;
        isExpired: boolean;
        formConfig: OcEditUserFormConfig;
      };

      if (redirect) {
        return history.replace('/');
      }

      setIsExpired(isExpired);
      setFormConfigs([formConfig]);
    };

    loadInfo();
  }, []);

  React.useEffect(() => {
    if (formConfigs.length > 0 && formWrapperRef.current) {
      // disable email input after form is mounted
      setTimeout(() => {
        const emailInput = formWrapperRef.current?.querySelector('#email');
        emailInput?.setAttribute('disabled', 'true');
      }, 0);
    }
  }, [formConfigs]);

  const onSubmit = React.useCallback(
    async (values, { setSubmitting }) => {
      delete values.terms;

      const formData = Object.entries(values).reduce((fd, [key, value]) => {
        set(fd, `${key}`, value);

        return fd;
      }, {} as SignUpByInviteRequest);

      try {
        await dispatch(sendInvite(merge(userInviteData, formData)));
        history.replace('/login');
      } catch {
        setSubmitting(false);
      }
    },
    [userInviteData, history.replace],
  );

  return (
    <div className="bg-container pt-sm-5">
      <div ref={formWrapperRef} className="signup-position">
        {isExpired && <h5 className="text-primary">Sorry! Your invite token has been expired!</h5>}
        {!isExpired && formConfigs.length > 0 && (
          <OcSignupComponent
            formConfigs={formConfigs}
            onSubmit={onSubmit}
            companyLogoUrl={companyLogo}
            enablePasswordField={false}
            enableTermsCheckbox
            ordinaryTermsDescription={
              <div className="font-s">
                I agree to&nbsp;
                <a
                  className="font-s font-med"
                  href={TERMS_OF_SERVICE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>
                &nbsp;and&nbsp;
                <a
                  className="font-s font-med"
                  href={DATA_PROCESSING_POLICY_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Data Processing Policy
                </a>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
};

export default InvitedSignUpPage;
