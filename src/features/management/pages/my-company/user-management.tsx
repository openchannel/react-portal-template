import * as React from 'react';
import { useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { OcMenuUserGrid } from '@openchannel/react-common-components/dist/ui/management/organisms';
import { useTypedSelector } from '../../../common/hooks';
import { storage, Page } from '@openchannel/react-common-services';
import { OcConfirmationModalComponent } from '@openchannel/react-common-components/dist/ui/common/organisms';
import {
  getAllDevelopers,
  sortMyCompany,
  clearUserProperties,
  deleteUserInvite,
  deleteUserAccount,
} from '../../../common/store/dev-invites';

import { getUserByAction } from './utils';
import { DeveloperAccountGridModel, UserManagementProps } from './types';
import InviteDevModal from './components/invite-dev-modal';
import { initialConfirmDeleteUserModal } from './constants';

const UserManagement: React.FC<UserManagementProps> = ({
  inviteModal,
  openInviteModalWithUserData,
  closeInviteModal,
}) => {
  const dispatch = useDispatch();
  //eslint-disable-next-line
  const [state, setState] = React.useState<any>(initialConfirmDeleteUserModal);

  const { userProperties, sortQuery } = useTypedSelector(({ userInvites }) => userInvites);
  const { data } = userProperties;
  const { pageNumber, pages, list } = data as unknown as Page<DeveloperAccountGridModel>;

  const catchSortChanges = (sortBy: string) => {
    dispatch(sortMyCompany(sortBy));
  };

  const loadPage = (page: number) => {
    dispatch(getAllDevelopers(page, sortQuery));
  };

  React.useEffect(() => {
    loadPage(pageNumber);

    return () => {
      dispatch(clearUserProperties());
    };
  }, []);
  // eslint-disable-next-line
  const onMenuClick = (userAction: any) => {
    const user = getUserByAction(userAction, list);
    if (user) {
      switch (userAction.action) {
        case 'DELETE':
          openConfirmModal(user);
          break;
        case 'EDIT':
          openInviteModalWithUserData(user);
          break;
        default:
          console.error('Action is not implemented');
      }
    } else {
      console.error("Can't find user from mail array by action");
    }
  };
  //edit must be v2/invites/developers/byId/:id
  const closeConfirmModal = () => {
    setState(initialConfirmDeleteUserModal);
  };
  // eslint-disable-next-line
  const openConfirmModal = (user: any) => {
    if (user?.inviteStatus === 'INVITED') {
      setState({
        isOpened: true,
        type: 'invite',
        modalTitle: 'Delete invite',
        modalText: 'Are you sure you want to delete this invite?',
        confirmButtonText: 'Yes, delete invite',
        userId: user.developerInviteId,
        user: user,
      });
    } else if (user?.inviteStatus === 'ACTIVE') {
      if (user.userAccountId === storage.getUserDetails()?.individualId) {
        setState({
          isOpened: true,
          type: 'user',
          modalTitle: 'Delete user',
          modalText: "You can't delete yourself!",
          confirmButtonText: 'Ok',
          rejectButtonText: 'Close',
          userId: user.userAccountId,
          user: user,
        });
      } else {
        setState({
          isOpened: true,
          type: 'user',
          modalTitle: 'Delete user',
          modalText: 'Delete this user from the marketplace now?',
          confirmButtonText: 'Yes, delete user',
          userId: user.userAccountId,
          user: user,
        });
      }
    }
  };

  const deleteUserInModal = async () => {
    if (state.type === 'invite') {
      await dispatch(deleteUserInvite(state.user, state.userId!));
    }

    if (state.type === 'user') {
      if (state?.user?.userAccountId !== storage.getUserDetails()?.individualId) {
        await dispatch(deleteUserAccount(state.user, state.userId!));
      }
    }

    closeConfirmModal();
  };

  return (
    <>
      <InviteDevModal
        userData={inviteModal.user}
        isOpened={inviteModal.isOpened}
        closeModal={closeInviteModal}
      />
      <OcConfirmationModalComponent
        isOpened={state.isOpened}
        onSubmit={deleteUserInModal}
        onClose={closeConfirmModal}
        onCancel={closeConfirmModal}
        modalTitle={state.modalTitle}
        modalText={state.modalText}
        confirmButtonText={state.confirmButtonText}
        confirmButtonType="danger"
        rejectButtonText={state.rejectButtonText}
      />

      <InfiniteScroll
        dataLength={list.length}
        next={() => loadPage(pageNumber + 1)}
        hasMore={pageNumber < pages}
        loader={null}
        style={{ overflow: 'initial' }}
      >
        <OcMenuUserGrid
          onMenuClick={onMenuClick}
          onSort={catchSortChanges}
          properties={userProperties}
          mode="developer"
        />
      </InfiniteScroll>
    </>
  );
};

export default UserManagement;
