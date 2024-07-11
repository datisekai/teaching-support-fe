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
    <!-- <div class="container-fluid">
      <div class="page-action">
        <el-button @click="cancel">Hủy</el-button>
        <el-button type="primary" @click="save">Cập nhật</el-button>
      </div>
    </div> -->
    <el-dialog title="Nhân bản bài viết" :visible.sync="dialogFormDoubleVisible" width="30%" @keyup.enter.native="doubleItem">
      <el-form :model="formDouble">
        <el-form-item label="Tiêu đề bài viết mới:">
          <el-input v-model="formDouble.title"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormDoubleVisible = false">Đóng</el-button>
        <el-button type="primary" @click="doubleItem">Nhân bản</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FormCard from 'src/components/UIComponents/FormCard.vue';
import CustomField from 'src/components/UIComponents/CustomField.vue';
import {
  Message, Input, Button, MessageBox, Dialog, Form, FormItem,
} from 'element-ui';
import MySelect from 'src/components/UIComponents/Select';
import dataFrom from './article-form';
import { mapState } from 'vuex';
import util from '@/helpers/util';

const _form = {}; let _custom_field = {}; let firstGroups; let secondGroups;

export default {
  components: {
    FormCard,
    CustomField,
    ElInput: Input,
    ElButton: Button,
    ElDialog: Dialog,
    ElForm: Form,
    ElFormItem: FormItem,
    MySelect,
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
  },
  data() {
    return {
      centerGroups: firstGroups,
      sideGroups: secondGroups,
      custom_field: _custom_field,
      dialogFormDoubleVisible: false,
      formDouble: {},
      show_fields: [],
      template: ''
    };
  },
  computed: {
    ...mapState({
      originalForm: state => state.articleDetail,
    }),
    form: {
      get() {
        this.formDouble.title = `Nhân bản của ${this.originalForm.title}`;
        let hashSeo = {};
        if (this.originalForm.seo) {
          hashSeo = util.hashFlatten({ seo: this.originalForm.seo });
        }
        let _originalForm = Object.assign({}, this.originalForm, hashSeo);
        this.template = _originalForm.template;
        return _originalForm;
      },
      set(value) {},
    },
    customField: {
      get() {
        const data = this.$util.filterByHandle(this.$store.state.customField, this.show_fields);
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
    this.$store.dispatch('fetchArticleDetail', id);
    this.$store.dispatch('setPageTitle', 'Cập nhật bài viết');
    this.$store.dispatch('setCurrentActions', [
      // {
      //   label: 'Nhân bản',
      //   type: 'default',
      //   icon: '',
      //   callback: this.showDouble,
      // },
      // {
      //   label: 'Xem trên web',
      //   type: 'default',
      //   icon: '',
      //   callback: this.view,
      // },
      {
        label: 'Xóa',
        type: 'warning',
        icon: '',
        callback: this.remove,
      },
      {
        label: 'Cập nhật',
        type: 'primary',
        icon: '',
        callback: this.save,
      },
    ]);
  },
  methods: {
    cancel() {
      this.$router.push({ name: 'AllArticles' });
    },
    updateHandle() {
      const data = {
        handle: this.$util.createHandle(this.form.title),
        lang: 'vi',
      };
      this.$store.dispatch('checkHandle', data).then((result) => {
        this.$store.state.articleDetail = this.form;
        this.$store.state.articleDetail.handle = result;
      });
    },
    remove() {
      MessageBox.confirm('Bạn có chắc chắn xóa bài viết không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        this.$store.dispatch('removeArticle', this.form.id).then((res) => {
          Message({
            type: 'success',
            message: 'Đã xóa bài viết',
          });
          this.$router.push({ name: 'AllArticles' });
        });
      }).catch(() => {
        Message({
          type: 'info',
          message: 'Hủy bỏ',
        });
      });
    },
    view() {
      const win = window.open(this.form.url, '_blank');
      if (win) {
        win.focus();
      } else {
        Message({
          message: 'Please allow popups for this website',
          type: 'error'
        });
      }
    },
    showDouble() {
      this.dialogFormDoubleVisible = true;
    },
    doubleItem() {
      const data = {
        id: this.originalForm.id,
        title: this.formDouble.title,
      };
      this.$store.dispatch('doubleArticle', data).then((resp) => {
        this.$router.push({ path: `/articles/${resp.id}` });
        location.reload();
        this.dialogFormDoubleVisible = false;
      }, (error) => {
        Message({
          message: error.message,
          type: 'error'
        });
      });
    },
    async save() {
      const result = await this.$validator.validateAll();
      if (result) {
        try {
          await this.$store.dispatch('updateArticle', this.form);
          Message({
            message: 'Cập nhật thành công',
            type: 'success',
          });
        } catch (error) {
          Message({
            message: error.message,
            type: 'error'
          })
        }
      }
    },
  },
  watch: {

  },
  destroyed() {
    this.$store.dispatch('setCurrentActions', []);
    this.$store.state.articleDetail = [];
    this.$store.state.customField = [];
  },
};
</script>
