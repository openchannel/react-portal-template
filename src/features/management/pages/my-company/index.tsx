import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { storage } from '@openchannel/react-common-services';
import { OcNavigationBreadcrumbs } from '@openchannel/react-common-components/dist/ui/common/molecules';

import { MainTemplate } from '../../../common/templates';

import { page, pageIds } from './constants';
import UserManagement from './user-management';
import CompanyDetails from './company-details';
import { InviteModalState, UserData } from './types';
import './styles.scss';

const MyCompany = (): JSX.Element => {
  const history = useHistory();
  const [selectedPage, setSelectedPage] = React.useState(pageIds.company);
  const [inviteModal, updateInviteModal] = React.useState<InviteModalState>({
    isOpened: false,
    user: null,
  });

  const filterPagesByUserType = page.filter((page) => storage.hasAnyPermission(page.permissions));

  const onClickPass = React.useCallback((e) => {
    setSelectedPage(e.target.dataset.link);
  }, []);

  const openInviteModal = React.useCallback(() => {
    updateInviteModal({ isOpened: true, user: null });
  }, []);

  const openInviteModalWithUserData = React.useCallback((user: UserData) => {
    updateInviteModal({ isOpened: true, user });
  }, []);

  const closeInviteModal = React.useCallback(() => {
    updateInviteModal({ isOpened: false, user: null });
  }, []);

  React.useEffect(() => {
    switch (selectedPage) {
      case pageIds.company:
        history.replace('/my-company/company-details');
        break;
      case pageIds.profile:
        history.replace('/my-company/user-management');
        break;
      default:
        break;
    }
  }, [selectedPage]);

  return (
    <MainTemplate>
      <div className="bg-container my-company-nav height-unset">
        <OcNavigationBreadcrumbs
          pageTitle="My company"
          navigateText="Back"
          navigateClick={history.goBack}
          buttonText={
            // show button only if the selected page is a 'profile'
            selectedPage === pageIds.profile ? 'Invite a member' : ''
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
                    className={`font-m ${selectedPage === elem.pageId ? 'active-link' : ''}`}
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
            {selectedPage === pageIds.company && <CompanyDetails />}
            {selectedPage === pageIds.profile && (
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
