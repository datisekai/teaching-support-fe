<template lang="html">
    <div>
        <form-card
          :group="group"
          v-model="form">
        </form-card>
    </div>
</template>

<script>
import { MessageBox, Message } from 'element-ui'
import teacherForm from './teacher-form.js'
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
        group: {}
    }
  },
  computed: {
    teacher() {
        const detail = this.$store.state.teacherDetail
        return detail
    }
  },
    watch: {
        teacher(nVal, oVal) {
            if (nVal.id) {
                this.form = Object.assign({}, nVal)
                if (this.form.status !== 'new') {
                    let _form = Object.assign({}, teacherForm)
                    _form.attributes = _form.attributes.map((a) => ({
                        ...a,
                        disabled: true
                    }))
                    this.group = _form
                    this.$store.dispatch('setCurrentActions', [])
                    
                } else {
                    this.group = teacherForm
                    this.$store.dispatch('setCurrentActions', [
                    {
                        label: 'Từ chối',
                        type: 'danger',
                        icon: '',
                        callback: this.reject,
                    },
                    {
                        label: 'Xác nhận',
                        type: 'primary',
                        icon: '',
                        callback: this.confirm,
                    },
                    {
                        label: 'Cập nhật',
                        type: 'success',
                        icon: '',
                        callback: this.update,
                    }
                    ]);
                }
            }
        }
    },


  mounted() {
    const id = this.$route.params.id;
    this.$store.dispatch('fetchTeacherDetail', id);
    this.$store.dispatch('setPageTitle', 'Yêu cầu xác thực giáo viên');
  },
  methods: {
      reject(index, row) {
        MessageBox.confirm('Bạn có chắc chắn từ chối không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
        }).then(() => {
            this.$store.dispatch('rejectTeacher', this.form.id)
                .then((res) => {
                    if (res.success) {
                    Message({
                        message: 'Đã xóa',
                        type: 'success'
                    });
                } else {
                    Message({
                        message: res.message,
                        type: 'error'
                    });  
                }
                }, error => {
                    console.error(error);
                    });
                }).catch(() => {
                });
    },
    async confirm() {
        try {
            await MessageBox.confirm('Bạn có chắc chắn xác nhận không?', 'Warning', {
                confirmButtonText: 'Đồng ý',
                cancelButtonText: 'Hủy bỏ',
                type: 'warning',
                center: true,
            })
            await this.$store.dispatch('confirmTeacher', this.form.id)
            Notification({
                title: 'Success',
                message: 'Activate succeeded',
                position: 'bottom-right',
                type: 'success',
            });
        }
        catch(e) {
            Notification({
                title: 'Error',
                message: e.message,
                position: 'bottom-right',
                type: 'error',
            });
        }
    },
    async update() {
        try {
            const result = await this.$validator.validateAll()
            if (result) {
                await this.$store.dispatch('updateTeacher', Object.assign({}, this.form))
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
