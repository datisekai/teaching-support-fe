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
                <h3 slot="header" class="header text-center">Đăng nhập</h3>

                <fg-input
                  v-model="form.email"
                  addon-left-icon="nc-icon nc-email-85"
                  placeholder="Email..."
                  @keyup.enter="signIn"
                  :class="errors.has('email') ? 'border-danger' : ''"
                  v-validate="'required|email'"
                  data-vv-name="email"
                  data-vv-as="Email"
                ></fg-input>
                <span class="text-danger" v-if="errors.has('email')">{{
                  errors.first("email")
                }}</span>

                <fg-input
                  v-model="form.password"
                  addon-left-icon="nc-icon nc-key-25"
                  placeholder="Mật khẩu"
                  type="password"
                  @keyup.enter="signIn"
                  :class="errors.has('password') ? 'border-danger' : ''"
                  v-validate="'required'"
                  data-vv-name="password"
                  data-vv-as="Mật khẩu"
                ></fg-input>
                <span class="text-danger" v-if="errors.has('password')">{{
                  errors.first("password")
                }}</span>
                <br />
                <router-link to="/forgot">Quên mật khẩu?</router-link>
                <p-button
                  slot="footer"
                  type="primary"
                  round
                  block
                  class="mb-3"
                  @click="signIn"
                  >Đăng nhập</p-button
                >
              </card>
            </div>
          </div>
        </div>
        <div
          class="full-page-background"
          style="background-image: url(static/img/background/background-2.jpg) "
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
import { Card, Checkbox, Button } from "src/components/UIComponents";
import { Message } from "element-ui";
import AppNavbar from "./Layout/AppNavbar";
import AppFooter from "./Layout/AppFooter";
import { mapActions } from "vuex";

export default {
  components: {
    Card,
    AppNavbar,
    AppFooter,
    [Checkbox.name]: Checkbox,
    [Button.name]: Button,
    Message
  },
  methods: {
    ...mapActions(["login"]),
    toggleNavbar() {
      document.body.classList.toggle("nav-open");
    },
    closeMenu() {
      document.body.classList.remove("nav-open");
      document.body.classList.remove("off-canvas-sidebar");
    },
    async signIn() {
      const isValid = await this.$validator.validateAll();
      if (!isValid) {
        return Message({
          message: "Email và mật khẩu là bắt buộc",
          type: "error"
        });
      }
      const credentials = {
        email: this.form.email,
        password: this.form.password
      };
      try {
        await this.login(credentials);
        Message({
          message: "Đăng nhập thành công",
          type: "success"
        });

        setTimeout(() => {
          this.$router.push("/");
        }, 1000);
      } catch (error) {
        return Message({
          message: error.message,
          type: "error"
        });
      }
    }
  },
  data() {
    return {
      form: {
        email: "",
        password: ""
      }
    };
  },
  beforeDestroy() {
    this.closeMenu();
  }
};
</script>
