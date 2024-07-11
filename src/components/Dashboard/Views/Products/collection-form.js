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
            prop: 'description',
            label: 'Mô tả',
            type: 'textarea',
          },
          // {
          //   prop: 'content',
          //   label: 'Nội dung',
          //   type: 'editor',
          // },
        ],
      }
    ],
  },
  // {
  //   groups: [
  //     {
  //       title: 'Thông tin thêm',
  //       attributes: [
  //         {
  //           prop: 'parent',
  //           label: 'Nhóm sản phẩm cha',
  //           type: 'collection',
  //         },
  //         {
  //           prop: 'image',
  //           label: 'Hình đại diện',
  //           type: 'image',
  //           size: '100x100',
  //         },
  //         {
  //           prop: 'status',
  //           label: 'Trạng thái',
  //           type: 'select',
  //           options: [
  //             {
  //               title: 'Hiển thị',
  //               value: 'active',
  //             },
  //             {
  //               title: 'Ẩn',
  //               value: 'inactive',
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
];
