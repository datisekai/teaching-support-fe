export default [
    {
      prop: 'id',
      label: 'STT',
      minWidth: 40,
      type: 'number',
      link: '/education/survey',
    },
    {
      prop: 'name',
      label: 'Tiêu đề',
      minWidth: 100,
      type: 'text',
      link: '/education/survey',
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
      minWidth: 90,
      type: 'date',
    },
    {
      prop: 'status',
      label: 'Trạng thái',
      minWidth: 80,
      type: 'select',
      options: [
        {
          value: 'in_progress',
          title: 'Đang khảo sát',
        },
        {
          value: 'closed',
          title: 'Đóng',
        },
        {
          value: null,
          title: 'Chưa mở',
        },
      ],
    },
    {
      prop: 'startDate',
      type: 'date',
    },
    {
      prop: 'expiredDate',
      type: 'date',
    },
    {
      prop: 'updatedAt',
      type: 'date',
    },
    {
      prop: 'couponId',
      type: 'number'
    }
  ];