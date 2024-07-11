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
                <h3 slot="header" class="header text-center">Tạo mật khẩu</h3>
                <fg-input
                  v-model="form.password"
                  addon-left-icon="nc-icon nc-key-25"
                  placeholder="Mật khẩu"
                  type="password"
                  @keyup.enter="signIn"
                  :class="errors.has('password')?'border-danger':''"
                  v-validate="'required'"
                  data-vv-name="password"
                  data-vv-as="Mật khẩu"
                ></fg-input>
                <span class="text-danger" v-if="errors.has('password')">{{ errors.first('password') }}</span>
                <fg-input
                  v-model="form.repeat_password"
                  addon-left-icon="nc-icon nc-key-25"
                  placeholder="Nhập lại mật khẩu"
                  type="password"
                  @keyup.enter="signIn"
                  :class="errors.has('repeat_password')?'border-danger':''"
                  v-validate="'required'"
                  data-vv-name="repeat_password"
                  data-vv-as="Nhập lại mật khẩu"
                ></fg-input>
                <span class="text-danger" v-if="errors.has('repeat_password')">{{ errors.first('repeat_password') }}</span>
                <p-button slot="footer" type="primary" round block class="mb-3" @click="signIn">Tạo mật khẩu</p-button>
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
          data.password = self.form.password;
          data.repeat_password = self.form.repeat_password;
          data.random = self.$route.params.token;
          if (data.password != data.repeat_password) {
            return Message({
              message: 'Mật khẩu không chính xác',
              type: 'error',
            });
          }
          self.$store.dispatch('createPassword', data).then((res) => {
            if (!res.code) {
              Message({
                message: 'Tạo mật khẩu thành công',
                type: 'success'
              });
              setTimeout(() => {
                self.$router.push('/login');
              }, 1000);
            } else {
              Message({
                message: res.message,
                type: 'error'
              });
            }
          }, (error) => {
            console.error(error);
          });
        }
      });
    },
  },
  data() {
    return {
      form: {
        password: '',
        repeat_password: '',
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
