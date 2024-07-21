<template>
  <div
    class="sidebar"
    :data-color="backgroundColor"
    :data-active-color="activeColor"
  >
    <div class="logo">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a
            class="simple-text logo-normal"
            style="width: 180px; padding: 15px; font-size: 14px"
            :href="host"
          >
            <img :src="sidebarLogo" alt="conmeodat" width="30" class="mr-1" />
            PORTAL
          </a>
        </li>
        <drop-down
          icon="fa fa-flag-o"
          tag="li"
          position="right"
          direction="none"
          class="nav-item dropdown"
          style="justify-content: center; align-items: center; display: flex;"
        >
          <a
            slot="title"
            slot-scope="{ isOpen }"
            class="nav-link dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="isOpen"
            style="color: white"
          >
            <i class="fa fa-flag-o"></i>
          </a>
          <a
            v-for="lang of languages"
            :key="lang"
            class="dropdown-item"
            @click="changeLang(lang)"
            >{{ lang }}
            <i
              v-if="lang == language"
              class="fa fa-check"
              aria-hidden="true"
            ></i>
          </a>
        </drop-down>
      </ul>
    </div>
    <div
      class="sidebar-wrapper"
      ref="sidebarScrollArea"
      style="height: calc(100% - 70px)"
    >
      <slot></slot>
      <ul class="nav">
        <slot name="links">
          <sidebar-item
            v-for="(link, index) in sidebars"
            :key="link.name + index"
            :link="link"
            ref="detailsChild"
          >
            <sidebar-item
              v-for="(subLink, index) in link.children"
              :key="subLink.name + index"
              :link="subLink"
            >
            </sidebar-item>
          </sidebar-item>
        </slot>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: {
    title: {
      type: String,
      default: "Portal",
      description: "Teaching support portal"
    },
    backgroundColor: {
      type: String,
      default: "black",
      validator: value => {
        let acceptedValues = ["white", "brown", "black"];
        return acceptedValues.indexOf(value) !== -1;
      },
      description: "Sidebar background color (white|brown|black)"
    },
    activeColor: {
      type: String,
      default: "success",
      validator: value => {
        let acceptedValues = [
          "primary",
          "info",
          "success",
          "warning",
          "danger"
        ];
        return acceptedValues.indexOf(value) !== -1;
      },
      description:
        "Sidebar active text color (primary|info|success|warning|danger)"
    },
    logo: {
      type: String,
      default: "/static/img/logo.png",
      description: "Sidebar Logo"
    },
    sidebarLinks: {
      type: Array,
      default: () => [],
      description:
        "Sidebar links. Can be also provided as children components (sidebar-item)"
    },
    autoClose: {
      type: Boolean,
      default: true
    }
  },
  provide() {
    return {
      autoClose: this.autoClose
    };
  },
  computed: {
    ...mapState([
      "sidebarLogo",
      "sidebarTitle",
      "languages",
      "language",
      "role"
    ]),
    sidebars() {
      return this.sidebarLinks
        .map(a => {
          return JSON.parse(JSON.stringify(a));
        })
        .filter(s => {
          if (s.children && s.children.length) {
            s.children = s.children.filter(c => {
              const rolesChild = c.roles || "all";
              return rolesChild.includes(this.role) || roles == "all";
            });
          }
          const roles = s.roles || "all";
          return roles.includes(this.role) || roles == "all";
        });
    },
    host() {
      return process.env.VUE_APP_API_BASE_URL || "/";
    }
  },
  methods: {
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
    },
    minimizeSidebar() {
      this.$sidebar.toggleMinimize();
    },
    changeLang(lang) {
      this.$store.dispatch("changeLanguage", lang);
      this.$router.go();
    }
  },
  beforeDestroy() {
    if (this.$sidebar.showSidebar) {
      this.$sidebar.showSidebar = false;
    }
  }
};
</script>
<style>
@media (min-width: 992px) {
  .navbar-search-form-mobile,
  .nav-mobile-menu {
    display: none;
  }
}
.dropdown-menu.dropdown-menu-right {
  top: 70px;
  right: -15px;
  min-width: 70px;
  width: 70px;
}
.dropdown-menu.dropdown-menu-right.show {
  z-index: 1000;
  top: 45px;
  right: -15px;
}
.dropdown-menu .dropdown-item {
  padding: 10px 15px;
  text-transform: uppercase;
}
.sidebar .logo {
  z-index: 5 !important;
}
.fa.fa-flag-o {
  margin-right: 5px;
}
.sidebar .nav p,
.off-canvas-sidebar .nav p {
  padding-right: 25px;
  padding-left: 46px;
  white-space: unset !important;
}
</style>
