export default [
  {
    prop: 'id',
    label: 'Mã',
    minWidth: 50,
    type: 'number',
    link: '/galleries',
  },
  {
    prop: 'title',
    label: 'Tiêu đề',
    minWidth: 120,
    type: 'text',
    link: '/galleries',
  },
  {
    prop: 'handle',
    label: 'Handle',
    minWidth: 120,
    type: 'text',
  },
  {
    prop: 'created_at',
    label: 'Ngày cập nhật',
    minWidth: 150,
    type: 'text',
  },
  {
    prop: 'status',
    label: 'Trạng thái',
    minWidth: 90,
    type: 'select',
    options: [
      { name: 'Đang hiện', value: 'active' },
      { name: 'Đang ẩn', value: 'inactive' },
    ],
  },
];
