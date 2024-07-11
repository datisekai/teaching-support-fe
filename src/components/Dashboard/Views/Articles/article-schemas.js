export default [
  {
    prop: 'id',
    label: 'Mã',
    width: 50,
    type: 'number',
    link: '/articles',
  },
  {
    prop: 'image',
    label: 'Hình ảnh',
    minWidth: 100,
    type: 'image',
  },
  {
    prop: 'title',
    label: 'Tên bài viết',
    minWidth: 250,
    type: 'text',
    link: '/articles',
  },
  {
    prop: 'description',
    label: 'Mô tả',
    minWidth: 300,
    type: 'text',
  },
  // {
  //   prop: 'blog_name',
  //   label: 'Nhóm bài viết',
  //   minWidth: 160,
  //   type: 'text',
  // },
  {
    prop: 'priority',
    label: 'Độ ưu tiên',
    minWidth: 100,
    type: 'number',
  },
  // {
  //   prop: 'view',
  //   label: 'Lượt xem',
  //   minWidth: 90,
  //   type: 'text',
  // },
  {
    prop: 'createdAt',
    label: 'Ngày cập nhật',
    minWidth: 150,
    type: 'date',
    ignoreSearch: true,
  },
  // {
  //   prop: 'status',
  //   label: 'Trạng thái',
  //   minWidth: 120,
  //   type: 'select',
  //   options: [
  //     {
  //       value: 'active',
  //       title: 'Đang hiện',
  //     },
  //     {
  //       value: 'inactive',
  //       title: 'Đang ẩn',
  //     },
  //   ],
  // },

];
