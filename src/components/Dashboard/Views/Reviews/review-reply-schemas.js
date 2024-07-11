export default [
  {
    prop: 'id',
    label: 'id',
    minWidth: 50,
    type: 'number',
  },
  {
    prop: 'content',
    label: 'content',
    minWidth: 180,
    type: 'text',
  },
  {
    prop: 'userFullName',
    label: 'user',
    minWidth: 180,
    type: 'text',
  },
  {
    prop: 'reviewStatus',
    label: 'status',
    minWidth: 80,
    type: 'select',
    searchable: true,
  },
  {
    prop: 'createdAt',
    label: 'createdAt',
    minWidth: 100,
    type: 'datetime',
  },
];
