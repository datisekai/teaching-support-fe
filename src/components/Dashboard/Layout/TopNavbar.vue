<template>
  <navbar :show-navbar="showNavbar" :transparent="false" :position="'fixed'">
    <div class="navbar-wrapper">
      <!-- <navbar-toggle-button></navbar-toggle-button> -->
      <a class="navbar-brand" href="#pablo">{{$t(`el.pageTitle.${pageTitle}`)}}</a>
    </div>
    <template slot="navbar-menu">
      <el-button
        icon
        v-for="(action, index) in actions"
        @click="action.callback"
        :type="action.type"
        :disabled="action.disabled"
        :class="actions.length > 1 ? 'd-none d-sm-none d-md-none d-lg-block d-xl-block':''"
        :key="'btn' + index"
        :loading="action.loading && loadingAction[action.title]"
      >
        <i :class="action.icon"></i>
        {{$t(`el.button.${action.label || action.title}`)}}
      </el-button>
      <el-dropdown split-button type="primary" v-if="actions.length > 1" :class="actions.length > 1 ? 'd-block d-sm-block d-md-block d-lg-none d-xl-none btn-dropdown-action' : ''">
        Hành động
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(action, index) in actions" @click="action.callback" :key="'dropdown' + index">
            <el-button
              @click="action.callback"
              type="text"
              class="full-width text-left"
            >
              {{$t(`el.button.${action.label || action.title}`)}}
            </el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
  </navbar>
</template>
<script>
  import { Navbar, NavbarToggleButton, Modal, FgInput } from 'src/components/UIComponents'
  import {Button, Dropdown, DropdownMenu, DropdownItem} from 'element-ui'
  import {mapState} from 'vuex'

  export default {
    components: {
      Navbar,
      NavbarToggleButton,
      Modal,
      FgInput,
      ElButton: Button,
      ElDropdown: Dropdown,
      ElDropdownMenu: DropdownMenu,
      ElDropdownItem: DropdownItem,
    },
    data() {
      return {
        activeNotifications: false,
        showNavbar: false,
        modals: {
          classic: false
        }
      }
    },
    computed: mapState({
      actions: 'currentActions',
      pageTitle: 'pageTitle',
      loadingAction: 'loadingAction'
    }),
    methods: {
      capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      },
      toggleNotificationDropDown() {
        this.activeNotifications = !this.activeNotifications
      },
      closeDropDown() {
        this.activeNotifications = false
      },
      toggleNavbar() {
        this.showNavbar = !this.showNavbar;
      },
      changePassword() {

      },
      dispatchAction(action, link) {
        if (link === undefined) {
          this.$store.dispatch(action);
        } else {
          this.$store.dispatch(action, link);
        }
      }
    }
  }

</script>
<style>
  .navbar-toggler {
    cursor: pointer;
    border: 1px solid #ccc;
    padding: 3px;
    width: 30px !important;
    height: 30px !important;
    color: #0EADB8;
  }

  .btn-dropdown-action .el-button-group{
    width: 150px;
  }
</style>
