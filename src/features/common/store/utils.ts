import {
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

export type UserRoles = Record<string, string>;

interface GridUserAccount extends UserAccount {
  inviteStatus: string;
}

export const mapToGridUserFromInvite = (user: InviteUserModel, listRoles: UserRoles) => {
  return {
    ...user,
    created: user.createdDate!,
    inviteId: user.userInviteId,
    inviteToken: user.token,
    inviteStatus: 'INVITED',
    roles: toRoleName(listRoles, user.roles),
  } as UserAccountGridModel;
};

export const toRoleName = (listRoles: UserRoles, userRoles?: string[]): string[] => {
  return userRoles?.map((r) => listRoles[r]) || [];
};

export const mapToGridUserFromUser = (user: UserAccount, listRoles: UserRoles): GridUserAccount => {
  return {
    ...user,
    inviteStatus: 'ACTIVE',
    roles: toRoleName(listRoles, user.roles),
  };
};

export const mapRoles = (roles: Page<UserRoleResponse>): UserRoles => {
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
