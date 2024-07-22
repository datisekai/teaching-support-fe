export default {
  groups: [
    {
      title: "Thông tin cơ bản",
      attributes: [
        {
          prop: "name",
          label: "Tên ngành",
          type: "text",
          validate: "required"
        },
        {
          prop: "description",
          label: "Mô tả",
          type: "editor",
          validate: "required"
        }
      ]
    }
  ]
};
