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
  </div>
</template>

<script>
import FormCard from 'src/components/UIComponents/FormCard.vue';
import { Message, Input, Button, Tabs, TabPane } from 'element-ui';
import MySelect from 'src/components/UIComponents/Select';
import dataFrom from './collection-form';
import { DraggableTree } from 'vue-draggable-nested-tree';
import ImageUploadSingle from 'src/components/UIComponents/ImageUploadSingle';

const _form = {}; let firstGroups;

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
    console.log({_form});
    _form.template = '';
  },
  data() {
    return {
      centerGroups: firstGroups,
      form: _form,
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
    const actions = [
      {
        label: 'Quay lại',
        type: 'info',
        icon: '',
        callback: this.cancel,
      },
      {
      label: 'Lưu lại',
      type: 'primary',
      icon: '',
      callback: this.save,
    }];
    this.$store.dispatch('setPageTitle', 'Nhóm sản phẩm');
    this.$store.dispatch('fetchCategoryDetail', {id: this.$route.params.id});
    this.$store.dispatch('setCurrentActions', actions);
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
        await this.$store.dispatch('updateCategory', this.form);
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
    },
  },
  watch: {
    '$store.state.categoryDetail': {
      handler(nVal) {
        this.form = nVal;
      }
    }
  },
  destroyed() {
    this.$store.dispatch('setCurrentActions', []);
    this.$store.state.listThemeView = [];
  },
};
</script>
