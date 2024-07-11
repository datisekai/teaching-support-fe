export default [
  {
    prop: 'id',
    label: 'id',
    minWidth: 80,
    type: 'number',
    link: '/setting/page',
  },
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
    link: '/setting/page',
    searchable: true,
  },
  {
    prop: 'isActive',
    label: 'isActive',
    minWidth: 120,
    type: 'action',
    callback: '',
  },
  {
    prop: 'createdAt',
    label: 'createdAt',
    minWidth: 250,
    type: 'date',
  },
];
