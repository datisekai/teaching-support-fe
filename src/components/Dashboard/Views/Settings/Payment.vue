<template>
  <div class="row">

  </div>
</template>
<script>

export default {
  components: {

  },
  computed: {
  },
  data() {
    return {

    };
  },
  mounted() {
    window.AP = this;

    this.$store.dispatch('setPageTitle', 'Thanh toán');
  },
  methods: {

  },
};
</script>
<style lang="scss">

</style>
