import { combineReducers } from 'redux';

import {
  cmsContentReducer as cmsContent,
  sessionReducer as session,
  oidcReducer as oidc,
} from './features/common/store';

export const rootReducer = combineReducers({
  cmsContent,
  oidc,
  session,
});
