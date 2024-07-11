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
    prop: 'technician',
    label: 'technician',
    minWidth: 220,
    type: 'text',
    searchable: true,
  },
  {
    prop: 'customerName',
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
    prop: 'quotationFormStatus',
    label: 'status',
    minWidth: 150,
    type: 'select',
    searchable: true,
  },
];
