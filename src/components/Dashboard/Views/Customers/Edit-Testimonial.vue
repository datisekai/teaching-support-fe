<template lang="html">
  <div class="row">
    <div class="col-lg-8 col-md-8 col-sm-12">
      <form-card
        v-for="(group, index) of centerGroups"
        :key="'groupleft' + index"
        :group="group"
        v-model="form"
      ></form-card>
      <custom-field
        v-if="customField.length > 0"
        :group="customField"
        v-model="custom_field"
      ></custom-field>
    </div>
    <div class="col-lg-4 col-md-4 col-sm-12">
      <form-card
        v-for="(group, index) of sideGroups"
        :key="'groupright' + index"
        hasTop="true"
        :group="group"
        v-model="form"
      >
      </form-card>
    </div>
    <div class="container-fluid">
      <div class="page-action">
        <el-button @click="cancel">Hủy</el-button>
        <el-button type="primary" @click="save">Cập nhật</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import FormCard from 'src/components/UIComponents/FormCard.vue';
import CustomField from 'src/components/UIComponents/CustomField.vue';
import {
  Message, MessageBox, Input, Button,
} from 'element-ui';
import MySelect from 'src/components/UIComponents/Select';
import dataFrom from './testimonial-form';
import { mapState } from 'vuex';
import util from '@/helpers/util';

const _form = {}; let _custom_field = {}; let firstGroups; let
  secondGroups;

export default {
  components: {
    FormCard,
    ElInput: Input,
    ElButton: Button,
    MySelect,
    CustomField,
  },
  beforeCreate() {
    firstGroups = dataFrom[0].groups;
    secondGroups = dataFrom[1].groups;

    if (this.$store.state.customFieldDefine) {
      _custom_field = this.$store.state.customFieldDefine.reduce((result, item) => {
        result[item.handle] = '';
        return result;
      }, {});
    }

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
    secondGroups.forEach((group) => {
      group.attributes.forEach((attr) => {
        if (attr.multiple && _form[attr.prop]) {
          _form[attr.prop] = [];
        } else {
          _form[attr.prop] = '';
        }
        attr.value = _form[attr.prop];
      });
    });

    let id = this.$route.params.id;
    this.$store.dispatch('getCustomField', {type: 'testimonial', id});
  },
  data() {
    return {
      centerGroups: firstGroups,
      sideGroups: secondGroups,
      custom_field: _custom_field,
    };
  },
  computed: {
    ...mapState({
      originalForm: state => state.testimonialDetail,
    }),
    form: {
      get() {
        return this.originalForm;
      },
      set(value) {},
    },
    customField: {
      get() {
        const data = this.$store.state.customField;
        for (const item of data) {
          if (item.value) {
            _custom_field[item.handle] = item.value;
          } else {
            _custom_field[item.handle] = '';
          }
        }
        return data || '';
      },
      set(value) {},
    },
  },
  mounted() {
    const id = this.$route.params.id;
    this.$store.dispatch('fetchTestimonialDetail', id);

    this.$store.dispatch('setPageTitle', 'Cập nhật khách hàng nói về chúng tôi');
    this.$store.dispatch('setCurrentActions', [{
      label: 'Xóa',
      type: 'warning',
      icon: '',
      callback: this.remove,
    }, {
      label: 'Cập nhật',
      type: 'primary',
      icon: '',
      callback: this.save,
    }]);
  },
  methods: {
    cancel() {
      this.$router.push({ name: 'AllTestimonial' });
    },
    remove() {
      const self = this;
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        this.$util.updateStatusAll('testimonial', [self.form], 'delete').then((result) => {
          self.$store.dispatch('fetchTestimonial');
          Message({
            type: 'success',
            message: 'Xóa thành công',
          });
          self.$router.push({ name: 'AllTestimonial' });
        }).catch((error) => {
          Message({
            type: 'error',
            message: error.message,
          });
        });
      }).catch(() => {
        Message({
          type: 'info',
          message: 'Hủy bỏ',
        });
      });
    },
    save() {
      const self = this;
      this.$validator.validateAll().then((result) => {
        if (result) {
          self.$store.dispatch('updateTestimonial', self.form).then((res) => {
            const arr_custom_field = [];
            for (const item of self.customField) {
              const obj = {};
              obj.title = item.title;
              obj.handle = item.handle;
              obj.post_type = 'testimonial';
              obj.post_id = self.form.id;
              obj.value = self.custom_field[obj.handle];
              arr_custom_field.push(obj);
            }

            self.$store.dispatch('storeCustomField', arr_custom_field);

            Message({
              message: 'Cập nhật thành công',
              type: 'success',
            });
          }, (res) => {
            Message({
              message: res.message,
              type: 'error',
            });
          });
        }
      });
    },
  },
  destroyed() {
    this.$store.dispatch('setCurrentActions', []);
    this.$store.state.testimonialDetail = [];
    this.$store.state.customField = [];
  },
};
</script>
