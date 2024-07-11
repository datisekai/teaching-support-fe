export default [
  {
    prop: 'id',
    label: 'STT',
    minWidth: 30,
    type: 'number',
    link: '/warranty-location',
  },
  {
    prop: 'name',
    label: 'Tên trung tâm',
    minWidth: 120,
    type: 'text',
    searchable: true,
  },
  {
    prop: 'address',
    label: 'Địa chỉ',
    minWidth: 200,
    type: 'text',
  },
  {
    prop: 'phone',
    label: 'Số điện thoại',
    minWidth: 80,
    type: 'text',
    searchable: true,
  },
  {
    prop: 'createdAt',
    label: 'Ngày khởi tạo',
    minWidth: 60,
    type: 'date time'
  },
];
