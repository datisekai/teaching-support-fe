const init = {
  schemas: [
    {
      prop: 'id',
      label: 'Mã',
      minWidth: 50,
      type: 'number',
    },
    {
      prop: 'title',
      label: 'Tiêu đề',
      minWidth: 150,
      type: 'text',
    },
    {
      prop: 'description',
      label: 'Mô tả',
      minWidth: 240,
    },
  ],
  data: [
    {
      id: 1,
      title: 'Order confirm',
      description: 'Gửi cho khách hàng sau khi họ đặt hàng',
    },
    {
      id: 2,
      title: 'Order update status',
      description: 'Gửi cho khách hàng sau đơn hàng được thay đổi trạng thái',
    },
    {
      id: 3,
      title: 'Order admin',
      description: 'Gửi cho quản trị viên khi có đơn hàng mới (Áp dụng cho quản trị viên có quyền nhận email)',
    },
    {
      id: 4,
      title: 'Register admin',
      description: 'Gửi cho quản trị viên vừa được thêm vào hệ thống',
    },
    {
      id: 5,
      title: 'Forget password admin',
      description: 'Gửi cho quản trị viên khi dùng chức năng quên mật khẩu',
    },
    {
      id: 6,
      title: 'Contact admin',
      description: 'Gửi cho quản trị viên khi có liên hệ mới',
    },
    {
      id: 7,
      title: 'Register customer',
      description: 'Gửi cho khách hàng vừa đăng ký',
    },
    {
      id: 8,
      title: 'Forget password customer',
      description: 'Gửi cho khách hàng khi dùng chức năng quên mật khẩu',
    },
  ],
};

export default init;
