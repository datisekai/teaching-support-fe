export default [
  {
    groups: [
      {
        title: 'THÔNG TIN',
        attributes: [
          {
            prop: 'title',
            label: 'Tiêu đề',
            type: 'text',
            validate: 'required',
          },
          {
            prop: 'description',
            label: 'Mô tả',
            type: 'editor',
          },
        ],
      },
    ],
  },
  {
    groups: [
      {
        title: 'Thông tin thêm',
        attributes: [
          {
            prop: 'image',
            label: 'Hình đại diện',
            type: 'image',
            size: '',
          },
          {
            prop: 'status',
            label: 'Trạng thái',
            type: 'select',
            options: [
              {
                title: 'Hiển thị',
                value: 'active',
              },
              {
                title: 'Ẩn',
                value: 'inactive',
              },
            ],
          },
        ],
      },
    ],
  },
];
