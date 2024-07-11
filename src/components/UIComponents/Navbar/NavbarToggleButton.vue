<template>
  <button type="button" class="navbar-toggler"  @click="showSidebar">
    <i class="fa fa-bars"></i>
  </button>
</template>
<script>
  export default {
    name: 'NavbarToggleButton',
    methods: {
      showSidebar() {
        this.$sidebar.showSidebar = !this.$sidebar.showSidebar;
      },
    },
  }
</script>
<style>
</style>
