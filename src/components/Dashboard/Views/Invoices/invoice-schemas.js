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
    minWidth: 220,
    type: 'text',
    searchable: true,
  },
  {
    prop: 'notebook',
    label: 'book',
    minWidth: 220,
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
    prop: 'returnedAt',
    label: 'returnDate',
    minWidth: 220,
    type: 'date',
  },
  {
    prop: 'formattedMoney',
    label: 'totalPrice',
    minWidth: 150,
  },
  {
    prop: 'invoiceFormStatus',
    label: 'status',
    minWidth: 150,
    type: 'select',
    searchable: true,
  },
];
