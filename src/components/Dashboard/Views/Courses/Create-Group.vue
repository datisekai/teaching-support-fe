<template lang="html">
  <div class="row">
    <div class="col-lg-8 col-md-8 col-sm-12">
      <form-card
        v-for="(group, index) of centerGroups"
        :key="'groupleft' + index"
        :group="group"
        v-model="form"
      ></form-card>
      <div class="card">
        <div class="card-header">
          <h6 class="title">Link</h6>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-12 col-xs-6 col-md-6 col-lg-6">
              <my-select
                :attribute="listType"
                placeholder="Chọn loại"
                v-model="form.link_type"
              ></my-select>
            </div>
            <div class="col-12 col-xs-6 col-md-6 col-lg-6">
              <el-input
                v-if="form.link_type == 'custom' || !form.link_type"
                autocomplete="off"
                v-model="form.link"
                placeholder="Địa chỉ web..."
              ></el-input>
              <my-select
                v-else-if="form.link_type == 'product'"
                class="full-width"
                placeholder="Chọn sản phẩm"
                :attribute="products"
                v-model="form.link"
              >
              </my-select>
              <my-select
                v-else-if="form.link_type == 'collection'"
                class="full-width"
                placeholder="Chọn nhóm sản phẩm"
                :attribute="collections"
                v-model="form.link"
              >
              </my-select>
              <my-select
                v-else-if="form.link_type == 'article'"
                class="full-width"
                placeholder="Chọn bài viết"
                :attribute="articles"
                v-model="form.link"
              >
              </my-select>
              <my-select
                v-else-if="form.link_type == 'blog'"
                class="full-width"
                placeholder="Chọn nhóm bài viết"
                :attribute="blogs"
                v-model="form.link"
              >
              </my-select>
              <my-select
                v-else-if="form.link_type == 'page'"
                class="full-width"
                placeholder="Chọn trang nội dung"
                :attribute="pages"
                v-model="form.link"
              >
              </my-select>
              <my-select
                v-else-if="form.link_type == 'gallery'"
                class="full-width"
                placeholder="Chọn gallery"
                :attribute="galleries"
                v-model="form.link"
              >
              </my-select>
            </div>
          </div>
        </div>
      </div>
      <custom-field
        v-if="customField.length > 0"
        :group="customField"
        :value="custom_field"
        v-model="custom_field"
      ></custom-field>
    </div>
    <div class="col-lg-4 col-md-4 col-sm-12">
      <div class="card">
        <div class="card-header">
          <h6 class="title">Gallery</h6>
        </div>
        <div class="card-body form-card">
          <div class="col-sm-12">
            <my-select
              class="full-width"
              placeholder="Gallery"
              :attribute="galleries"
              v-model="form.gallery_id"
            >
            </my-select>
          </div>
        </div>
      </div>
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
import dataFrom from './photo-form';

const _form = {}; const _custom_field = {}; let firstGroups; let
  secondGroups;

export default {
  components: {
    FormCard,
    ElInput: Input,
    ElButton: Button,
    Message,
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

    _form.gallery_id = this.$route.params.galleryID - 0;
    this.$store.dispatch('getClassCustomField', 'photo');
    this.$store.dispatch('fetchGalleries');
  },
  data() {
    return {
      centerGroups: firstGroups,
      sideGroups: secondGroups,
      form: _form,
      custom_field: _custom_field,
      show_fields: [],
      listType: {
        multiple: false,
        options: [
          {
            title: 'Địa chỉ web',
            value: 'custom',
          },
          {
            title: 'Nhóm sản phẩm',
            value: 'collection',
          },
          {
            title: 'Sản phẩm',
            value: 'product',
          },
          {
            title: 'Nhóm bài viết',
            value: 'blog',
          },
          {
            title: 'Bài viết',
            value: 'article',
          },
          {
            title: 'Trang nội dung',
            value: 'page',
          },
          {
            title: 'Gallery',
            value: 'gallery',
          },
        ],
      },
    };
  },
  computed: {
    customField: {
      get() {
        return this.$util.filterByHandle(this.$store.state.classCustomField, this.show_fields);
      },
      set(value) {},
    },
    galleries() {
      const data = this.$store.state.galleries;
      const arr = {};
      arr.options = [];
      for (const item of data) {
        arr.options.push({
          value: item.id,
          title: item.title,
        });
      }
      return arr;
    },
    products() {
      const data = this.$store.state.products;
      return this.$util.parseSelect(data);
    },
    collections() {
      const data = this.$store.state.collections;
      return this.$util.parseSelect(data);
    },
    articles() {
      const data = this.$store.state.articles;
      return this.$util.parseSelect(data);
    },
    blogs() {
      const data = this.$store.state.blogs;
      return this.$util.parseSelect(data);
    },
    pages() {
      const data = this.$store.state.pages;
      return this.$util.parseSelect(data);
    },
    galleries() {
      const data = this.$store.state.galleries;
      return this.$util.parseSelect(data);
    },
  },
  mounted() {
    this.$store.dispatch('setPageTitle', 'Tạo photo');
    this.$store.dispatch('setCurrentActions', [{
      label: 'Lưu lại',
      type: 'primary',
      icon: '',
      callback: this.save,
    }]);
    this.getContext();
    this.form.status = 'active';
    this.$store.dispatch('fetchProducts');
    this.$store.dispatch('fetchCollections');
    this.$store.dispatch('fetchArticles');
    this.$store.dispatch('fetchBlogs');
    this.$store.dispatch('fetchPages');
    this.$store.dispatch('fetchGalleries');
  },

  methods: {
    cancel() {
      const galleryID = this.$route.params.galleryID;
      this.$router.push(`/galleries/${galleryID}`);
    },
    save() {
      const self = this;
      this.$validator.validateAll().then((result) => {
        if (result) {
          self.$store.dispatch('storePhoto', self.form).then((res) => {
            self.$store.dispatch('storeCustomField', self.$util.parseDataCustomfield(self.customField, self.custom_field, 'photo', res.id));
            Message({
              message: 'Tạo thành công',
              type: 'success',
            });
            const galleryID = self.$route.params.galleryID;
            self.$router.push(`/galleries/${galleryID}`);
          }, (res) => {
            Message({
              message: res.message,
              type: 'error',
            });
          });
        }
      });
    },
    getContext() {
      const ctx = this.$util.getContext(this.form, { module: 'photo' });
      this.$store.state.ctx = ctx;
      return ctx;
    },
  },
  watch: {
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
    this.$store.state.customField = [];
  },
};
</script>
