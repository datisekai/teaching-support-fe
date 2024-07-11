<template lang="html">
  <div class="row">
    <div class="col-lg-8 col-md-8 col-sm-12">
      <form-card
        v-for="(group, index) of centerGroups"
        :key="'groupleft' + index"
        :group="group"
        v-model="form"
        @updateHandle="updateHandle"
      ></form-card>
      <custom-field
        v-if="customField && customField.length > 0"
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
      <div class="card" v-if="listView">
        <div class="card-header">
          <h6 class="title">Giao diện</h6>
        </div>
        <div class="card-body form-card">
          <div class="row">
            <div class="col-sm-12 p-0">
              <my-select
                class="full-width"
                :attribute="listView"
                placeholder="Giao diện"
                v-model="form.template"
              >
              </my-select>
            </div>
          </div>
        </div>
      </div>
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
import dataFrom from './blog-form';

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
    _form.template = '';
    this.$store.dispatch('getClassCustomField', 'blog');
    this.$store.dispatch('getListThemeView', 'blog');
  },
  data() {
    return {
      centerGroups: firstGroups,
      sideGroups: secondGroups,
      form: _form,
      custom_field: _custom_field,
      show_fields: [],
      is_disabled: false
    };
  },
  computed: {
    customField: {
      get() {
        return this.$util.filterByHandle(this.$store.state.classCustomField, this.show_fields);
      },
      set(value) {},
    },
    listView() {
      const self = this;
      const listTheme = self.$store.state.listThemeView;
      if (listTheme && listTheme.length) {
        listTheme.unshift({
          title: 'Mặc định',
          value: '',
        });
        return {
          options: listTheme,
        };
      }
      return '';
    },
  },
  mounted() {
    this.$store.dispatch('setPageTitle', 'Tạo nhóm bài viết');
    this.$store.dispatch('setCurrentActions', [{
      label: 'Lưu lại',
      type: 'primary',
      icon: '',
      callback: this.save,
    }]);
    this.getContext();
    this.form.status = 'active';
    this.form['seo.meta_robots'] = 'index, follow';
  },

  methods: {
    cancel() {
      this.$router.push({ name: 'AllBlogs' });
    },
    updateHandle() {
      const self = this;
      self.form.handle = self.form.title;
      const data = {
        handle: self.$util.createHandle(self.form.title),
        lang: 'vi',
      };
      self.$store.dispatch('checkHandle', data).then((result) => {
        self.form.handle = result;
      });
    },
    save() {
      let self = this;
      this.$validator.validateAll().then((result) => {
        if (result) {
          if (self.form.parent) {
            self.form.parent_id = self.form.parent.id;
          }
          if (!this.is_disabled) {
            this.is_disabled = true;
            self.$store.dispatch('storeBlog', self.form).then((res) => {
              if (self.customField) {
                self.$store.dispatch('storeCustomField', self.$util.parseDataCustomfield(self.customField, self.custom_field, 'blog', res.id));
              }
              Message({
                message: 'Tạo thành công',
                type: 'success',
              });
              setTimeout(() => {
                self.$router.push({ path: `/blogs/${res.data.id}` });
              }, 1000);
            }, (error) => {
              Message({
                message: res.message,
                type: 'error',
              });
            });
          }
        }
      });
    },
    getContext() {
      const ctx = this.$util.getContext(this.form, { module: 'blogs' });
      this.$store.state.ctx = ctx;
      return ctx;
    },
  },
  watch: {
    'form.title': function (newVal, oldVal) {
      const self = this;
      this.form['seo.meta_title'] = newVal;
      const data = {
        handle: self.$util.createHandle(newVal),
        lang: 'vi',
      };
      self.$store.dispatch('checkHandle', data).then((result) => {
        self.form.handle = result;
      });
    },
    'form.description': function (newVal, oldVal) {
      this.form['seo.meta_description'] = newVal;
    },
    form: {
      handler(newVal, oldVal) {
        const ctx = this.getContext();
        const output = window.__FUNC.CustomField(ctx);
        this.show_fields = output;
      },
      deep: true,
    },
  },
  destroyed() {
    this.$store.dispatch('setCurrentActions', []);
    this.$store.state.listThemeView = [];
  },
};
</script>
