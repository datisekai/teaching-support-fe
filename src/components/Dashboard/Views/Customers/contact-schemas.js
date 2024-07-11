export default [
  {
    prop: 'id',
    label: 'Mã',
    minWidth: 80,
    type: 'number',
    link: '/contact',
  },
  {
    prop: 'name',
    label: 'Tên',
    minWidth: 120,
    type: 'text'
  },
  {
    prop: 'email',
    label: 'Email',
    minWidth: 120,
    type: 'text',
  },
  {
    prop: 'phone',
    label: 'Số điện thoại',
    minWidth: 120,
    type: 'text',
  },
  {
    prop: 'created_at',
    label: 'Ngày tạo',
    minWidth: 120,
    type: 'text',
  },
  {
    prop: 'reply',
    label: 'Trạng thái',
    minWidth: 150,
    type: 'select',
    options: [
      { name: 'Đã phản hồi', value: 1 },
      { name: 'Chưa phản hồi', value: 0 },
    ],
  },
];
