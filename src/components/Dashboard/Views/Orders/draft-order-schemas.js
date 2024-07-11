export default [{
  prop: 'id',
  label: 'Mã',
  minWidth: 120,
  type: 'number',
  link: '/orders',
},
{
  prop: 'name',
  label: 'Khách hàng',
  minWidth: 120,
  type: 'text',
},
{
  prop: 'order_status',
  label: 'Trạng thái',
  minWidth: 120,
  ignoreSearch: true,
  type: 'select',
  options: [
    {
      value: 'new',
      title: 'Mới',
    },
    {
      value: 'confirm',
      title: 'Xác nhận',
    },
    {
      value: 'done',
      title: 'Hoàn tất',
    },
    {
      value: 'cancel',
      title: 'Hủy',
    },
    {
      value: 'draft',
      title: 'Nháp',
    },
    {
      value: 'return',
      title: 'Hoàn trả',
    },
  ],
},
{
  prop: 'total',
  label: 'Tổng tiền',
  minWidth: 120,
  type: 'number',
},
{
  prop: 'created_at',
  label: 'Ngày tạo',
  minWidth: 120,
  type: 'text',
  ignoreSearch: true,
},
];
