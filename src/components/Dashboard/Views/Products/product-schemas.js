export default [
  {
    prop: 'id',
    label: 'id',
    width: 50,
    type: 'number',
    link: '/product',
  },
  {
    prop: 'image',
    label: 'image',
    minWidth: 100,
    type: 'image',
    externalLink: true,
  },
  {
    prop: 'name',
    label: 'title',
    minWidth: 220,
    type: 'text',
    link: '/product',
    searchable: true,
  },
  {
    prop: 'price',
    label: 'price',
    minWidth: 220,
    type: 'money',
    searchable: true,
  },
  {
    prop: 'status',
    label: 'status',
    type: 'text',
    searchable: true,    
  },
  {
    prop: 'createdAt',
    label: 'createdAt',
    minWidth: 150,
    type: 'date',
  },
];
