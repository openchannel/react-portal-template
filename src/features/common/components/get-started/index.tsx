import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { OcGetStartedComponent } from '@openchannel/react-common-components/dist/ui/common/molecules';

import { useTypedSelector } from '../../hooks';

const GetStarted = () => {
  const history = useHistory();
  const { home } = useTypedSelector(({ cmsContent }) => cmsContent);

  const onClick = () => {
    history.push(home?.bottomCalloutButtonLocation || '/');
  };

  return (
    <div className="bg-container mt-5 py-8 min-height-auto">
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
