<template>
  <div class="row">
    <div class="col-sm-12 col-lg-8 col-md-8">
      <div class="card full-width">
        <div class="card-header">
          <h6 class="title">Chi tiết liên hệ</h6>
        </div>
        <div class="card-body form-card">
          <div class="row">
            <div class="col-sm-12 col-lg-12 col-md-12">
            <p>
              <b>Trạng thái: </b>
              <badge :type="parseType(contact.reply)">{{parseStatus(contact.reply)}}</badge>
            </p>
            <p>
              <b>Thời gian: </b>{{contact.created_at}}
            </p>
            <p>
              <b>Họ tên: </b>{{contact.name}}
            </p>
            <p>
              <b>Email: </b>{{contact.email}}
            </p>
            <p>
              <b>Điện thoại: </b>{{contact.phone}}
            </p>
            <hr>
            <b>Nội dung:</b>
            <div v-html="contact.content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-sm-12 col-lg-4 col-md-4">
      <div class="card full-width">
        <div class="card-header">
          <h6 class="title">Cập nhật trạng thái</h6>
        </div>
        <div class="card-body form-card">
          <div class="row">
            <my-select
              class="full-width"
              :attribute="status"
              placeholder="Trạng thái"
              v-model="contact.reply">
            </my-select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  Select, Option, Button, Input, Message, MessageBox,
} from 'element-ui';
import Badge from 'src/components/UIComponents/Badge.vue';
import MySelect from 'src/components/UIComponents/Select';
import { mapState } from 'vuex';

export default {
  components: {
    ElSelect: Select,
    ElOption: Option,
    ElButton: Button,
    ElInput: Input,
    Message,
    MySelect,
    Badge,
  },
  computed: {
    ...mapState({
      contact: state => state.contactDetail,
    }),
  },
  data() {
    return {
      status: {
        options: [
          {
            title: 'Đã phản hồi',
            value: 1,
          }, {
            title: 'Chưa phản hồi',
            value: 0,
          },
        ],
      },
    };
  },
  mounted() {
    this.$store.dispatch('setPageTitle', 'Chi tiết liên hệ');
    this.$store.dispatch('setCurrentActions', [{
      label: 'Cập nhật',
      type: 'primary',
      icon: '',
      callback: this.save
    },{
      label: 'Xóa',
      type: 'danger',
      icon: '',
      callback: this.remove
    }]);

    const id = this.$route.params.id;
    this.$store.dispatch('fetchContactDetail', id);
  },
  methods: {
    parseStatus(status) {
      switch (status) {
        case 'active': return 'Đang hiện';
        case 'inactive': return 'Đang ẩn';
        case 0: return 'Chưa phản hồi';
        case 1: return 'Đã phản hồi';
        default: return status;
      }
      return '';
    },
    parseType(type) {
      switch (type) {
        case 'active': return 'info';
        case 'inactive': return 'warning';
        case 0: return 'warning';
        case 1: return 'info';
        default: return 'default';
      }
      return 'default';
    },
    remove() {
      let self = this;
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        this.$store.dispatch('removeContact', self.contact.id).then((result) => {
          Message({
            type: 'success',
            message: 'Đã xóa thành công',
          });
          self.$router.push({ name: 'Contact' });
        }).catch((error) => {
          Message({
            type: 'error',
            message: error.message,
          });
        });
      });
    },
    cancel() {
      this.$router.push({ name: 'Contact' });
    },
    save() {
      let self = this;
      let data = {
        id: this.contact.id,
        type_status: 'reply',
        status: this.contact.reply == 1 ? 'reply' : 'unreply',
      };
      this.$store.dispatch('updateContact', data).then((result) => {
        Message({
          type: 'success',
          message: 'Cập nhật thành công',
        });
      }).catch((error) => {
        Message({
          type: 'error',
          message: error.message,
        });
      });
    }
  },
  destroyed() {
    this.$store.dispatch('setCurrentActions', []);
    this.$store.state.contactDetail = [];
  },
};
</script>
<style lang="scss">
  .el-table .td-actions{
  button.btn {
    margin-right: 5px;
  }
  }
</style>
