export const ROLES = {
  ADMIN: 'ADMIN',
  ANALYST: 'ANALYST'
}

export const hasAdminAccess = (userRole) => {
  return userRole === ROLES.ADMIN
}

export const hasAnalystAccess = (userRole) => {
  return userRole === ROLES.ADMIN || userRole === ROLES.ANALYST
}

export const canViewAnalysts = (userRole) => {
  return userRole === ROLES.ADMIN
}

export const canManageTokens = (userRole) => {
  return userRole === ROLES.ADMIN
}