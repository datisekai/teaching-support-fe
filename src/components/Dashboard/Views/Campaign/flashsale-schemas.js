export default [
  {
    prop: 'image',
    label: 'image',
    minWidth: 80,
    type: 'image',
  },
  {
    prop: 'title',
    label: 'title',
    minWidth: 250,
    type: 'text',
    link: '/flashsale',
    searchable: true,
  },
  {
    prop: 'startDate',
    label: 'startDate',
    minWidth: 120,
    type: 'datetime',
  },
  {
    prop: 'expiredDate',
    label: 'expiredDate',
    minWidth: 120,
    type: 'datetime',
  },
  {
    prop: 'isActive',
    label: 'isActive',
    minWidth: 120,
    type: 'action',
    callback: '',
  },
  {
    prop: 'isProgressing',
    label: 'isProgressing',
    minWidth: 80,
    type: 'select',
  },
];
