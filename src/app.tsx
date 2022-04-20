import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { instance } from '@openchannel/react-common-services';
import { OcNotificationContainer } from '@openchannel/react-common-components/dist/ui/common/atoms';

import { initProgressBar } from '@openchannel/react-common-services/dist';
import { CsrfWrapper } from './features/common/hocs';
import { Helmet } from './features/common/molecules';
import { Routes } from './routes';
import { store } from './store';
import settings from './settings';

import './features/common/libs/interceptors';
import '@openchannel/react-common-components'; // it's styles
import './theme.scss';
import './styles.scss';

instance.init({
  url: settings.PRODUCTION ? settings.API_URL : settings.API_URL_DEVELOPMENT,
  headerName: 'X-CSRF-TOKEN',
});
initProgressBar();

export const App = (): JSX.Element => {
  return (
    <>
      <Helmet />
      <OcNotificationContainer />
      <CsrfWrapper>
        <BrowserRouter>
          <Provider store={store}>
            <Routes />
          </Provider>
        </BrowserRouter>
      </CsrfWrapper>
    </>
  );
};
