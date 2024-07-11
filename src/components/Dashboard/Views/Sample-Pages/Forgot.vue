<template>
  <div class="login-page">
    <!-- <app-navbar></app-navbar> -->
    <div class="wrapper wrapper-full-page">
      <div class="full-page login-page section-image">
        <!--   you can change the color of the filter page using: data-color="blue | azure | green | orange | red | purple" -->
        <div class="content">
          <div class="container">
            <div class="col-lg-4 col-md-6 ml-auto mr-auto">
              <card type="login">
                <h3 slot="header" class="header text-center">Quên mật khẩu</h3>
                <fg-input
                  v-model="form.email"
                  addon-left-icon="nc-icon nc-email-85"
                  placeholder="Email..."
                  @keyup.enter="signIn"
                  :class="errors.has('email')?'border-danger':''"
                  v-validate="'required|email'"
                  data-vv-name="email"
                  data-vv-as="Email"
                ></fg-input>
                <span class="text-danger" v-if="errors.has('email')">{{ errors.first('email') }}</span>
                <p-button slot="footer" type="primary" round block class="mb-3" @click="signIn">Xác nhận</p-button>
              </card>
            </div>
          </div>
        </div>
        <div class="full-page-background" style="background-image: url(static/img/background/background-2.jpg) "></div>
      </div>
    </div>
  </div>
</template>
<script>
import { Card, Checkbox, Button } from 'src/components/UIComponents';
import { Message } from 'element-ui';
import AppNavbar from './Layout/AppNavbar';
import AppFooter from './Layout/AppFooter';

export default {
  components: {
    Card,
    AppNavbar,
    AppFooter,
    [Checkbox.name]: Checkbox,
    [Button.name]: Button,
    Message,
  },
  methods: {
    toggleNavbar() {
      document.body.classList.toggle('nav-open');
    },
    closeMenu() {
      document.body.classList.remove('nav-open');
      document.body.classList.remove('off-canvas-sidebar');
    },
    signIn() {
      const self = this;
      this.$validator.validateAll().then((result) => {
        if (result) {
          const data = {};
          data.email = self.form.email;
          self.$store.dispatch('forgot', data).then((res) => {
            if (!res.code) {
              Message({
                message: 'Vui lòng chờ giây lát và kiểm tra lại email!',
                type: 'success',
              });
              self.$router.push('/login');
            } else {
              Message({
                message: res.message,
                type: 'error',
              });
            }
          }, (error) => {
            Message({
              message: error.message,
              type: 'error',
            });
          });
        }
      });
    },
  },
  data() {
    return {
      form: {
        email: '',
      },
    };
  },
  beforeDestroy() {
    this.closeMenu();
  },
};
</script>
<style>
</style>
