<template lang="html">
  <div class="row">
    <div class="offset-md-2 col-md-8 col-sm-12">
      <div class="card">
        <div class="card-header">
          <h6 class="title">{{$t('el.formCardTitle.childrenMenu')}}</h6>
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
                      @click="showEditMenu(data)"
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
              {{$t('el.button.add')}}
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="page-action">
        <el-button @click="cancel">{{$t('el.button.back')}}</el-button>
      </div>
    </div>
    <el-dialog 
      width="765px"
      @keyup.enter.native="storeMenu"
      @closed="closeCreateMenu"
      :title="$t('el.translate.createMenu')" 
      :visible.sync="dialogFormCreateVisible" 
      >
      <el-form :model="formCreateMenu" label-width="120px" data-vv-scope="formCreateMenu">
        <el-form-item :label="`${$t('el.formCard.parentMenu')}:`">
          <my-select
            data-vv-name="formCreateMenu.parentMenu"
            v-validate="'required'"
            v-model="formCreateMenu.parentId"
            :attribute="childMenu"
            :data-vv-as="$t('el.formCard.parentMenu')"
            :placeholder="$t('el.formCard.parentMenu')"
            :class="errors.has('formCreateMenu.parentMenu')?'border-danger':''"
          ></my-select>
          <span class="text-danger" v-if="errors.has('formCreateMenu.parentMenu')">{{ errors.first('formCreateMenu.parentMenu') }}</span>
        </el-form-item>
        <el-form-item :label="`${$t('el.formCard.title')}:`">
          <el-input
            autocomplete="off"
            data-vv-name="formCreateMenu.title"
            v-validate="'required'"
            v-model="formCreateMenu.title"
            :data-vv-as="$t('el.formCard.title')"
            :placeholder="$t('el.formCard.title')"
            :class="errors.has('formCreateMenu.title')?'border-danger':''"
          ></el-input>
          <span class="text-danger" v-if="errors.has('formCreateMenu.title')">{{ errors.first('formCreateMenu.title') }}</span>
        </el-form-item>
        <el-form-item :label="`${$t('el.formCard.type')}:`">
          <el-col :span="11">
            <my-select
              v-model="formCreateMenu.linkType"
              :placeholder="$t('el.formCard.type')"
              :attribute="{options: $util.getOptions('menuType')}"
            ></my-select>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-input
              v-if="formCreateMenu.linkType == 'link'"
              autocomplete="off"
              data-vv-name="formCreateMenu.link"
              v-validate="'required'"
              v-model="formCreateMenu.link"
              :data-vv-as="$t('el.formCard.link')"
              :placeholder="$t('el.formCard.link')"
              :class="errors.has('formCreateMenu.link')?'border-danger':''"
            ></el-input>
            <select-ajax
              v-else-if="formCreateMenu.linkType == 'category'"
              key="category"
              data-vv-name="formCreateMenu.link"
              v-validate="'required'"
              v-model="formCreateMenu.link"
              :data-vv-as="$t('el.formCard.link')"
              :class="errors.has('formCreateMenu.link')?'border-danger':''"
              :attribute="{type: 'categories', field: 'name', valueKey: 'id', key: 'id'}"
            >
            </select-ajax>
            <select-ajax
              v-else-if="formCreateMenu.linkType == 'campaign'"
              key="campaign"
              data-vv-name="formCreateMenu.link"
              v-validate="'required'"
              v-model="formCreateMenu.link"
              :data-vv-as="$t('el.formCard.link')"
              :class="errors.has('formCreateMenu.link')?'border-danger':''"
              :attribute="{type: 'campaigns', field: 'title', valueKey: 'id', key: 'id',}"
            >
            </select-ajax>
            <my-select
              v-else-if="formCreateMenu.linkType == 'page'"
              class="full-width"
              data-vv-name="formCreateMenu.link"
              v-validate="'required'"
              v-model="formCreateMenu.link"
              :attribute="pages"
              :data-vv-as="$t('el.formCard.link')"
              :placeholder="$t('el.formCard.link')"
              :class="errors.has('formCreateMenu.link')?'border-danger':''"
            >
            </my-select>
            <span class="text-danger" v-if="errors.has('formCreateMenu.link')">{{ errors.first('formCreateMenu.link') }}</span>
          </el-col>
        </el-form-item>
        <el-form-item :label="`${$t('el.formCard.color')}:`">
          <el-col :span="12">
            <compact-picker :palette="palette" v-model="colorPicker"/>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-input
              autocomplete="off"
              v-model="formCreateMenu.color"
              :placeholder="$t('el.formCard.hex')"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item :label="`${$t('el.formCard.image')}:`">
          <my-image-upload-single 
            data-vv-name="formCreateMenu.image"
            v-validate="'required'"
            v-model="formCreateMenu.image"
            :data-vv-as="$t('el.formCard.image')"
            :class="errors.has('formCreateMenu.image')?'border-danger':''"
          ></my-image-upload-single>
          <span class="text-danger" v-if="errors.has('formCreateMenu.image')">{{ errors.first('formCreateMenu.image') }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormCreateVisible = false">{{$t('el.button.cancel')}}</el-button>
        <el-button type="primary" @click="storeMenu">{{$t('el.button.create')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      width="765px"
      @closed="closeEditMenu"
      @keyup.enter.native="updateMenu"
      :title="$t('el.translate.updateMenu')"
      :visible.sync="dialogFormEditVisible"
    >
      <el-form :model="formEditMenu" label-width="120px" data-vv-scope="formEditMenu">
        <el-form-item :label="`${$t('el.formCard.parentMenu')}:`">
          <my-select
            v-model="formEditMenu.parentId"
            :disabled="true"
            :attribute="childMenu"
            :value="formEditMenu.parentId"
            :placeholder="$t('el.formCard.parentMenu')"
          ></my-select>
        </el-form-item>
        <el-form-item :label="`${$t('el.formCard.title')}:`">
          <el-input
            autocomplete="off"
            data-vv-name="formEditMenu.title"
            v-validate="'required'"
            v-model="formEditMenu.title"
            :data-vv-as="$t('el.formCard.title')"
            :placeholder="$t('el.formCard.title')"
            :class="errors.has('formEditMenu.title')?'border-danger':''"
          ></el-input>
          <span class="text-danger" v-if="errors.has('formEditMenu.title')">{{ errors.first('formEditMenu.title') }}</span>
        </el-form-item>
        <el-form-item :label="`${$t('el.formCard.type')}:`">
          <el-col>
            <my-select
              v-model="formEditMenu.linkType"
              :placeholder="$t('el.formCard.type')"
              :attribute="{options: $util.getOptions('menuType')}"
            ></my-select>
          </el-col>
          <el-col class="mt-2">

            <el-input
              v-if="formEditMenu.linkType == 'link'"
              autocomplete="off"
              data-vv-name="formEditMenu.link"
              v-validate="'required'"
              v-model="formEditMenu.link"
              :data-vv-as="$t('el.formCard.link')"
              :placeholder="$t('el.formCard.link')"
              :class="errors.has('formEditMenu.link')?'border-danger':''"
            ></el-input>
            <my-select
              v-else-if="formEditMenu.linkType == 'page'"
              class="full-width"
              data-vv-name="formEditMenu.link"
              v-validate="'required'"
              v-model="formEditMenu.link"
              :attribute="pages"
              :data-vv-as="$t('el.formCard.link')"
              :placeholder="$t('el.formCard.link')"
              :class="errors.has('formEditMenu.link')?'border-danger':''"
            >
            </my-select>
            <div class="el-row" v-else>
              <el-col class="pt-2" :span="8">
                <el-switch v-model="formEditMenu.isAll" :active-value='true' :inactive-value='false' active-text="Tất cả"></el-switch>
              </el-col>
              <el-col :span="16">
                <select-ajax
                  v-show="!formEditMenu.isAll"
                  data-vv-name="formEditMenu.link"
                  v-validate="!formEditMenu.isAll ? 'required' : ''"
                  v-model="formEditMenu.link"
                  :data-vv-as="$t('el.formCard.link')"
                  :class="errors.has('formEditMenu.link')?'border-danger':''"
                  :attribute="{type: formEditMenu.linkType, field: formEditMenu.linkType === 'category' ? 'name' : 'title', valueKey: 'id', key: 'id', initOptions}"
                >
                </select-ajax>
              </el-col>
              
            </div>
            
            <span class="text-danger" v-if="errors.has('formEditMenu.link')">{{ errors.first('formEditMenu.link') }}</span>
          </el-col>
        </el-form-item>
        <el-form-item :label="`${$t('el.formCard.color')}:`">
          <el-col :span="12">
            <compact-picker :palette="palette" v-model="colorPicker"/>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-input
              autocomplete="off"
              v-model="formEditMenu.color"
              :placeholder="$t('el.formCard.hex')"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item :label="`${$t('el.formCard.image')}:`">
          <my-image-upload-single
            data-vv-name="formEditMenu.image"
            v-validate="'required'"
            v-model="formEditMenu.image"
            :data-vv-as="$t('el.formCard.image')"
            :class="errors.has('formEditMenu.image')?'border-danger':''"
          ></my-image-upload-single>
          <span class="text-danger" v-if="errors.has('formEditMenu.image')">{{ errors.first('formEditMenu.image') }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormEditVisible = false">{{$t('el.button.cancel')}}</el-button>
        <el-button type="primary" @click="updateMenu">{{$t('el.button.update')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Compact } from 'vue-color';
import { DraggableTree } from 'vue-draggable-nested-tree';
import { MessageBox, Input, Button, Dialog, Form, FormItem, Col, Upload, Notification, Switch } from 'element-ui';
import MySelect from 'src/components/UIComponents/Select';
import MyImage from 'src/components/UIComponents/Image.vue';
import SelectAjax from 'src/components/UIComponents/SelectAjax';
import FormCard from 'src/components/UIComponents/FormCard.vue';
import MyImageUploadSingle from 'src/components/UIComponents/ImageUploadSingle';

export default {
  components: {
    ElCol: Col,
    ElForm: Form,
    ElInput: Input,
    ElButton: Button,
    ElUpload: Upload,
    ElDialog: Dialog,
    ElFormItem: FormItem,
    ElSwitch: Switch,
    MyImage,
    FormCard,
    MySelect,
    SelectAjax,
    Tree: DraggableTree,
    MyImageUploadSingle,
    CompactPicker: Compact
  },
  data() {
    return {
      dialogFormCreateVisible: false,
      dialogFormEditVisible: false,
      colorPicker: '#2694A1',
      form: {},
      formCreateMenu: {
        parentId: null,
        title: '',
        linkType: '',
        link: '',
        image: null,
        color: '#2694A1',
      },
      formEditMenu: {
        parentId: null,
        title: '',
        linkType: '',
        link: '',
        image: null,
        color: '#2694A1',
        isAll: true,
      },
      childMenu: [],
      initOptions: [],
    };
  },
  computed: {
    ...mapState(['menuDetail', 'palette']),
    pages() {
      const rows = this.$store.getters.pages;
      return this.$util.parseSelect(rows);
    },
  },
  mounted() {
    this.init();
    this.$store.dispatch('fetchPages');
    this.$store.dispatch('fetchPalette');
    this.$store.dispatch('setPageTitle', 'menuUpdate');
  },
  methods: {
    async init() {
      const id = this.$route.params.id;
      this.formCreateMenu.parentId = id;
      await this.$store.dispatch('fetchMenuDetail', id);
    },
    cancel() {
      this.$router.push({ name: 'AllMenus' });
    },
    changeTreeMenu(node, targetTree, oldTree) {
      const menus = [];
      const data = targetTree.data;
      data.forEach((element, index) => {
        const temp = {};
        temp.id = element.id;
        temp.parentId = this.form.id;
        menus.push(temp);
        this.getDataUpdateMenu(element.children, menus);
      });
      this.$store.dispatch('updateDisplayOrderMenu', { menu: menus }).then((result) => {
        Notification ({
              title: 'Success',
              message: 'Update succeeded',
              position: 'bottom-right',
              type: 'success',
            });
      }).catch((err) => {
        Notification ({
          title: 'Error',
          message: err.message,
          position: 'bottom-right',
          type: 'error',
        });
      });
    },
    getDataUpdateMenu(children, menus) {
      if (children.length) {
        children.forEach((element, index) => {
          const temp = {};
          temp.id = element.id;
          temp.parentId = element.parent.id;
          menus.push(temp);
          this.getDataUpdateMenu(element.children, menus);
        });
      }
    },
    async showEditMenu(element) {
      try {
        const menu = await this.$store.dispatch('fetchMenuDetailEdit', element.id);
        this.formEditMenu.id = menu.id;
        this.formEditMenu.parentId = menu.parentId;
        this.formEditMenu.title = menu.title;
        this.formEditMenu.linkType = menu.linkType;
        this.formEditMenu.image = menu.image;
        this.formEditMenu.color = menu.color;
        this.formEditMenu.isAll = ['link'].includes(menu.linkType) ? null : menu.link === '-1';
        // this.formEditMenu.link = menu.linkType != 'link' ? menu.link - 0 : menu.link;
        this.formEditMenu._link = menu.link;
        let link = this.formEditMenu.link;
        if (!this.formEditMenu.isAll) {
          link = this.formEditMenu._link;
        }
        this.formEditMenu.link = this.formEditMenu.isAll ? '' : (!['link'].includes(this.formEditMenu.linkType) ? link - 0 : link);

        this.dialogFormEditVisible = true;

        if (!this.formEditMenu.isAll) {
          if (menu.linkType === 'category') {
            const cat = await this.$store.dispatch('fetchCollectionDetail', menu.link);
            this.initOptions = [cat];
          } else if (menu.linkType === 'campaign') {
            const campaign = await this.$store.dispatch('fetchCampaignDetail', menu.link);
            this.initOptions = [campaign];
          } else if (menu.linkType === 'flashsale') {
            const flashsale = await this.$store.dispatch('fetchFlashsaleDetail', menu.link);
            this.initOptions = [flashsale];
          } else if (menu.linkType === 'page') {
            const page = await this.$store.dispatch('fetchPageDetail', menu.link);
            this.initOptions = [page];
          }
        }
      } catch (err) {
        Notification ({
          title: 'Error',
          message: err.message,
          position: 'bottom-right',
          type: 'error',
        });
      }
    },
    removeMenu(element, store) {
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        this.$store.dispatch('removeMenu', element.id).then((res) => {
          Notification ({
            title: 'Success',
            message: 'Delete completed',
            position: 'bottom-right',
            type: 'success',
          });
          store.deleteNode(element);
        });
      }).catch(() => {
        Notification ({
          title: 'Canceled',
          message: 'Delete canceled',
          position: 'bottom-right',
          type: 'info',
        });
      });
    },
    storeMenu() {
      this.$validator.validateAll('formCreateMenu').then((result) => {
        if (result) {
          this.$store.dispatch('storeMenu', this.formCreateMenu).then((res) => {
            Notification ({
              title: 'Success',
              message: 'Create succeeded',
              position: 'bottom-right',
              type: 'success',
            });
            this.init();
            this.dialogFormCreateVisible = false;
          }, (err) => {
            Notification ({
              title: 'Error',
              message: err.message,
              position: 'bottom-right',
              type: 'error',
            });
          });
        } else {
          Notification ({
            title: 'Error',
            message: 'Validate failed',
            position: 'bottom-right',
            type: 'error',
          });
        }
      });
    },
    updateMenu() {
      this.$validator.validateAll('formEditMenu').then((result) => {
        const data = {...this.formEditMenu, link: this.formEditMenu.isAll ? '-1' : this.formEditMenu.link};
        if (result) {
          this.$store.dispatch('updateMenu', data).then((res) => {
            Notification ({
              title: 'Success',
              message: 'Update succeeded',
              position: 'bottom-right',
              type: 'success',
            });
            this.init();
            this.dialogFormEditVisible = false;
          }, (err) => {
            Notification ({
              title: 'Error',
              message: err.message,
              position: 'bottom-right',
              type: 'error',
            });
          });
        } else {
          Notification ({
            title: 'Error',
            message: 'Validate failed',
            position: 'bottom-right',
            type: 'error',
          });
        }
      });
    },
    closeEditMenu() {
      this.formEditMenu.id = null;
      this.formEditMenu.parentId = null;
      this.formEditMenu.title = '';
      this.formEditMenu.linkType = '';
      this.formEditMenu.link = '';
      this.formEditMenu.image = null;
      this.colorPicker = '#2694A1';
    },
    closeCreateMenu() {
      this.formCreateMenu.parentId = this.form.id;
      this.formCreateMenu.title = '';
      this.formCreateMenu.linkType = '';
      this.formCreateMenu.link = '';
      this.formCreateMenu.image = null;
      this.colorPicker = '#2694A1';
    },
    handleEditMenu(val) {
      this.formEditMenu.link = val;
    },
    
  },
  watch: {
    'form.title': function (newVal, oldVal) {
      this.form.handle = this.$util.createHandle(newVal);
    },
    'formCreateMenu.linkType': function (newVal, oldVal) {
      this.formCreateMenu.link = ''
    },
    'formCreateMenu.link': function (newVal, oldVal) {
    },
    'formEditMenu.link': function (newVal, oldVal) {
    },
    'formCreateMenu.color': function(newVal, oldVal) {
      if(newVal) {
        this.colorPicker = newVal;
      }
    },
    'formEditMenu.color': function(newVal, oldVal) {
      if(newVal) {
        this.colorPicker = newVal;
      }
    },
    'formEditMenu.linkType': function (newVal, oldVal) {
      if (newVal && newVal !== this.formEditMenu.linkType) {
        this.formEditMenu.link = ''
      }
    },
    'formEditMenu.link': function (newVal, oldVal) {
      if (newVal !== '-1' && newVal !== "") {
        this.formEditMenu.isAll = false;
      }
    },
    async menuDetail(newVal, oldVal) {
      this.form = {...this.form, ...newVal};
      this.childMenu.multiple = false;
      this.childMenu.options = newVal.arrSubMenus;
      this.formCreateMenu.parentId = this.form.id;
    },
    colorPicker(newVal, oldVal) {
      if (newVal && typeof newVal == 'object') {
        this.formCreateMenu.color = newVal.hex;
        this.formEditMenu.color = newVal.hex;
      }
    }
  },
  destroyed() {
    this.$store.dispatch('setCurrentActions', []);
  },
};
</script>
<style>
  .list-child-menu{
    width: 100%;
  }
  .list-child-menu .item{
    border: 1px solid #ddd;
    width: 100%;
    border-radius: 5px;
    margin-bottom: 5px;
    padding: 5px;
  }
  .list-child-menu .item p{
    margin: 0;
  }
  .list-child-menu .item button, .btn-edit-menu,.btn-remove-menu{
    margin: 0 5px;
  }
  .btn-remove-menu{
    color: red;
  }
  .list-complete-item .item{
    transition: all 1s;
  }
  
  .el-form .el-form-item {
    margin-bottom: 10px !important;
  }
</style>
