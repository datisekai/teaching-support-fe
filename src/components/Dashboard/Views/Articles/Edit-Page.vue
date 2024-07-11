<template lang="html">
  <div class="row">
    <div class="col-lg-8 col-md-8 col-sm-12">
      <form-card
        v-for="(group, index) of centerGroups"
        :key="'group' + index"
        :group="group"
        v-model="form"
      ></form-card>
     
    </div>
    <div class="col-lg-4 col-md-4 col-sm-12">
      <div class="card">
        <div class="card-header">
          <h6 class="title">{{$t('el.formCardTitle.moreInformation')}}</h6>
        </div>
        <div class="card-body form-card">
          <div class="row">
            <div class="col-sm-12 p-0">
              <label>{{$t('el.formCard.image')}}</label>
              <my-image-upload-single v-model="form.image"></my-image-upload-single>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="page-action">
        <el-button @click="cancel">{{$t('el.button.cancel')}}</el-button>
        <el-button type="primary" @click="save">{{$t('el.button.update')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Notification, MessageBox, Input, Button, Switch } from 'element-ui';
import FormCard from 'src/components/UIComponents/FormCard.vue';
import MySelect from 'src/components/UIComponents/Select';
import MyImageUploadSingle from 'src/components/UIComponents/ImageUploadSingle';
import dataFrom from './page-form';
import { mapState } from 'vuex';
import util from '@/helpers/util';

const _form = {}; let firstGroups; let secondGroups;

export default {
  components: {
    ElSwitch: Switch,
    ElInput: Input,
    ElButton: Button,
    FormCard,
    MySelect,
    MyImageUploadSingle,
  },
  beforeCreate() {
    firstGroups = dataFrom[0].groups;
    firstGroups.forEach((group) => {
      group.attributes.forEach((attr) => {
        if (attr.multiple && _form[attr.prop]) {
          _form[attr.prop] = [];
        } else {
          _form[attr.prop] = '';
        }
        attr.value = _form[attr.prop];
      });
    });
  },
  data() {
    return {
      form: _form,
      centerGroups: firstGroups,
    };
  },
  computed: {
    ...mapState(['pageDetail']),
  },
  mounted() {
    const id = this.$route.params.id;
    this.$store.dispatch('fetchPageDetail', id);
    this.$store.dispatch('setPageTitle', 'Cập nhật trang nội dung');
    this.$store.dispatch('setCurrentActions', [ {
      label: 'delete',
      type: 'warning',
      icon: '',
      callback: this.remove,
    }, {
      label: 'update',
      type: 'primary',
      icon: '',
      callback: this.save,
    }]);
  },
  methods: {
    cancel() {
      this.$router.push({ name: 'AllPages' });
    },
    remove() {
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        this.$store.dispatch('removePage', this.form.id).then((res) => {
          Notification ({
            title: 'Success',
            message: 'Delete completed',
            position: 'bottom-right',
            type: 'success',
          });
          this.$router.push({ name: 'AllPages' });
        });
      }).catch(() => {
        Notification ({
          title: 'Canceled',
          message: 'Delete canceled',
          position: 'bottom-right',
          type: 'info',
        });
      });
    },
    save() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$store.dispatch('updatePage', this.form).then((res) => {
            Notification({
              title: 'Success',
              message: 'Update succeeded',
              position: 'bottom-right',
              type: 'success',
            })
          }, (error) => {
            Notification({
              title: 'Error',
              message: error.message,
              position: 'bottom-right',
              type: 'error',
            })
          });
        }
      });
    },
  },
  watch: {
    'form.title': function(newVal, oldval) {
      this.form.slug = this.$util.createHandle(newVal);
    },
    pageDetail(newVal, oldVal) {
      this.form = {
        ...this.form,
        ...newVal
      };
    }
  },
  destroyed() {
    this.$store.dispatch('setCurrentActions', []);
  },
};
</script>
