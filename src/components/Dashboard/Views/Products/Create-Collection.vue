<template lang="html">
  <div class="row">
    <div class="col-lg-8 col-md-8 col-sm-12">
      <div v-for="(group, index) of centerGroups">
        <form-card
          :group="group"
          v-model="form"
          @updateHandle="updateHandle">
          <image-upload-single v-model="form.image"/>
        </form-card>
      </div>
    </div>
    <!-- <div class="col-lg-4 col-md-4 col-sm-12">
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
            <div class="col-sm-12">
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
    <div class="col-lg-8 col-md-8 col-sm-12">
      <div class="card">
        <div class="card-header">
          <h6 class="title">Child collections</h6>
        </div>
        <div class="card-body form-card">
          <div class="row">
            <Tree v-if="form.children && form.children.length"
              :data="form.children"
              draggable="draggable"
              cross-tree="cross-tree"
              @change="changeTreeMenu"
            >
              <div slot-scope="{data, store}">
                <template v-if="!data.isDragPlaceHolder">
                  <b class="btn-toggle-open" v-if="data.children && data.children.length" @click="store.toggleOpen(data)">{{data.open ? '-' : '+'}} </b>
                  <span>{{data.title}}</span>
                  <div class="pull-right">
                    <i
                      class="btn-edit-menu el-icon-edit"
                      @click="editMenu(data)"
                    ></i>
                    <i
                      class="btn-remove-menu el-icon-delete"
                      @click="removeMenu(data, store)"
                    ></i>
                  </div>
                  <div class="clearfix"></div>
                </template>
              </div>
            </Tree>
            <el-button
              @click="dialogFormCreateVisible = true"
              plain
              class="full-width"
              size="small">
              <i class="el-icon-circle-plus"></i>
              Add collection
            </el-button>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import FormCard from 'src/components/UIComponents/FormCard.vue';
import { Message, Input, Button, Tabs, TabPane } from 'element-ui';
import MySelect from 'src/components/UIComponents/Select';
import dataFrom from './collection-form';
import { DraggableTree } from 'vue-draggable-nested-tree';
import ImageUploadSingle from 'src/components/UIComponents/ImageUploadSingle';

const _form = {}; let firstGroups; let
  secondGroups;

export default {
  components: {
    FormCard,
    ElInput: Input,
    ElButton: Button,
    Tree: DraggableTree,
    ImageUploadSingle,
    Message,
    MySelect,
  },
  beforeCreate() {
    firstGroups = dataFrom[0].groups;
    // secondGroups = dataFrom[1].groups;

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
    // secondGroups.forEach((group) => {
    //   group.attributes.forEach((attr) => {
    //     if (attr.multiple && _form[attr.prop]) {
    //       _form[attr.prop] = [];
    //     } else {
    //       _form[attr.prop] = '';
    //     }
    //     attr.value = _form[attr.prop];
    //   });
    // });
    _form.template = '';
    // this.$store.dispatch('getListThemeView', 'collection');
  },
  data() {
    return {
      centerGroups: firstGroups,
      // sideGroups: secondGroups,
      form: _form,
      show_fields: [],
      activeName: ''
    };
  },
  computed: {
    listView() {
      const listTheme = this.$store.state.listThemeView;
      if (listTheme.length) {
        listTheme.unshift({
          title: 'Mặc định',
          value: '',
        });
        return {
          options: listTheme,
        };
      }
      return '';
    }
  },
  mounted() {
    this.$store.dispatch('setPageTitle', 'Tạo nhóm sản phẩm');
    this.$store.dispatch('setCurrentActions', [
      {
        label: 'Quay lại',
        type: 'info',
        icon: '',
        callback: this.cancel,
      },
      {
      label: 'Tạo mới',
      type: 'primary',
      icon: '',
      callback: this.save,
    }]);
  },

  methods: {
    cancel() {
      this.$router.push({ name: 'AllCollections' });
    },
    updateHandle() {
      this.form.handle = this.form.title;
      const data = {
        handle: this.$util.createHandle(this.form.title),
        lang: 'vi',
      };
      this.$store.dispatch('checkHandle', data).then((result) => {
        this.form.handle = result;
      });
    },
    async save() {
      const valid = await this.$validator.validateAll();
      if (!valid) return;
      if (this.form.parent) {
        this.form.parent_id = this.form.parent.id;
      }
      if (this.form.image) {
        this.form.image.src = this.form.image.origin || this.form.image.src;
      }
      try {
        const resp = await this.$store.dispatch('createCategory', this.form);
        Message({
          message: 'Tạo thành công',
          type: 'success',
        });
        this.$router.push({ path: `/collections/${resp.id}` });
      } catch (error) {
        Message({
          message: error.message,
          type: 'error'
        })
      }
    },
  },
  destroyed() {
    this.$store.dispatch('setCurrentActions', []);
    this.$store.state.listThemeView = [];
  },
};
</script>
