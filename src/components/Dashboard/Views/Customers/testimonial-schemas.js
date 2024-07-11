export default [
  {
    prop: 'id',
    label: 'Mã',
    minWidth: 60,
    type: 'number',
    link: '/testimonial',
  },
  {
    prop: 'logo',
    label: 'Logo',
    minWidth: 120,
    type: 'image',
    link: '/testimonial',
  },
  {
    prop: 'name',
    label: 'Tên',
    minWidth: 240,
    type: 'text',
    link: '/testimonial',
  },
  {
    prop: 'updated_at',
    label: 'Ngày cập nhật',
    minWidth: 120,
    type: 'text',
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
