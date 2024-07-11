export default [
  {
    action: 'create',
    roles: ['admin']
  },
  {
    action: 'edit',
    roles: ['admin', 'warranty_manager', 'admin_warranty', 'technical_leader', 'vice_admin_warranty']
  },
  {
    action: 'update',
    roles: ['admin', 'warranty_manager', 'admin_warranty', 'technical_leader', 'vice_admin_warranty']
  },
  {
    action: 'create_recept',
    roles: ['admin', 'warranty_manager', 'admin_warranty', 'technical_leader', 'vice_admin_warranty']
  },
  {
    action: 'delete',
    roles: ['admin', 'warranty_manager', 'admin_warranty', 'vice_admin_warranty']
  }
];
