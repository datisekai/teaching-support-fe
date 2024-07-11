export default [
  {
    groups: [
      {
        title: 'Thông tin',
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
            type: 'textarea',
            validate: 'required',
          },
          {
            prop: 'content',
            label: 'Nội dung',
            type: 'editor',
            validate: 'required',
          },
        ],
      },
      {
        title: 'Tối ưu SEO',
        attributes: [
          {
            prop: 'seo.meta_title',
            label: 'Tiêu đề trang',
            type: 'text',
          },
          {
            prop: 'seo.meta_description',
            label: 'Mô tả trang',
            type: 'textarea',
          },
          {
            prop: 'seo.meta_keyword',
            label: 'Từ khóa',
            type: 'textarea',
          },
          {
            prop: 'seo.meta_robots',
            label: 'Meta robots',
            type: 'select',
            options: [
              {
                title: 'Index, Follow',
                value: 'index, follow',
              },
              {
                title: 'No Index, Follow',
                value: 'noindex, follow',
              },
              {
                title: 'Index, No Follow',
                value: 'index, nofollow',
              },
              {
                title: 'No Index, No Follow',
                value: 'noindex, nofollow',
              },
            ],
          },
          {
            prop: 'seo.meta_image',
            label: 'Hình đại diện',
            type: 'image',
            size: '100x100',
          },
        ],
      },
    ],
  },
  {
    groups: [
      {
        title: 'Tags',
        attributes: [
          {
            prop: 'tags',
            label: 'Tags',
            type: 'tag',
          },
        ],
      },
      {
        title: 'Hình đại diện',
        attributes: [
          {
            prop: 'image',
            label: 'Hình đại diện',
            type: 'image',
            size: '100x100',
          },
        ],
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
              {
                title: 'Hết hạn',
                value: 'expried',
              },
            ],
          },
        ],
      },
    ],
  },
];
