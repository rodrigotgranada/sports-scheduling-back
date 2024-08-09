export const permissions = {
    viewUsers: ['admin', 'owner'],
    editUserFields: {
      admin: ['firstName', 'lastName', 'email', 'phone', 'foto'],
      owner: ['firstName', 'lastName', 'email', 'phone', 'cpf', 'isActive', 'role', 'foto']
    },
    deleteUser: ['owner'],
    blockUser: ['admin', 'owner'],
    createUser: {
      admin: ['firstName', 'lastName', 'cpf', 'email', 'password', 'foto', 'isActive'],
      owner: ['firstName', 'lastName', 'cpf', 'email', 'password', 'foto', 'isActive', 'role']
    }
  };
  