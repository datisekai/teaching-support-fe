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
          return this.$store.state.warrantyPostDetail
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
        this.$store.dispatch('setPageTitle', 'Bài viết phòng bảo hành')

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
              console.log(result)
              if (result) {
                let q = await this.$store.dispatch('createWarrantyPost', Object.assign({}, this.form, {department: 'warranty', category: ''}))
                Notification({
                title: 'Success',
                message: 'Create succeeded',
                position: 'bottom-right',
                type: 'success',
                });
                this.$router.push(`/warranty-post/${q.data.id}`)
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
