export default [
  {
    prop: 'code',
    label: 'code',
    minWidth: 120,
    type: 'text',
    link: '/coupon',
  },
  {
    prop: 'discountType',
    label: 'type',
    minWidth: 120,
    type: 'select',
  },
  {
    prop: 'value',
    label: 'value',
    minWidth: 120,
    type: 'text',
  },
  {
    prop: 'startDate',
    label: 'startDate',
    minWidth: 130,
    type: 'datetime',
  },
  {
    prop: 'expiredDate',
    label: 'expiredDate',
    minWidth: 130,
    type: 'datetime',
  },
  {
    prop: 'statusCusCoupon',
    label: 'status',
    minWidth: 120,
    type: 'select',
    callback: '',
  },
];
