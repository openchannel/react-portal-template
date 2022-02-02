import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { DropdownModel } from '@openchannel/react-common-components';
import { OcProfileNavbar } from '@openchannel/react-common-components/dist/ui/common/molecules';

import { useMedia, useTypedSelector } from '../../hooks';
import { hasCompanyPermission, isSSO, checkIncludesUrl } from './utils';
import { logout } from '../../store/session';
import logo from '../../../../../public/assets/img/logo-company.png';
import { ReactComponent as ButtonDown } from '../../../../../public/assets/img/select-down.svg';

import './style.scss';

// eslint-disable-next-line
export const Header = ({ cmsData }: any): JSX.Element => {
  const { isSamlLogin } = useTypedSelector(({ oidc }) => oidc);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileMenuCollapsed, setIsMobileMenuCollapsed] = React.useState(false);
  const history = useHistory();
  const isMobile = useMedia();
  const dispatch = useDispatch();
  const { isExist } = useTypedSelector((store) => store.session);

  React.useEffect(() => {
    isMobile ? setIsCollapsed(false) : setIsCollapsed(true);
  }, [isMobile]);

  const options = [
    !isSSO() ? { label: 'My Profile', value: '/my-profile/profile-details' } : undefined,
    hasCompanyPermission()
      ? { label: 'My Company', value: '/my-company/company-details' }
      : undefined,
    { label: 'Logout', value: 'logout' },
  ].filter(Boolean) as DropdownModel<string>[];

  const closedMenu = (): void => {
    if (!isMobile) return;
    setIsMobileMenuCollapsed(false);
    setIsCollapsed(false);
  };

  const toggleMenu = React.useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const toggleMenuMore = React.useCallback(() => {
    setIsMobileMenuCollapsed((prev) => !prev);
  }, []);

  const onMenuLinkClick = React.useCallback(
    async (e) => {
      if (e.target.dataset.href !== 'logout') {
        history.push(e.target.dataset.href);
      } else {
        await dispatch(logout());

        if (location.pathname !== '/') {
          history.replace('/');
        }
      }
    },
    [history.push, history.replace, location.pathname],
  );

  const onProfileNavbarClick = React.useCallback(
    async ({ value }) => {
      if (value !== 'logout') {
        history.push(value);
      } else {
        await dispatch(logout());

        if (location.pathname !== '/') {
          history.replace('/');
        }
      }
    },
    [history.push, history.replace, location.pathname],
  );

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-white">
      <div className="container">
        <div className="navbar-wrapper">
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="brand-logo" className="company-logo" />
          </Link>
          <button
            className="navbar-toggler p-0"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={toggleMenu}
          >
            <div className={`cursor-pointer ${!isCollapsed ? 'navbar-icon' : 'close-icon'}`} />
          </button>
        </div>
        <Link to="#main-content" className="skip-link">
          Skip to main content
        </Link>
        {isCollapsed && (
          <div className="navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav justify-content-end w-100 mb-0">
              {cmsData?.headerItemsDFA?.map(
                // eslint-disable-next-line
                (item: any) => {
                  const validPath = item.location || '/';
                  return (
                    <li
                      className={`nav-item ${location.pathname === validPath ? 'active' : ''}`}
                      key={validPath}
                    >
                      <Link to={validPath} className="nav-link cursor-pointer" onClick={closedMenu}>
                        {item.label}
                      </Link>
                    </li>
                  );
                },
              )}
              {isExist && (
                <li className="nav-item">
                  <div className="options-wrapper">
                    <OcProfileNavbar
                      username="More"
                      options={options}
                      initials=""
                      onSelect={onProfileNavbarClick}
                    />
                  </div>
                </li>
              )}
              {isMobile && isExist && (
                <>
                  <li className="nav-item">
                    <div
                      className={`nav-item collaps-none justify-content-between align-items-center ${
                        checkIncludesUrl('/management/profile', '/management/company')
                          ? 'active'
                          : ''
                      }`}
                      onClick={toggleMenuMore}
                      role="button"
                      onKeyDown={toggleMenuMore}
                      tabIndex={0}
                    >
                      <span className="nav-link">More</span>
                      <div className={`pr-3 ${isMobileMenuCollapsed ? 'rotate-img' : ''}`}>
                        <ButtonDown
                          className={`${
                            checkIncludesUrl('/management/profile', '/management/company')
                              ? ''
                              : 'change-icon-color'
                          }`}
                        />
                      </div>
                    </div>
                  </li>
                  <div className="collaps-items">
                    {
                      <div
                        id="collapsMoreContent"
                        className={`collapse ${isMobileMenuCollapsed ? 'show' : ''}`}
                      >
                        <ul className="navbar-nav ml-5">
                          {options.map((item) => (
                            <li className="nav-item" key={item.value}>
                              <span
                                className="nav-link cursor-pointer"
                                role="button"
                                tabIndex={0}
                                data-href={item.value}
                                onClick={onMenuLinkClick}
                                onKeyDown={onMenuLinkClick}
                              >
                                {item.label}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    }
                  </div>
                </>
              )}
            </ul>
            {!isExist && (
              <div className="d-flex my-2 my-lg-0 ml-0 ml-md-6 auth-button">
                <Link className="btn header-login-btn header-btn" to="/login">
                  Log in
                </Link>
               {!isSamlLogin && (
                <Link className="btn btn-primary header-btn ml-md-2" to="/signup">
                  Sign up
                </Link>
               )}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
