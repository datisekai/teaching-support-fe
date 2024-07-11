export default [
  {
    prop: 'id',
    label: 'Mã',
    minWidth: 120,
    type: 'number',
  },
  {
    prop: 'content',
    label: 'Nội dung',
    minWidth: 200,
    type: 'text',
  },
  {
    prop: 'name',
    label: 'Tên',
    minWidth: 150,
    type: 'text',
  },
  {
    prop: 'created_at',
    label: 'Ngày tạo',
    minWidth: 150,
    type: 'text',
  },
  {
    prop: 'type',
    label: 'Loại',
    minWidth: 130,
    type: 'text',
  },
  {
    prop: 'status',
    label: 'Trạng thái',
    minWidth: 120,
    type: 'select',
    options: [
      { name: 'Đang hiện', value: 'active' },
      { name: 'Đang ẩn', value: 'inactive' },
    ],
  },
];
