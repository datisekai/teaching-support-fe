export default {
  groups: [
    {
      title: "Thông tin cơ bản",
      attributes: [
        {
          prop: "name",
          label: "Tên",
          type: "text"
          //   validate: "required"
        },
        {
          prop: "code",
          label: "Mã môn học",
          type: "text"
          //   validate: "required"
        },
        {
          prop: "description",
          label: "Mô tả",
          type: "editor"
          //   validate: "required"
        }
      ]
    }
  ]
};
