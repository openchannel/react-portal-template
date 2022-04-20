import { combineReducers } from 'redux';

import {
  cmsContentReducer as cmsContent,
  sessionReducer as session,
  oidcReducer as oidc,
  userTypesReducer as userTypes,
  devTypesReducer as userDevTypes,
  userInvitesReducer as userInvites,
} from './features/common/store';
import { joinReducer as join } from './features/join/store';
import { appDataReducer as appData } from './features/management/store';

export const rootReducer = combineReducers({
  cmsContent,
  oidc,
  session,
  userTypes,
  userInvites,
  userDevTypes,
  join,
  appData,
});
