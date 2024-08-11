export default {
  groups: [
    {
      title: "Thông tin cơ bản",
      attributes: [
        {
          prop: "name",
          label: "Tên",
          type: "text",
          validate: "required"
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
          type: "text",
          validate: "required"
        },
        {
          prop: "course",
          label: "Môn học",
          type: "course",
          validate: "required"
        },
        {
          prop: "teacher",
          label: "Giảng viên",
          type: "teacher",
          validate: "required",
          displayField: "name",
          dataField: "users"
        }
      ]
    }
  ]
};
