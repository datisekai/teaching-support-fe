export default [
  {
    prop: 'id',
    label: 'formNoMainForm',
    minWidth: 100,
    type: 'text',
    searchable: true,
  },
  {
    prop: 'warrantyFormId',
    propLink: 'warrantyFormId',
    label: 'formNoWarrantyForm',
    minWidth: 100,
    type: 'text',
    link: '/warranty-form',
    blank: true,
    searchable: true,
  },
  {
    prop: 'customer_name',
    label: 'customer',
    minWidth: 220,
    type: 'text',
    searchable: true,
  },
  {
    prop: 'maintenanceFormStatus',
    label: 'status',
    minWidth: 150,
    type: 'select',
    searchable: true,
  },
  {
    prop: 'createdAt',
    label: 'createdAt',
    minWidth: 150,
    type: 'date',
  },
];
