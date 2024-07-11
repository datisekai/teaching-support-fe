<template lang="html">
    <div>
        <form-card
          :group="group"
          v-model="form">
        </form-card>
    </div>
</template>

<script>
import educationPostForm from './education-post-form.js'
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
        group: educationPostForm
    }
  },
  computed: {
      educationPost() {
          const detail = this.$store.state.educationPostDetail
          return detail
      }
  },
  watch: {
      educationPost(nVal, oVal) {
          if (nVal.id) {
              this.form = Object.assign({}, nVal)
          }
      }
  },
  mounted() {
    const id = this.$route.params.id;
    this.$store.dispatch('fetchEducationPostDetail', id);
    this.$store.dispatch('setPageTitle', 'Bài viết phòng giáo dục');
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
                await this.$store.dispatch('updateEducationPost', Object.assign({}, this.form))
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
