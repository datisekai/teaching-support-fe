export default [
  {
    title: "Thông tin khách hàng",
    attributes: [
      {
        prop: "send_username",
        label: "Tên đăng nhập (HSNR)",
        type: "text",
        required: true
      },
      {
        prop: "send_server",
        label: "Server",
        type: "select",
        options: [
          {
            title: "Server 1",
            value: 1
          },
          {
            title: "Server 2",
            value: 2
          }
        ],
        required: true
      }
    ]
  },
  {
    title: "Thông tin đơn hàng",
    attributes: [
      {
        prop: "order_status",
        label: "Trạng thái đơn hàng",
        type: "select",
        options: [
          {
            title: "Chờ thanh toán",
            value: "pending"
          },
          {
            title: "Thành công",
            value: "completed"
          },
          {
            title: "Đã huỷ",
            value: "canceled"
          }
        ],
        required: true
      },
      {
        prop: "amount",
        label: "Số tiền",
        type: "number"
      }
    ]
  }
];
