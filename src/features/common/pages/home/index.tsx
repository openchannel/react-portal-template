import { HomeContent } from 'features/common/components';
import GetStarted from 'features/common/components/get-started';
import * as React from 'react';
import { MainTemplate } from '../../templates';

import './style.scss';

export const HomePage: React.FC = () => {
  return (
    <MainTemplate>
      <HomeContent />
      <GetStarted />
    </MainTemplate>
  );
};

export default HomePage;
