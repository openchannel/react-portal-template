import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import { joinRoutes } from './features/join';
import { commonRoutes } from './features/common';
import { OidcWrapper } from './features/common/hocs';
import { managementRoutes } from './features/management';

// commonRoutes must be last in the array
const routes = [...joinRoutes, ...managementRoutes, ...commonRoutes];

export const Routes = (): JSX.Element => (
  <React.Suspense fallback={<div className="bg-container">Loading...</div>}>
    <Switch>
      {routes.map(({ Component, ...route }, key) => (
        <Route
          key={key}
          path={route.path}
          exact={route.exact}
          render={() =>
            route.private ? (
              <OidcWrapper>
                <Component />
              </OidcWrapper>
            ) : (
              <Component />
            )
          }
        />
      ))}
    </Switch>
  </React.Suspense>
);
