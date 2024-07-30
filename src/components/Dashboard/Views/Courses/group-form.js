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
        // {
        //   prop: "description",
        //   label: "Mô tả",
        //   type: "editor"
        //   //   validate: "required"
        // },
        {
          prop: "due_date",
          label: "Năm học",
          type: "text"
        }
      ]
    }
  ]
};
