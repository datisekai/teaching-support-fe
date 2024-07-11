export default [
  {
    prop: 'id',
    label: 'id',
    minWidth: 70,
    type: 'number',
    link: '/setting/menu',
  },
  {
    prop: 'title',
    label: 'title',
    minWidth: 160,
    type: 'text',
    link: '/setting/menu',
    searchable: true,
  },
  {
    prop: 'slug',
    label: 'slug',
    minWidth: 160,
    type: 'text',
    searchable: true,
  },
  {
    prop: 'createdAt',
    label: 'createdAt',
    minWidth: 165,
    type: 'date',
  },
  {
    prop: 'isActive',
    label: 'isActive',
    minWidth: 120,
    type: 'action',
  }
];
