<template lang="html">
    <div>
        <form-card
          :group="group"
          v-model="form">
        </form-card>
    </div>
</template>

<script>
import warrantyPostForm from './warranty-post-form.js'
import FormCard from 'src/components/UIComponents/FormCard.vue';
import {Notification } from 'element-ui';

export default {
  components: {
    FormCard,
    Notification
  },
  data() {
    return {
        form: {},
        group: warrantyPostForm
    }
  },
  computed: {
      warrantyPost() {
          const detail = this.$store.state.warrantyPostDetail
          return detail
      }
  },
  watch: {
      warrantyPost(nVal, oVal) {
          if (nVal.id) {
              this.form = Object.assign({}, nVal)
          }
      }
  },
  mounted() {
    const id = this.$route.params.id;
    this.$store.dispatch('fetchWarrantyPostDetail', id);
    this.$store.dispatch('setPageTitle', 'Bài viết phòng bảo hành');
    this.$store.dispatch('setCurrentActions', [{
      label: 'Cập nhật',
      type: 'primary',
      icon: '',
      callback: this.save,
    }]);
  },
  methods: {
      async save() {
          try {
              const result = await this.$validator.validateAll()
              console.log(result)
              if (result) {
                  await this.$store.dispatch('updateWarrantyPost', Object.assign({}, this.form))
                  Notification({
                    title: 'Success',
                    message: 'Update succeeded',
                    position: 'bottom-right',
                    type: 'success',
                });
              }
          } catch(e) {
                Notification({
                    title: 'Error',
                    message: e.message,
                    position: 'bottom-right',
                    type: 'error',
                });
          }
      }
  }
}

</script>
<style lang="scss" scoped>

</style>
