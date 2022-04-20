import { PermissionType, AccessLevel } from '@openchannel/react-common-services';
import { storage, auth } from '@openchannel/react-common-services';

export const hasCompanyPermission = () =>
  storage.hasAnyPermission([
    {
      type: PermissionType.ORGANIZATIONS,
      access: [AccessLevel.READ, AccessLevel.MODIFY, AccessLevel.DELETE],
    },
  ]);
export const isSSO = () => storage.getUserDetails()?.isSSO;
export const isUserLoggedIn = () => storage.isUserLoggedIn();
export const logout = () => auth.logOut();

export const checkIncludesUrl = (...args: string[]): boolean => {
  return !!args.find((url) => location.pathname.includes(url));
};
