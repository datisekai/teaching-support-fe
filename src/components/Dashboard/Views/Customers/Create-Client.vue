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
        :value="custom_field"
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
        <el-button type="primary" @click="save">Lưu lại</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import FormCard from 'src/components/UIComponents/FormCard.vue';
import CustomField from 'src/components/UIComponents/CustomField.vue';
import { Message, Input, Button } from 'element-ui';
import MySelect from 'src/components/UIComponents/Select';
import dataFrom from './client-form';

const _form = {}; const _custom_field = {}; let firstGroups; let
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
    this.$store.dispatch('getCustomField', { type: 'client' });
  },
  data() {
    return {
      centerGroups: firstGroups,
      sideGroups: secondGroups,
      form: _form,
      custom_field: _custom_field,
    };
  },
  mounted() {
    this.$store.dispatch('setPageTitle', 'Tạo mới');
    this.$store.dispatch('setCurrentActions', [{
      label: 'Lưu lại',
      type: 'primary',
      icon: '',
      callback: this.save,
    }]);

    this.form.status = 'active';
    this.form.priority = 1000;
  },
  computed: {
    customField: {
      get() {
        return this.$store.state.customField;
      },
      set(value) {},
    },
  },
  methods: {
    cancel() {
      this.$router.push({ name: 'AllClient' });
    },
    save() {
      const self = this;
      this.$validator.validateAll().then((result) => {
        if (result) {
          self.$store.dispatch('storeClient', self.form).then((res) => {
            const arr_custom_field = [];
            for (const item of self.customField) {
              const obj = {};
              obj.title = item.title;
              obj.handle = item.handle;
              obj.post_type = 'client';
              obj.post_id = res.id;
              obj.value = self.custom_field[obj.handle] || '';
              arr_custom_field.push(obj);
            }

            self.$store.dispatch('storeCustomField', arr_custom_field);

            Message({
              message: 'Tạo thành công',
              type: 'success',
            });
            setTimeout(() => {
              self.$router.push({ path: `/client/${res.id}` });
            }, 1000);
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
    this.$store.state.customField = [];
  },
};
</script>
