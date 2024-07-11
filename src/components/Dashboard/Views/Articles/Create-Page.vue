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
          <h6 class="title">{{$t('el.formCardTitle.moreInformation')}}</h6>
        </div>
        <div class="card-body form-card">
          <div class="row">
            <div class="col-sm-12 p-0">
              <label>{{$t('el.formCard.image')}}</label>
              <my-image-upload-single v-model="form.image"></my-image-upload-single>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12 p-0">
             <el-switch 
                v-model="form.isActive" 
                :active-value='true' 
                :inactive-value='false' 
                :active-text="$t('el.formCard.isActive')">
              </el-switch>
            </div>
          </div>
        </div>
      </div>
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
import dataFrom from './page-form';
import { Notification, Input, Button, Switch } from 'element-ui';
import MySelect from 'src/components/UIComponents/Select';
import FormCard from 'src/components/UIComponents/FormCard.vue';
import MyImageUploadSingle from 'src/components/UIComponents/ImageUploadSingle';

const _form = {}; let firstGroups; let secondGroups;

export default {
  components: {
    ElInput: Input,
    ElButton: Button,
    ElSwitch: Switch,
    FormCard,
    MySelect,
    MyImageUploadSingle,
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
  },
  data() {
    return {
      centerGroups: firstGroups,
      sideGroups: secondGroups,
      form: _form,
      show_fields: [],
    };
  },
  mounted() {
    this.$store.dispatch('setPageTitle', 'pageCreate');
    this.$store.dispatch('setCurrentActions', [{
      label: 'create',
      type: 'primary',
      icon: '',
      callback: this.save,
    }]);
    this.init();
  },
  methods: {
    init() {
      this.form.isActive = true;
    },
    cancel() {
      this.$router.push({ name: 'AllPages' });
    },
    save() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$store.dispatch('storePage', this.form).then((res) => {
            Notification({
              title: 'Success',
              message: 'Create succeeded',
              position: 'bottom-right',
              type: 'success',
            });
            setTimeout(()=> {
              this.$router.push({name: 'EditPage', params: {id: res.id}});
            }, 1000);
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
    'form.title': function (newVal, oldVal) {
      this.form.slug = this.$util.createHandle(newVal);
    },
  },
  destroyed() {
    this.$store.dispatch('setCurrentActions', []);
  },
};
</script>
