<template>
  <div style="margin: -10px 0 0 0">
    <xpl
      class="full-width"
      isFooter=false
    ></xpl>
  </div>
</template>
<script>
import xpl from 'src/components/UIComponents/xpl/App';

export default {
  components: {
    xpl,
  },
  computed: {
  },
  data() {
    return {

    };
  },
  mounted() {
    window.AP = this;

    this.$store.dispatch('setPageTitle', 'Tập tin');
  },
  methods: {

  },
};
</script>
<style lang="scss">

</style>
