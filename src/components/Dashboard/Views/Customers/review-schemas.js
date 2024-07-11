export default [
  {
    prop: 'id',
    label: 'Mã',
    minWidth: 120,
    type: 'number',
  },
  {
    prop: 'title',
    label: 'Tiêu đề',
    minWidth: 120,
    type: 'text',
  },
  {
    prop: 'name',
    label: 'Khách hàng',
    minWidth: 120,
    type: 'text',
  },
  {
    prop: 'content',
    label: 'Nội dung',
    minWidth: 120,

  },
  {
    prop: 'rating',
    label: 'Rating',
    minWidth: 120,
  },
  {
    prop: 'created_at',
    label: 'Thời gian',
    minWidth: 120,
  },
  {
    prop: 'status',
    label: 'Trạng thái',
    minWidth: 120,
    type: 'select',
    options: [
      {
        value: 'active',
        title: 'Đang hiện',
      },
      {
        value: 'inactive',
        title: 'Đang ẩn',
      },
    ],
  },
];
