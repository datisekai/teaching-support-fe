export default [
  {
    prop: 'image',
    label: 'Hình',
    type: 'image',
  },
  {
    prop: 'title',
    label: 'Tiêu đề',
    type: 'text',
  },
  {
    prop: 'generate_link',
    label: 'Link',
    type: 'text',
  },
  {
    prop: 'status',
    label: 'Trạng thái',
    type: 'select',
    options: [
      { name: 'Đang hiện', value: 'active' },
      { name: 'Đang ẩn', value: 'inactive' },
    ],
  },
];
