export default [
    {
      prop: 'id',
      label: 'STT',
      minWidth: 60,
      type: 'number',
      link: '/education/teacher',
    },
    {
      prop: 'fullname',
      label: 'Username',
      minWidth: 100,
      type: 'text',
      link: '/education/teacher',
      searchable: true,
    },
    {
      prop: 'email',
      label: 'Email',
      minWidth: 140,
      type: 'text',
    },
    {
      prop: 'phone',
      label: 'Số điện thoại',
      minWidth: 110,
      type: 'text',
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