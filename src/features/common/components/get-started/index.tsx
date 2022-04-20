import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { OcGetStartedComponent } from '@openchannel/react-common-components/dist/ui/common/molecules';

import { useTypedSelector } from '../../hooks';
import { setSession } from 'features/common/store';

const GetStarted = () => {
  const history = useHistory();
  const search = useLocation().search;
  const { home } = useTypedSelector(({ cmsContent }) => cmsContent);

  const onClick = () => {
    history.push(home?.bottomCalloutButtonLocation || '/');
  };

  React.useEffect(() => {
    const searchParams = new URLSearchParams(search);
    const accessToken = searchParams.get('jwtAccessToken');
    const refreshToken = searchParams.get('jwtRefreshToken');

    if (accessToken && refreshToken) {
      setSession({accessToken, refreshToken});
      const redirectUrl = localStorage.getItem('redirectUrl') ? localStorage.getItem('redirectUrl') as string : '/';
      history.push(redirectUrl)
      localStorage.removeItem('redirectUrl');
    }
  },[]);

  return (
    <div className="home__register bg-container min-height-auto">
      <div className="container">
        <OcGetStartedComponent
          getStartedType="home"
          getStartedHeader={home?.bottomCalloutHeader}
          getStartedDescription={home?.bottomCalloutDescription}
          getStartedButtonText={home?.bottomCalloutButtonText}
          getStartedImage={home?.bottomCalloutImageURL}
          onClick={onClick}
        />
      </div>
    </div>
  );
};

export default GetStarted;
