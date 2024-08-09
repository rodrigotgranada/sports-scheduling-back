// src/config/admin-config.ts
export const adminConfig = {
    canViewUsers: (role: string) => ['admin', 'owner'].includes(role),
    getEditableFields: (role: string) => {
      if (role === 'owner') {
        return ['firstName', 'lastName', 'cpf', 'phone', 'email', 'password', 'isActive', 'role'];
      } else if (role === 'admin') {
        return ['firstName', 'lastName', 'cpf', 'phone', 'email', 'password', 'isActive'];
      }
      return [];
    },
    canDeleteUser: (role: string) => role === 'owner',
    canBlockUser: (role: string) => role === 'owner' || role === 'admin',
    getCreateUserFields: (role: string) => {
      if (role === 'owner') {
        return ['firstName', 'lastName', 'cpf', 'phone', 'email', 'password', 'isActive', 'role'];
      } else if (role === 'admin') {
        return ['firstName', 'lastName', 'cpf', 'phone', 'email', 'password', 'isActive'];
      }
      return [];
    },
  };
  