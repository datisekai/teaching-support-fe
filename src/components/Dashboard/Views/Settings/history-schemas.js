export default [
  {
    prop: 'id',
    label: 'Mã',
    minWidth: 50,
    type: 'number',
  },
  {
    prop: 'user_name',
    label: 'Tên',
    minWidth: 80,
    type: 'text',
  },
  {
    prop: 'actionText',
    label: 'Hành động',
    noSort: true,
    minWidth: 150,
  },
  {
    prop: 'created_at',
    label: 'Thời gian',
    minWidth: 60,
    type: 'text',
  },
  {
    prop: 'user_type',
    label: 'Loại',
    minWidth: 60,
    type: ' text',
    ignoreSearch: true,
  },
];
