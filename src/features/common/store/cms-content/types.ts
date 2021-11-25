import type { FooterColumn } from '@openchannel/react-common-components';

import { ActionTypes } from './action-types';

type ContentItem = null | Record<string, any>;

type FooterContent =
  | null
  | Record<string, never>
  | {
      logoImageURL: string;
      columnsDFA: FooterColumn[];
    };

export interface CmsContent {
  isLoading: boolean;
  isLoaded: boolean;
  cmsData: ContentItem;
  app: ContentItem;
  header: ContentItem;
  home: ContentItem;
  login: ContentItem;
  footer: FooterContent;
}

export type Action =
  | {
      type: ActionTypes.SET_CMS_CONTENT;
      payload: {
        cmsData: ContentItem;
        app: ContentItem;
        header: ContentItem;
        home: ContentItem;
        login: ContentItem;
        footer: FooterContent;
      };
    }
  | {
      type: ActionTypes.START_LOADING;
    }
  | {
      type: ActionTypes.FINISH_LOADING;
    };
