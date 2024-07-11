<template lang="html">
  <div class="row">
    <div class="col-lg-8 col-md-8 col-sm-12">
      <div class="card">
        <div class="card-header">
          <h6 class="title">Nội dung Email</h6>
        </div>
        <div class="card-body form-card">
          <el-input
            type="textarea"
            :rows="30"
            placeholder="Nội dung email"
            v-model="email.content"
          >
          </el-input>
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-md-4 col-sm-12">
      <div class="card">
        <div class="card-header">
          <h6 class="title">Danh sách biến</h6>
        </div>
        <div class="card-body form-card">
          <ol>
            <li>CHUNG
              <ul>
                <li>Địa chỉ website <code v-html="'{{website}}'"></code></li>
              </ul>
            </li>
            <li>ĐƠN HÀNG
              <ul>
                <li>ID <code v-html="'{{order_id}}'"></code></li>
                <li>Thông tin sản phẩm trong giỏ hàng <code v-html="'{{order_cart}}'"></code></li>
                <li>Trạng thái <code v-html="'{{order_status}}'"></code></li>
                <li>Chú thích <code v-html="'{{order_notes}}'"></code></li>
                <li>Lý do hủy <code v-html="'{{order_reason_cancel}}'"></code></li>
                <li>Shipping <code v-html="'{{order_shipping}}'"></code></li>
                <li>Giảm mã giảm giá <code v-html="'{{order_coupon_discount}}'"></code></li>
                <li>Giảm chương trình khuyến mãi <code v-html="'{{order_sale_discount}}'"></code></li>
                <li>Giảm giá đơn hàng <code v-html="'{{order_order_discount}}'"></code></li>
                <li>Subtotal <code v-html="'{{order_subtotal}}'"></code></li>
                <li>Total <code v-html="'{{order_total}}'"></code></li>
              </ul>
            </li>
            <li>QUẢN TRỊ VIÊN
              <ul>
                <li>Tên <code v-html="'{{user_name}}'"></code></li>
                <li>Email <code v-html="'{{user_email}}'"></code></li>
                <li>Quyền <code v-html="'{{user_role}}'"></code></li>
                <li>Link tạo mật khẩu <code v-html="'{{link_create_password_admin}}'"></code></li>
                <li>Link liên hệ trong admin <code v-html="'{{contact_link}}'"></code></li>
                <li>Nội dung liên hệ <code v-html="'{{content}}'"></code></li>
              </ul>
            </li>
            <li>KHÁCH HÀNG
              <ul>
                <li>Tên <code v-html="'{{customer_name}}'"></code></li>
                <li>Email <code v-html="'{{customer_email}}'"></code></li>
                <li>Link tạo mật khẩu <code v-html="'{{link_create_password}}'"></code></li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="page-action">
        <el-button @click="cancel">Hủy</el-button>
        <el-button type="primary" @click="save">Lưu lại</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, Input, Message } from 'element-ui';
import Editor from '@tinymce/tinymce-vue';
import MySelect from 'src/components/UIComponents/Select';

export default {
  components: {
    ElButton: Button,
    ElInput: Input,
    editor: Editor,
    MySelect,
  },
  mounted() {
    const handle = this.$route.params.handle;
    this.$store.dispatch('fetchEmailDetail', handle);

    this.$store.dispatch('setPageTitle', 'Chỉnh sửa Email');
    this.$store.dispatch('setCurrentActions', [{
      label: 'Lưu lại',
      type: 'primary',
      icon: '',
      callback: this.save,
    }]);
  },
  computed: {
    email: {
      get() {
        return this.$store.state.emailDetail;
      },
      set(value) {},
    },

  },
  methods: {
    cancel() {
      this.$router.push({ name: 'Email' });
    },
    save() {
      const self = this;
      this.$validator.validateAll().then((result) => {
        if (result) {
          self.$store.dispatch('updateEmail', self.email).then((res) => {
            Message({
              message: 'Chỉnh sửa thành công',
              type: 'success',
            });
          }, (res) => {
            Message({
              message: res.message,
              type: 'error',
            });
          });
        }
      });
    },
  },
  destroyed() {
    this.$store.dispatch('setCurrentActions', []);
  },
};
</script>
