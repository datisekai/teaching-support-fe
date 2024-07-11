export default {
    title: 'Thông tin',
    attributes: [
      {
        prop: 'name',
        label: 'Đề thi',
        type: 'text',
        validate: 'required',
      },
      {
        prop: 'topic',
        label: 'Chủ đề',
        type: 'text',
        validate: 'required',
      },
      {
        prop: 'duration',
        label: 'Thời gian làm bài (phút)',
        type: 'number',
        validate: 'required',
      },
      {
        prop: 'description',
        label: 'Mô tả',
        type: 'editor',
        validate: 'required',
      }
    ],
  }