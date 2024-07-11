export default [
  {
    prop: 'id',
    label: 'id',
    minWidth: 30,
    type: 'number',
    link: '/review',
  },
  {
    prop: 'productName',
    label: 'product',
    minWidth: 100,
    type: 'text',
    searchable: true,
  },
  {
    prop: 'content',
    label: 'content',
    minWidth: 180,
    type: 'text',
  },
  {
    prop: 'replyStat',
    label: 'replyStat',
    minWidth: 80,
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
    prop: 'updatedAt',
    label: 'updatedAt',
    minWidth: 100,
    type: 'datetime',
  },
];
