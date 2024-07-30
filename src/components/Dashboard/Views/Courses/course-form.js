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
          prop: "code",
          label: "Mã môn học",
          type: "text"
        },
        {
          prop: "description",
          label: "Mô tả",
          type: "editor"
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
