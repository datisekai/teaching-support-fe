export default {
  groups: [
    {
      title: "Thông tin cơ bản",
      attributes: [
        {
          prop: "name",
          label: "Tên môn học",
          type: "text",
          validate: "required"
        },
        {
          prop: "description",
          label: "Mô tả",
          type: "editor",
          validate: "required"
        },
        {
          prop: "department",
          label: "department",
          type: "department",
          validate: "required"
        }
      ]
    }
  ]
};
