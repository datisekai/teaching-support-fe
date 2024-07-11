<template lang="html">
  <div class="row">
    <div class="col-lg-8 col-md-8 col-sm-12">
      <form-card
        v-for="(group, index) of centerGroups"
        :key="'groupleft' + index"
        :group="group"
        v-model="form"
      ></form-card>
    </div>
    <div class="container-fluid">
      <div class="page-action">
        <el-button @click="cancel">{{$t('el.button.cancel')}}</el-button>
        <el-button type="primary" @click="save">{{$t('el.button.create')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import FormCard from 'src/components/UIComponents/FormCard.vue';
import { Input, Button, Notification } from 'element-ui';
import MySelect from 'src/components/UIComponents/Select';
import dataFrom from './user-form';

let firstGroups, secondGroups, _form = {};

export default {
  components: {
    ElInput: Input,
    ElButton: Button,
    FormCard,
    MySelect,
  },
  beforeCreate() {
    firstGroups = dataFrom[0].groups.map(group => {
      const attributes = group.attributes.concat({
        prop: 'password',
        label: 'password',
        validate: 'required',
        type: 'password',
      });
      return Object.assign({}, group, {attributes});
    });
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
      sideGroups: secondGroups,
    };
  },
  mounted() {
    this.$store.dispatch('setPageTitle', 'Tạo đại lý');
    this.$store.dispatch('setCurrentActions', [{
      label: 'create',
      type: 'primary',
      icon: '',
      callback: this.save,
    }]);
  },
  methods: {
    cancel() {
      this.$router.push({ name: 'AllAgency' });
    },
    save() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.form.username = this.form.email;
          this.$store.dispatch('storeUser', Object.assign({}, this.form, {role: 'admin_agency'})).then((res) => {
            Notification({
              title: 'Success',
              message: 'Create succeeded',
              position: 'bottom-right',
              type: 'success',
            });
            setTimeout(()=> {
              this.$router.push({name: 'EditAgency', params: {id: res.id}});
            }, 1000);
          }, (error) => {
            Notification({
              title: 'Error',
              message: error.message,
              position: 'bottom-right',
              type: 'error',
            });
          });
        }
      });
    },
  },
  destroyed() {
    this.$store.dispatch('setCurrentActions', []);
  },
};
</script>
