export default {
  title: "Thông tin phòng",
  attributes: [
    {
      prop: "status",
      label: "Trạng thái",
      type: "select",
      validate: "required",
      options: [
        {
          title: "Sẵn sàng",
          value: "ready"
        },
        {
          title: "Điểm danh",
          value: "scan"
        },
        {
          title: "Tạm dừng",
          value: "stop"
        },
        {
          title: "Kết thúc",
          value: "finish"
        }
      ]
    }
  ]
};
