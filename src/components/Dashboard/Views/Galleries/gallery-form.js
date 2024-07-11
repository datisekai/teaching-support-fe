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
            prop: 'handle',
            label: 'Đường dẫn',
            type: 'text',
            validate: 'required',
          },
          {
            prop: 'description',
            label: 'Mô tả',
            type: 'editor',
          }
        ],
      },
    ],
  },
  {
    groups: [
      {
        title: 'GALLERY CHA',
        attributes: [
          {
            prop: 'parent',
            label: 'Gallery cha',
            type: 'gallery'
          }
        ]
      },
      {
        title: 'Trạng thái',
        attributes: [
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
