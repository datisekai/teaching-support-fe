export default [
  {
    prop: 'id',
    label: 'id',
    minWidth: 80,
    type: 'number',
    link: '/coupon',
  },
  {
    prop: 'code',
    label: 'code',
    minWidth: 120,
    type: 'text',
    searchable: true,
  },
  {
    prop: 'discountType',
    label: 'type',
    minWidth: 120,
    type: 'select',
    searchable: true,
  },
  {
    prop: 'discountValue',
    label: 'value',
    minWidth: 120,
    type: 'text',
  },
  {
    prop: 'createdAt',
    label: 'createdAt',
    minWidth: 130,
    // type: 'datetime',
    type: 'date'
  },
  {
    prop: 'expiredDate',
    label: 'expiredDate',
    minWidth: 130,
    // type: 'datetime',
    type: 'date'
  },
  {
    prop: 'isActive',
    label: 'isActive',
    minWidth: 120,
    type: 'action',
    callback: '',
  },
  {
    prop: 'isExpired',
    label: 'isExpired',
    minWidth: 80,
    type: 'select',
    searchable: true,
  },
];
