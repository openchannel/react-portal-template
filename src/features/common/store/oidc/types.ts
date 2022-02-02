import type { UserManager } from 'oidc-client';

import { ActionTypes } from './action-types';

export interface Oidc {
  isLoading: boolean;
  isLoaded: boolean;
  isSsoLogin: boolean;
  isSamlLogin: boolean;
  userManager: UserManager | null;
  config: any;
}

export type Action =
  | {
      type: ActionTypes.SET_USER_MANAGER;
      payload: {
        userManager: UserManager | null;
        isSsoLogin: boolean;
        isSamlLogin: boolean;
        config: any;
      };
    }
  | {
      type: ActionTypes.START_LOADING;
    }
  | {
      type: ActionTypes.FINISH_LOADING;
    };
