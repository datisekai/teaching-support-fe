export default {
    title: 'Thông tin',
    attributes: [
      {
        prop: 'title',
        label: 'Tiêu đề',
        type: 'text',
        validate: 'required',
      },
      {
        prop: 'description',
        label: 'Mô tả',
        type: 'textarea',
        validate: 'required',
      },
    ],
  }