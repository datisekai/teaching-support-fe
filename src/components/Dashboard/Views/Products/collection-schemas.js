export default [
  {
    prop: 'id',
    label: 'id',
    minWidth: 80,
    type: 'number',
    link: '/collections',
  },
  {
    prop: 'image',
    label: 'image',
    minWidth: 120,
    type: 'image',
  },
  {
    prop: 'name',
    label: 'name',
    minWidth: 220,
    type: 'text',
    link: '/collections',
    searchable: true,
  },
  {
    prop: 'categoryType',
    label: 'type',
    minWidth: 220,
    type: 'select',
    searchable: true,
  },
  {
    prop: 'createdAt',
    label: 'createAt',
    minWidth: 150,
    type: 'date',
  },
];
