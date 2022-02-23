import * as React from 'react';
import { OcFooter } from '@openchannel/react-common-components/dist/ui/common/organisms';

import { Header } from '../components';
import { useAuth, useCmsData, useScroll } from '../hooks';

import { SOCIAL_LINKS } from '../../../consts';

export const MainTemplate: React.FC = ({ children }) => {
  useScroll();
  const { header, footer, getCmsData } = useCmsData();
  const { checkSession, getAuthConfig, isConfigLoaded } = useAuth();

  React.useEffect(() => {
    getCmsData();

    const init = async () => {
      try {
        await checkSession();
      } catch {
        /*do nothing*/
      }

      if (!isConfigLoaded) {
        try {
          await getAuthConfig();
        } catch {
          /*do nothing*/
        }
      }
    };

    init();
  }, []);

  return (
    <>
      <Header cmsData={header} />
      {children}
      <OcFooter socialLinks={SOCIAL_LINKS} cmsData={footer} />
    </>
  );
};
