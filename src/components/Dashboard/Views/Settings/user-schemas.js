export default [
  {
    prop: 'id',
    label: 'id',
    minWidth: 50,
    type: 'number',
    link: '/staff',
  },
  {
    prop: 'fullname',
    label: 'fullname',
    minWidth: 120,
    type: 'text',
    link: '/staff',
    searchable: true,
  },
  {
    prop: 'email',
    label: 'email',
    minWidth: 120,
    type: 'text',
  },
  {
    prop: 'phone',
    label: 'phone',
    minWidth: 120,
    type: 'text',
  },
  {
    prop: 'role',
    label: 'role',
    minWidth: 120,
    type: 'select',
    searchable: true,
  },
  {
    prop: 'createdAt',
    label: 'createdAt',
    minWidth: 120,
    type: 'date',
  },
];
