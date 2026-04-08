export const AccessControl = {
  admin: {
    allowedRoutes: ['/users', '/settings', '/reports'], // Admin access
    permissions: ['read', 'write'],
  },
  tenant: {
    allowedRoutes: ['/tenant/profile', '/tenant/payments'],
    permissions: ['read'], // Tenants can only read
  },
  owner: {
    allowedRoutes: ['/properties', '/leases'],
    permissions: ['read', 'write', 'delete'], // Full access
  },
};