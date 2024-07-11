export default [
    {
      prop: 'id',
      label: 'Mã',
      minWidth: 60,
      type: 'number',
      link: '/education/exam',
    },
    {
      prop: 'name',
      label: 'Tiêu đề',
      minWidth: 100,
      type: 'text',
      searchable: true,
    },
    {
      prop: 'description',
      label: 'Mô tả',
      minWidth: 140,
      type: 'text',
    },
    {
      prop: 'createdAt',
      label: 'Ngày tạo',
      minWidth: 110,
      type: 'date',
    },
    {
      prop: 'status',
      label: 'Trạng thái',
      minWidth: 120,
      type: 'select',
      options: [
        {
          value: 'pending',
          title: 'Chờ duyệt',
        },
        {
          value: 'confirmed',
          title: 'Xác nhận',
        },
        {
          value: 'rejected',
          title: 'Từ chối',
        },
      ],
    }
   
  ];