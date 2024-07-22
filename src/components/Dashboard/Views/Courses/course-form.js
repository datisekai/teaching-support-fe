export default [
  {
    groups: [
      {
        title: "THÔNG TIN",
        attributes: [
          {
            prop: "name",
            label: "Tên",
            type: "text",
            validate: "required"
          },
          {
            prop: "description",
            label: "Mô tả",
            type: "editor"
          }
        ]
      }
    ]
  },
  {
    groups: [
      {
        title: "Khác",
        attributes: [
          {
            prop: "department",
            label: "Ngành",
            type: "department",
            validate: "required"
          }
        ]
      }
    ]
  }
];
