/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from 'redux';
import {
  InviteDeveloperModel,
  developerAccount,
  developerRoleService,
  UserAccountGridModel,
  userInvites,
  UsersGridParametersModel,
} from '@openchannel/react-common-services';
import { notify } from '@openchannel/react-common-components/dist/ui/common/atoms';
import { GetState } from '../../../../types';
import { UserData } from '../../../management/pages/my-company/types';
import {
  getAccountId,
  mapDevRoles,
  mapToGridUserFromInvite,
  mapToGridUserFromDeveloper,
  DevRoles,
} from '../utils';
import { ActionTypes } from './action-types';
import { SortQuery } from './types';

export const setRoles = (payload: DevRoles) => {
  return { type: ActionTypes.SET_LIST_ROLES, payload };
};
export const saveUserProperties = (payload: UsersGridParametersModel) => {
  return { type: ActionTypes.SET_USER_PROPERTIES, payload };
};
export const saveUserSortQuery = (payload: SortQuery) => {
  return { type: ActionTypes.SET_SORT_QUERY, payload };
};
const resetUserProperties = () => ({ type: ActionTypes.RESET_USER_PROPERTIES });

const getSortQuery = (sortBy: string, prevSortQuery: SortQuery): SortQuery => {
  return prevSortQuery.sortBy === sortBy
    ? { sortBy, sortOrder: prevSortQuery.sortOrder * -1 }
    : { sortBy, sortOrder: 1 };
};

export const getAllDevelopers =
  (pageNumber: number, sortQuery: SortQuery) => async (dispatch: Dispatch, getState: GetState) => {
    const {
      userInvites: { userProperties },
    } = getState();

    const newProperties = {
      ...userProperties,
      data: {
        ...userProperties.data,
      },
    };

    const oldInvites = [...userProperties.data.list];
    const sortQueryStr = JSON.stringify({ [sortQuery.sortBy]: sortQuery.sortOrder });
    const fetchData = await Promise.allSettled([
      userInvites.getDeveloperInvites(pageNumber, 10, sortQueryStr),
      developerAccount.getDeveloperAccounts(pageNumber, 10, sortQueryStr),
      developerRoleService.getDeveloperRoles(1, 100),
    ]);

    const [invites, accounts, roles] = fetchData;

    let nextInvites: UserAccountGridModel[] = [];
    //eslint-disable-next-line
    let nextAccount: any = [];
    let userRoles: DevRoles = {};

    if (roles.status === 'fulfilled') {
      userRoles = mapDevRoles(roles.value.data);
      dispatch(setRoles(userRoles));
    }
    if (invites.status === 'fulfilled') {
      nextInvites = invites.value.data.list.map((user: InviteDeveloperModel) =>
        mapToGridUserFromInvite(user, userRoles),
      );

      if (pageNumber > 1) {
        const lastInvitedDev = oldInvites.filter((user) => user.inviteStatus === 'INVITED').pop();

        if (lastInvitedDev) {
          oldInvites.splice(oldInvites.lastIndexOf(lastInvitedDev) + 1, 0, ...nextInvites);

          nextInvites = oldInvites;
        }
      }

      newProperties.data.pages = invites.value.data.pages;
      newProperties.data.pageNumber = invites.value.data.pageNumber;
    }

    if (accounts.status === 'fulfilled') {
      nextAccount = accounts.value.data.list.map((user) =>
        mapToGridUserFromDeveloper(user, userRoles),
      );
    }

    newProperties.data.list = [...nextInvites, ...nextAccount];
    dispatch(saveUserProperties(newProperties));
  };

export const sortMyCompany = (sortBy: string) => async (dispatch: Dispatch, getState: GetState) => {
  const {
    userInvites: { userProperties, sortQuery },
  } = getState();

  const nextSortQuery = getSortQuery(sortBy, sortQuery);
  dispatch(saveUserSortQuery(nextSortQuery));
  const nextSortQueryStr = JSON.stringify({ [nextSortQuery.sortBy]: nextSortQuery.sortOrder });

  const fetchDataSort = await Promise.allSettled([
    userInvites.getDeveloperInvites(1, 10, nextSortQueryStr),
    developerAccount.getDeveloperAccounts(1, 10, nextSortQueryStr),
    developerRoleService.getDeveloperRoles(1, 100),
  ]);

  const [invites, accounts, roles] = fetchDataSort;

  let nextInvites: UserAccountGridModel[] = [];
  //eslint-disable-next-line
  let nextAccount: any[] = [];
  let userRoles: DevRoles = {};

  if (roles.status === 'fulfilled') {
    userRoles = mapDevRoles(roles.value.data);
    dispatch(setRoles(userRoles));
  }

  if (invites.status === 'fulfilled') {
    nextInvites = invites.value.data.list.map((user) => mapToGridUserFromInvite(user, userRoles));
  }

  if (accounts.status === 'fulfilled') {
    nextAccount = accounts.value.data.list.map((user) =>
      mapToGridUserFromDeveloper(user, userRoles),
    );
  }

  dispatch(
    saveUserProperties({
      ...userProperties,
      data: {
        ...userProperties.data,
        list: [...nextInvites, ...nextAccount],
        pageNumber: 1,
      },
    }),
  );
};

export const clearUserProperties = () => (dispatch: Dispatch) => {
  dispatch(resetUserProperties());
};

export const inviteUser =
  (userData: UserData, templateId?: string) => async (dispatch: Dispatch, getState: GetState) => {
    try {
      await userInvites.sendDeveloperInvite('', userData, templateId);

      notify.success('Invitation sent');
      getAllDevelopers(1, getState().userInvites.sortQuery)(dispatch, getState);
    } catch {
      // do nothing
    }
  };

export const updateUser =
  (userData: UserData, inviteId?: string) => async (dispatch: Dispatch, getState: GetState) => {
    try {
      if (inviteId) {
        await userInvites.editDeveloperInvite(inviteId, userData);
      } else {
        await developerAccount.updateAccountFieldsForAnotherUser(
          getAccountId(userData),
          true,
          userData,
        );
      }

      notify.success('User details have been updated');
      getAllDevelopers(1, getState().userInvites.sortQuery)(dispatch, getState);
    } catch {
      // do nothing
    }
  };

const deleteUserFromResultArray =
  (user: UserAccountGridModel) => (dispatch: Dispatch, getState: GetState) => {
    const {
      userInvites: { userProperties },
    } = getState();

    const newUserProperties = { ...userProperties };
    if (newUserProperties.data.list?.length > 0) {
      const userIndex = newUserProperties.data.list.indexOf(user);
      if (userIndex >= 0) {
        newUserProperties.data.list.splice(userIndex, 1);
      }
    }
    dispatch(saveUserProperties(newUserProperties));
  };

export const deleteUserInvite =
  (dev: any, devId: string) => async (dispatch: Dispatch, getState: GetState) => {
    try {
      await userInvites.deleteDeveloperInvite(devId);
      notify.success('Invite has been deleted');
      deleteUserFromResultArray(dev)(dispatch, getState);
    } catch {
      // do nothing
    }
  };

export const deleteUserAccount =
  (dev: any, devId: string) => async (dispatch: Dispatch, getState: GetState) => {
    try {
      await developerAccount.deleteDevAccount(devId);
      notify.success('User has been deleted from your organization');
      deleteUserFromResultArray(dev)(dispatch, getState);
    } catch {
      // do nothing
    }
  };
