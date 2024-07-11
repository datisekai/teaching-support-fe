export default [
  {
    prop: "send_username",
    label: "Người nhận",
    minWidth: 120,
    type: "text"
  },
  {
    prop: "send_server",
    label: "Server",
    minWidth: 120,
    type: "number"
  },
  {
    prop: "amount",
    label: "Số tiền",
    minWidth: 120,
    type: "number"
  },
  {
    prop: "order_status",
    label: "status",
    minWidth: 120,
    type: "select",
    options: [
      {
        value: "pending",
        title: "Chờ thanh toán"
      },
      {
        value: "completed",
        title: "Thành công"
      },
      {
        value: "canceled",
        title: "Huỷ"
      }
    ]
  },
  {
    prop: "multiplier",
    label: "Hệ số",
    minWidth: 100,
    type: "number"
  },
  {
    prop: "transfer_type",
    label: "Thanh toán",
    minWidth: 120,
    type: "badge"
  },
  {
    prop: "created_at",
    label: "Thời gian tạo",
    minWidth: 100,
    type: "date",
    ignoreSearch: true
  }
];
