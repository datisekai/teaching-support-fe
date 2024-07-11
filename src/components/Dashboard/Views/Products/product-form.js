export default [
  {
    groups: [
      {
        title: "Thông tin chung",
        attributes: [
          {
            prop: "name",
            label: "Tên sản phẩm",
            type: "text",
            validate: "required"
          },
          {
            prop: "vendor",
            label: "Nhà cung cấp",
            type: "text",
            validate: "required"
          },
          {
            prop: "description",
            label: "Mô tả",
            type: "textarea"
          }
        ]
      }
    ]
  },
  {
    groups: [
      {
        title: "Nhóm sản phẩm",
        attributes: [
          {
            prop: "categories",
            label: "Tìm kiếm",
            type: "select",
            multiple: true,
          }
        ]
      }
    ]
  }
];
