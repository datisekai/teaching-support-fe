export default [
  {
    groups: [
      {
        title: 'Thông tin',
        attributes: [
          {
            prop: 'name',
            label: 'Tên đối tác',
            type: 'text',
            validate: 'required',
          },
          {
            prop: 'content',
            label: 'Nội dung',
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
            prop: 'priority',
            label: 'Độ ưu tiên',
            type: 'number',
          },
          {
            prop: 'logo',
            label: 'Logo',
            type: 'image',
            size: '100x100',
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
