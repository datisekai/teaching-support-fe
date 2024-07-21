export default {
  title: "Thông tin phòng",
  attributes: [
    {
      prop: "title",
      label: "Tiêu đề",
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
      prop: "group",
      label: "Lớp học",
      type: "group",
      validate: "required"
    }
  ]
};
