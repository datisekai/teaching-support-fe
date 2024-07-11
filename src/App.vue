<template>
  <div :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications transition-name="notification-list" transition-mode="out-in">
    </notifications>
    <router-view name="header"></router-view>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <router-view name="footer"></router-view>
  </div>
</template>

<script>
// Loading some plugin css asynchronously
// Loading some plugin css asynchronously
import { mapState, mapActions } from "vuex";
import { use } from "element-ui/lib/locale";
import enLocale from "element-ui/lib/locale/lang/en";
import api from "./api";

export default {
  computed: {
    ...mapState(["compo_langs", "language", "token", "fetchUsers"])
  },
  async mounted() {
    this.localize(this.language);
    api.onUnauthorized(err => {
      this.authLogout();
      this.$router.push("/login");
    });
    if (!this.isAuthorized()) {
      this.$router.push("/login");
    }
    // this.$store.dispatch('fetchProvinces');
    // this.$store.dispatch('fetchUsers', {roles: ['admin', 'manager', 'supporter','admin_warranty', 'vice_admin_warranty', 'warranty_manager', 'technical_leader','technician']});
    this.checkToken();
  },
  methods: {
    ...mapActions(["checkToken", "authLogout"]),
    localize(lang) {
      let langLocale = this.compo_langs[lang];
      use(langLocale || enLocale);
    },
    isAuthorized() {
      return !!this.token;
    }
  },
  watch: {
    language(val) {
      this.localize(val);
    }
  }
};
</script>
<style lang="scss">
.vc-compact {
  width: 245px !important;
  .vc-compact-color-item {
    width: 35px !important;
    height: 35px !important;
  }
  .vc-compact-dot {
    top: 10px;
    right: 10px;
    bottom: 10px;
    left: 10px;
  }
}
</style>
