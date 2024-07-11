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
    <div class="col-lg-4 col-md-4 col-sm-12">
      <div class="card">
        <div class="card-header">
          <h6 class="title">{{$t('el.formCardTitle.role')}}</h6>
        </div>
        <div class="card-body form-card">
          <div class="col-sm-12 p-0">
            <my-select
              class="full-width"
              data-vv-name="role"
              v-model="form.role"
              v-validate="'required'"
              :data-vv-as="$t('el.formCard.role')"
              :placeholder="$t('el.formCard.role')"
              :attribute="{options: $util.getOptions('role')}"
              :class="errors.has('role')?'border-danger':''"
            >
            </my-select>
            <span class="text-danger" v-if="errors.has('role')">{{ errors.first('role') }}</span>
          </div>
        </div>
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
    _form.role_id = '';
  },
  data() {
    return {
      form: _form,
      centerGroups: firstGroups,
      sideGroups: secondGroups,
    };
  },
  mounted() {
    this.$store.dispatch('setPageTitle', 'accountCreate');
    this.$store.dispatch('setCurrentActions', [{
      label: 'create',
      type: 'primary',
      icon: '',
      callback: this.save,
    }]);
  },
  methods: {
    save() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.form.username = this.form.email;
          this.$store.dispatch('storeUser', this.form).then((res) => {
            Notification({
              title: 'Success',
              message: 'Create succeeded',
              position: 'bottom-right',
              type: 'success',
            });
            setTimeout(()=> {
              this.$router.push({name: 'EditUser', params: {id: res.id}});
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
