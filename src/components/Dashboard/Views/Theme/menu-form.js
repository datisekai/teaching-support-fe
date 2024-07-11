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
        ],
      },
    ],
  },
  {
    groups: [
      {
        title: 'Hình ảnh',
        attributes: [
          {
            prop: 'image',
            label: 'Hình ảnh',
            type: 'image',
          },
        ],
      },
    ],
  },
];
