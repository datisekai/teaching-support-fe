export default [
  {
    action: 'create',
    roles: ['admin', 'warranty_manager']
  },
  {
    action: 'edit',
    roles: ['admin', 'warranty_manager', 'technician' , 'technical_leader','admin_warranty', 'vice_admin_warranty']
  },
  {
    action: 'update',
    roles: ['admin', 'warranty_manager', 'technician', 'technical_leader', 'admin_warranty', 'vice_admin_warranty']
  },
  {
    action: 'create_invoice',
    roles: ['admin', 'warranty_manager', 'admin_warranty', 'vice_admin_warranty']
  },
  {
    action: 'export',
    roles: ['admin', 'warranty_manager', 'admin_warranty', 'vice_admin_warranty']
  },
  {
    action: 'create_reimbursement',
    roles: ['admin', 'warranty_manager', 'technician', 'admin_warranty', 'vice_admin_warranty']
  },
  {
    action: 'delete',
    roles: ['admin', 'warranty_manager', 'technician', 'admin_warranty', 'vice_admin_warranty']
  }
];
