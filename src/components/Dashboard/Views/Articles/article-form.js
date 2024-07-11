export default [
  {
    groups: [
      {
        title: 'Thông tin',
        languages: ['en', 'jp'],
        attributes: [
          {
            prop: 'title',
            label: 'Tiêu đề',
            type: 'text',
            validate: 'required',
          },
          // {
          //   prop: 'handle',
          //   label: 'Đường dẫn',
          //   type: 'text',
          //   validate: 'required',
          // },
          {
            prop: 'description',
            label: 'Mô tả',
            type: 'textarea',
          },
          {
            prop: 'content',
            label: 'Nội dung',
            type: 'editor',
          },
        ],
      },
      // {
      //   title: 'Tối ưu SEO',
      //   attributes: [
      //     {
      //       prop: 'seo.meta_title',
      //       label: 'Tiêu đề trang',
      //       type: 'text',
      //     },
      //     {
      //       prop: 'seo.meta_description',
      //       label: 'Mô tả trang',
      //       type: 'textarea',
      //     },
      //     {
      //       prop: 'seo.meta_keyword',
      //       label: 'Từ khóa',
      //       type: 'textarea',
      //     },
      //     {
      //       prop: 'seo.meta_robots',
      //       label: 'Meta robots',
      //       type: 'select',
      //       options: [
      //         {
      //           title: 'Index, Follow',
      //           value: 'index, follow',
      //         },
      //         {
      //           title: 'No Index, Follow',
      //           value: 'noindex, follow',
      //         },
      //         {
      //           title: 'Index, No Follow',
      //           value: 'index, nofollow',
      //         },
      //         {
      //           title: 'No Index, No Follow',
      //           value: 'noindex, nofollow',
      //         },
      //       ],
      //     },
      //     {
      //       prop: 'seo.meta_image',
      //       label: 'Hình đại diện',
      //       type: 'image',
      //       size: '100x100',
      //     },
      //   ],
      // },
    ],
  },
  {
    groups: [
      {
        title: 'Thông tin thêm',
        attributes: [
          // {
          //   prop: 'objBlog',
          //   label: 'Nhóm bài viết',
          //   type: 'blogs',
          // },
          // {
          //   prop: 'tags',
          //   label: 'Tags',
          //   type: 'tag',
          // },
          {
            prop: 'image',
            label: 'Hình đại diện',
            type: 'image-single',
            size: '100x100',
          },
          // {
          //   prop: 'status',
          //   label: 'Trạng thái',
          //   type: 'select',
          //   options: [
          //     {
          //       title: 'Hiển thị',
          //       value: 'active',
          //     },
          //     {
          //       title: 'Ẩn',
          //       value: 'inactive',
          //     },
          //     {
          //       title: 'Chưa xuất bản',
          //       value: 'notPublish',
          //     },
          //   ],
          // },
        ],
      },
    ],
  },
];
