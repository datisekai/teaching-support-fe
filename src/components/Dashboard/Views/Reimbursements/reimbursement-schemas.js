export default [
  {
    prop: 'id',
    label: 'id',
    minWidth: 80,
    type: 'number',
  },
  {
    prop: 'receiptNo',
    label: 'receiptNo',
    minWidth: 140,
    type: 'text',
    searchable: true,
  },
  {
    prop: 'notebook',
    label: 'book',
    minWidth: 170,
    type: 'text',
    searchable: true,
  },
  {
    prop: 'customer_name',
    label: 'customer',
    minWidth: 220,
    type: 'text',
    searchable: true,
  },
  {
    prop: 'actualReturnedAt',
    label: 'Ngày hoàn trả thực tế',
    minWidth: 170,
    type: 'date',
  },
  {
    prop: 'returnedAt',
    label: 'returnDate',
    minWidth: 170,
    type: 'date',
  },
  {
    prop: 'reimbursementFormStatus',
    label: 'status',
    minWidth: 150,
    type: 'select',
    searchable: true,
  },
];
