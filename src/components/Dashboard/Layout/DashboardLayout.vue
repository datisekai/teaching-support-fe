<template>
  <div class="wrapper" :data-links="sidebarLinks.length">
    <side-bar
      type="sidebar"
      :sidebar-links="sidebarLinks"
      :logo="this.$store.state.sidebarLogo"
    >
      <user-menu></user-menu>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar"> </dashboard-content>

      <!-- <content-footer></content-footer> -->
    </div>
  </div>
</template>

<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import UserMenu from "src/components/UIComponents/SidebarPlugin/UserMenu.vue";
import { mapState } from "vuex";
// import * as firebase from "firebase/app";
// import '@firebase/messaging';

export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    UserMenu
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    }
  },
  created() {},
  computed: {
    ...mapState(["sidebarLinks"])
  }
  // mounted() {
  //   this.$store.dispatch('initSidebar');
  // }
};
</script>
