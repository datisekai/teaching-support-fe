<template>
  <div class="user">
    <!-- <div class="photo" data-toggle="collapse" :aria-expanded="!isClosed" @click="toggleMenu">
      <img :src="sidebarLogo" alt="">
    </div> -->
    <div class="info">
      <a
        data-toggle="collapse"
        :aria-expanded="!isClosed"
        @click="toggleMenu"
        href="#"
        class="block-photo"
      >
        <span>
          {{ user.fullname || user.username }}
          <b class="caret"></b>
        </span>
      </a>
      <a :href="host" target="_blank" title="Xem website" class="next-preview"
        ><i class="fa fa-external-link"></i
      ></a>
      <div class="clearfix"></div>
      <div>
        <collapse-transition>
          <ul
            class="nav nav-menu"
            style="padding-left: 44px;"
            v-show="!isClosed"
          >
            <!-- <li>
              <a href="#" @click="gotoUser">
                <span class="sidebar-mini-icon"></span>
                <span class="sidebar-normal">{{$t('el.sidebar.myAccount')}}</span>
              </a>
            </li> -->
            <li>
              <a href="#" @click="logout">
                <span class="sidebar-mini-icon"></span>
                <span class="sidebar-normal">{{
                  $t("el.sidebar.logOut")
                }}</span>
              </a>
            </li>
          </ul>
        </collapse-transition>
      </div>
    </div>
  </div>
</template>
<script>
import { CollapseTransition } from "vue2-transitions";
import { Message } from "element-ui";
import { mapState } from "vuex";

export default {
  components: {
    CollapseTransition,
    Message
  },
  computed: {
    ...mapState(["sidebarLogo", "sidebarTitle", "user"]),
    host() {
      return process.env.VUE_APP_API_BASE_URL || "/";
    }
  },
  data() {
    return {
      isClosed: true
    };
  },
  methods: {
    toggleMenu() {
      this.isClosed = !this.isClosed;
    },
    logout() {
      this.$store.dispatch("authLogout").then(res => {
        Message({
          message: "Đăng xuất thành công",
          type: "success"
        });
        this.$router.push({ name: "Login" });
      });
    },
    gotoUser() {
      this.$router.push("/users/" + this.user.id);
    }
  }
};
</script>
<style scoped>
.nav.nav-menu {
  margin-top: 0;
}
.next-preview {
  position: absolute;
  font-size: 18px;
  padding: 0;
  top: 0px !important;
  right: 8px;
}
.user .photo,
.user .block-photo {
  cursor: pointer;
  height: 40px;
  padding-left: 30px;
}
.sidebar .user {
  padding-bottom: 1px;
}
</style>
