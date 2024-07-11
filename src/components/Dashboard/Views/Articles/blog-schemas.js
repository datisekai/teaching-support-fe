export default [
  {
    prop: 'id',
    label: 'Mã',
    minWidth: 80,
    type: 'number',
    link: '/blogs',
  },
  {
    prop: 'image',
    label: 'Hình ảnh',
    minWidth: 120,
    type: 'image',
  },
  {
    prop: 'title',
    label: 'Tiêu đề',
    minWidth: 200,
    type: 'text',
    link: '/blogs',
  },
  {
    prop: 'description',
    label: 'Mô tả',
    minWidth: 250,
    type: 'text',
  },
  {
    prop: 'view',
    label: 'Lượt xem',
    minWidth: 100,
    type: 'number',
  },
  {
    prop: 'tag',
    label: 'Tag',
    minWidth: 150,
    type: 'text',
  },
  {
    prop: 'priority',
    label: 'Độ ưu tiên',
    minWidth: 120,
    type: 'number',
  },
  {
    prop: 'created_at',
    label: 'Ngày cập nhật',
    minWidth: 160,
    type: 'text',
    ignoreSearch: true,
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
