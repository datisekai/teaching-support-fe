export default [
  {
    action: 'create',
    roles: ['admin', 'warranty_manager', 'admin_warranty', 'vice_admin_warranty']
  },
  {
    action: 'edit',
    roles: ['admin', 'warranty_manager', 'admin_warranty', 'vice_admin_warranty', 'technician']
  },
  {
    action: 'update',
    roles: ['admin', 'warranty_manager', 'admin_warranty', 'vice_admin_warranty']
  },
  {
    action: 'export',
    roles: ['admin', 'warranty_manager', 'admin_warranty', 'vice_admin_warranty']
  },
  {
    action: 'delete',
    roles: ['admin']
  },
  {
    action: 'create_reimbursement',
    roles: ['admin', 'warranty_manager', 'admin_warranty', 'vice_admin_warranty', 'technician']
  },
];
