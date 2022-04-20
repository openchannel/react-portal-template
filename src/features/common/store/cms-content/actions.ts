import { Dispatch } from 'redux';
import { siteContent, cmsSiteContent } from '@openchannel/react-common-services';

import { DEFAULT_CMS_TYPE } from '../../../../consts';
import defaultCMSData from '../../../../consts/_defaultContent.json';

import { ActionTypes } from './action-types';

const startLoading = () => ({ type: ActionTypes.START_LOADING });
const finishLoading = () => ({ type: ActionTypes.FINISH_LOADING });
const setCmsContent = (cmsData?: unknown) => {
  const app = cmsSiteContent.getContentByPaths(
    cmsData,
    defaultCMSData,
  )({
    siteTitle: 'site.title',
    siteFaviconHref: 'site.favicon',
  });

  const header = cmsSiteContent.getContentByPaths(
    cmsData,
    defaultCMSData,
  )({
    headerLogoURL: 'default-header.logo',
    headerItemsDFA: 'default-header.menu.items',
  });

  const home = cmsSiteContent.getContentByPaths(
    cmsData,
    defaultCMSData,
  )({
    pageInfoTitle: 'big-hero.title',
    pageInfoSubtext: 'big-hero.subtext',
    bottomCalloutHeader: 'content-callout.title',
    bottomCalloutImageURL: 'content-callout.image',
    bottomCalloutDescription: 'content-callout.body',
    bottomCalloutButtonText: 'content-callout.button.text',
    bottomCalloutButtonLocation: 'content-callout.button.location',
  });

  const login = cmsSiteContent.getContentByPaths(
    cmsData,
    defaultCMSData,
  )({
    loginImageURL: 'login.logo',
  });

  const footer = cmsSiteContent.getContentByPaths(
    cmsData,
    defaultCMSData,
  )({
    logoImageURL: 'default-footer.logo',
    columnsDFA: 'default-footer.menu.items',
  });

  return {
    type: ActionTypes.SET_CMS_CONTENT,
    payload: {
      cmsData,
      app,
      header,
      home,
      login,
      footer,
    },
  };
};

export const fetchCmsContent = () => async (dispatch: Dispatch) => {
  dispatch(startLoading());

  try {
    const { data } = await siteContent.getAllContent(1, 1, '', `{'type':'${DEFAULT_CMS_TYPE}'}`);

    dispatch(setCmsContent(data.list[0]?.customData));
    dispatch(finishLoading());
  } catch (error) {
    dispatch(setCmsContent());
    dispatch(finishLoading());

    throw error;
  }
};
