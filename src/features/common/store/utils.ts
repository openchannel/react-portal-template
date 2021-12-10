import {
  DeveloperAccountModel,
  DeveloperRoleResponse,
  InviteDeveloperModel,
  InviteUserModel,
  Page,
  UserAccount,
  UserAccountGridModel,
  UserRoleResponse,
} from '@openchannel/react-common-services';
import { UserData } from '../../management/pages/my-company/types';

interface ValidationError {
  field: string;
  message: string;
}

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
      'validation-errors'?: ValidationError[];
    };
  };
}

interface NormalizedError {
  message: string;
  errors?: Record<string, [string]>;
}

export const normalizeError = (e: unknown): NormalizedError => {
  const error = e as ErrorResponse;
  const message = error.response?.data?.message || 'Unknown error';
  const validationErrors = error.response?.data?.['validation-errors'];
  if (validationErrors != null && validationErrors?.length > 0) {
    const errors = validationErrors.reduce((acc, error: ValidationError) => {
      acc[error.field] = [error.message];
      return acc;
    }, {} as Record<string, [string]>);

    return { message, errors };
  }

  return { message };
};

export type DevRoles = Record<string, string>;
export type UserRoles = Record<string, string>;

interface GridUserAccount extends UserAccount {
  inviteStatus: string;
}

export const toRoleName = (listRoles: DevRoles, userRoles?: string[]): string[] => {
  return userRoles?.map((r) => listRoles[r]) || [];
};

export const mapToGridUserFromInvite = (user: InviteUserModel, listRoles: DevRoles) => {
  return {
    ...user,
    created: user.createdDate!,
    inviteId: user.userInviteId,
    inviteToken: user.token,
    inviteStatus: 'INVITED',
    roles: toRoleName(listRoles, user.roles),
  } as UserAccountGridModel;
};

export const mapToGridDevFromInvite = (developer: InviteDeveloperModel, listRoles: DevRoles) => {
  return {
    ...developer,
    name: developer.name,
    email: developer.email,
    customData: developer.customData,
    userId: developer.developerId,
    userAccountId: developer.developerAccountId,
    created: developer.createdDate,
    inviteId: developer.developerInviteId,
    inviteToken: developer.token,
    inviteStatus: 'INVITED',
    roles: toRoleName(listRoles, developer.roles),
  } as UserAccountGridModel;
};

export const mapToGridUserFromUser = (user: UserAccount, listRoles: DevRoles): GridUserAccount => {
  return {
    ...user,
    name: user.name,
    email: user.email,
    customData: user.customData,
    userId: user.userId,
    userAccountId: user.userAccountId,
    created: user.created,
    inviteStatus: 'ACTIVE',
    roles: toRoleName(listRoles, user.roles),
  };
};

export const mapToGridUserFromDeveloper = (
  developer: DeveloperAccountModel,
  listRoles: DevRoles,
): UserAccountGridModel => {
  return {
    ...developer,
    name: developer.name,
    email: developer.email,
    customData: developer.customData,
    userId: developer.developerId,
    userAccountId: developer.developerAccountId,
    created: developer.created,
    inviteStatus: 'ACTIVE',
    roles: toRoleName(listRoles, developer.roles),
  } as UserAccountGridModel;
};

export const mapDevRoles = (roles: Page<DeveloperRoleResponse>): DevRoles => {
  return roles.list.reduce((acc, val) => {
    acc[val.developerRoleId] = val.name;
    return acc;
  }, {} as DevRoles);
};

export const mapUserRoles = (roles: Page<UserRoleResponse>): UserRoles => {
  return roles.list.reduce((acc, val) => {
    acc[val.userRoleId] = val.name;
    return acc;
  }, {} as UserRoles);
};

export const getAccountId = (userData: UserData): string => {
  if (userData?.userAccountId) {
    return userData.userAccountId;
  } else if (userData?.developerAccountId) {
    return userData.developerAccountId as string;
  }
  return '';
};
