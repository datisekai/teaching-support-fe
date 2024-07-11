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
          return this.$store.state.educationPostDetail
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
        this.$store.dispatch('setPageTitle', 'Bài viết phòng giáo dục')

        this.$store.dispatch('setCurrentActions', [{
            label: 'Tạo',
            type: 'primary',
            icon: '',
            callback: this.save,
        }]);
  },
  methods: {
      async save() {
          try {
              const result = await this.$validator.validateAll()
              if (result) {
                let q = await this.$store.dispatch('createEducationPost', Object.assign({}, this.form, {department: 'education', category: ''}))
                Notification({
                title: 'Success',
                message: 'Create succeeded',
                position: 'bottom-right',
                type: 'success',
                });
                this.$router.push(`/education/post/${q.data.id}`)
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
