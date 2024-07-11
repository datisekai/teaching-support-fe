export default [
  {
    title: "Trang chủ",
    id: "Home",
    groups: [
      {
        title: "Thông tin cơ bản",
        attributes: [
          // {
          //   label: "Favicon",
          //   type: "image-single",
          //   name: "favicon",
          //   size: "32x32",
          //   prop: "favicon"
          // },
          {
            label: "Logo",
            type: "image-single",
            name: "logo",
            size: "80x80",
            prop: "logo"
          },
          {
            label: "Tên hiển thị (nếu có)",
            type: "text",
            name: "text_logo",
            prop: "text_logo"
          },
          {
            label: "Ảnh nền (Background PC)",
            type: "image-single",
            name: "background",
            size: "16x9",
            prop: "background"
          },
          {
            label: "Ảnh nền (Background Mobile)",
            type: "image-single",
            name: "background_mobile",
            size: "9x16",
            prop: "background_mobile"
          },
          {
            label: "Hiển thị captcha",
            type: "checkbox",
            name: "show_captcha",
            prop: "show_captcha"
          }
        ]
      },
      {
        title: "Dịch vụ",
        attributes: [
          {
            label: "Giá bán (Server 1)",
            name: "multiplier1",
            type: "number",
            prop: "multiplier1"
          },
          {
            label: "Giá bán (Server 2)",
            name: "multiplier2",
            type: "number",
            prop: "multiplier2"
          }
        ]
      },
      {
        title: "Liên hệ",
        attributes: [
          {
            label: "Số điện thoại",
            name: "phone_number",
            type: "text",
            prop: "phone_number"
          },
          {
            label: "Link facebook",
            name: "link_facebook",
            type: "text",
            prop: "link_facebook"
          },
          {
            label: "Link messenger",
            name: "link_messenger",
            type: "text",
            prop: "link_messenger"
          },
          {
            label: "Link zalo",
            name: "link_zalo",
            type: "text",
            prop: "link_zalo"
          }
        ]
      }
      // {
      //   title: "SEO",
      //   attributes: [
      //     {
      //       label: "Tiêu đề trang",
      //       name: "seo_title",
      //       type: "text",
      //       prop: "seo_title"
      //     },
      //     {
      //       label: "Mô tả trang",
      //       name: "seo_description",
      //       type: "text",
      //       prop: "seo_description"
      //     },
      //     {
      //       label: "Ảnh hiển thị",
      //       name: "seo_image",
      //       type: "image-single",
      //       prop: "seo_image"
      //     }
      //   ]
      // }
    ]
  }
];
