<template lang="html">
  <div class="row">
    <div class="col-md-8 col-sm-12 offset-md-2">
      <el-card>
        <div slot="header">
          <h6>{{$t('el.formCardTitle.postInformation')}}</h6>
        </div>
        <el-form :model="form" label-position="top">
          <el-form-item :label="$t('el.formCard.typePost')">
            <el-select v-model="form.type" style="width: 100%">
              <el-option v-for="opt in typePostOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('el.formCard.title')">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item :label="$t('el.formCard.content')">
            <el-input type="textarea" :rows="3" v-model="form.content"></el-input>
          </el-form-item>
          <el-form-item :label="$t('el.formCard.sendAt')">
            <el-date-picker  style="width: 100%" v-model="form.sendAt"></el-date-picker>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { Message, Input, Button, Form, FormItem, Select, Option, Card, DatePicker } from 'element-ui';
import MySelect from 'src/components/UIComponents/Select';

const _form = {}; const _custom_field = {}; let firstGroups; let
  secondGroups;

export default {
  components: {
    ElCard: Card,
    ElForm: Form,
    ElFormItem: FormItem,
    ElInput: Input,
    ElButton: Button,
    ElSelect: Select,
    ElOption: Option,
    ElDatePicker: DatePicker
  },

  data() {
    return {
      form: {
        title: '',
        content: '',
        type: 'news',
        sendAt: ''
      },
      typePostOptions: [
        {
          label: 'Tin tức',
          value: 'news'
        }
      ],
    };
  },
  mounted() {
    this.$store.dispatch('setPageTitle', this.$t('el.sidebar.warrantyPost'));
    this.$store.dispatch('setCurrentActions', [{
      label: this.$t('el.button.create'),
      type: 'primary',
      icon: '',
      callback: this.save,
    }]);

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
    save() {
      const self = this;
      this.$validator.validateAll().then((result) => {
        if (result) {
          self.$store.dispatch('storeWarrantyPost', self.form).then((res) => {
            Message({
              message: 'Tạo thành công',
              type: 'success',
            });
            self.$router.push({ path: `/post/${res.id}` });
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
