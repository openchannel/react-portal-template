import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { storage } from '@openchannel/react-common-services';
import { OcNavigationBreadcrumbs } from '@openchannel/react-common-components/dist/ui/common/molecules';

import { MainTemplate } from '../../../common/templates';

import { page, myCompanyRoutes } from './constants';
import UserManagement from './user-management';
import CompanyDetails from './company-details';
import { InviteModalState, UserData } from './types';
import './styles.scss';

const MyCompany = (): JSX.Element => {
  const history = useHistory();
  const { pathname } = useLocation();

  const [inviteModal, updateInviteModal] = React.useState<InviteModalState>({
    isOpened: false,
    user: null,
  });

  const filterPagesByUserType = page.filter((page) => storage.hasAnyPermission(page.permissions));

  const onClickPass = React.useCallback(
    (e) => {
      history.push(e.target.dataset.link);
    },
    [history.push],
  );

  const openInviteModal = React.useCallback(() => {
    updateInviteModal({ isOpened: true, user: null });
  }, []);

  const openInviteModalWithUserData = React.useCallback((user: UserData) => {
    updateInviteModal({ isOpened: true, user });
  }, []);

  const closeInviteModal = React.useCallback(() => {
    updateInviteModal({ isOpened: false, user: null });
  }, []);

  return (
    <MainTemplate>
      <div className="bg-container my-company-nav height-unset">
        <OcNavigationBreadcrumbs
          pageTitle="My company"
          navigateText="Back"
          navigateClick={history.goBack}
          buttonText={
            // show button only if the selected page is a 'profile'
            pathname === myCompanyRoutes.userManagement ? 'Invite a member' : ''
          }
          buttonClick={openInviteModal}
        />
      </div>
      <div className="container my-company-container">
        <div className="row pt-5">
          <div className="col-lg-2 col-xl-3 col-xxl-2">
            <ul className="list-unstyled">
              {filterPagesByUserType.map((elem) => (
                <li className="py-1" key={elem.pageId}>
                  <span
                    className={`font-m ${pathname === elem.pageId ? 'active-link' : ''}`}
                    role="button"
                    tabIndex={0}
                    data-link={elem.pageId}
                    onClick={onClickPass}
                    onKeyDown={onClickPass}
                  >
                    {elem.placeholder}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-10 col-xl-9 col-xxl-10 mt-3 mt-lg-1 mb-8">
            {pathname === myCompanyRoutes.companyDetails && <CompanyDetails />}
            {pathname === myCompanyRoutes.userManagement && (
              <UserManagement
                inviteModal={inviteModal}
                openInviteModalWithUserData={openInviteModalWithUserData}
                closeInviteModal={closeInviteModal}
              />
            )}
          </div>
        </div>
      </div>
    </MainTemplate>
  );
};

export default MyCompany;
