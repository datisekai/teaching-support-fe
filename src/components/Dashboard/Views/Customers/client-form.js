export default [
  {
    groups: [
      {
        title: 'Thông tin',
        attributes: [
          {
            prop: 'name',
            label: 'Tên',
            type: 'text',
            validate: 'required',
          },
          {
            prop: 'address',
            label: 'Địa chỉ',
            type: 'text',
          },
          {
            prop: 'phone',
            label: 'Số điện thoại',
            type: 'text',
          },
          {
            prop: 'fax',
            label: 'Số fax',
            type: 'text',
          },
          {
            prop: 'website',
            label: 'Trang web',
            type: 'text',
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
