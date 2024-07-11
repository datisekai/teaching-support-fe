<template>
  <div class="row">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="Sản phẩm" name="product">
        <div class="card">
          <div class="card-header">
            <h6 class="title">Thuộc tính phiên bản</h6>
          </div>
          <div class="card-body form-card">
            <el-table
              :data="tblVariantAttribues.filter(data => !searchVariantAttribute || data.name.toLowerCase().includes(searchVariantAttribute.toLowerCase()))"
              style="width: 100%">
              <el-table-column
                label="#"
                prop="index">
              </el-table-column>
              <el-table-column
                label="Tên"
                prop="name">
              </el-table-column>
              <el-table-column
                label="Hiển thị"
                prop="status">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.status == 'active'" size="mini" type="success" disable-transitions>Có</el-tag>
                  <el-tag v-else type="danger" size="mini" disable-transitions>Không</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                align="right">
                <template slot="header" slot-scope="scope">
                  <el-input
                    v-model="searchVariantAttribute"
                    size="mini"
                    placeholder="Tìm kiếm"/>
                </template>
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="editAttribute(scope.$index, scope.row)">Chỉnh sửa
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <h6 class="title">Thuộc tính sản phẩm</h6>
          </div>
          <div class="card-body form-card">
            <el-table
              :data="tblProductAttribues.filter(data => !searchProductAttribute || data.name.toLowerCase().includes(searchProductAttribute.toLowerCase()))"
              style="width: 100%">
              <el-table-column
                label="#"
                prop="index">
              </el-table-column>
              <el-table-column
                label="Tên"
                prop="name">
              </el-table-column>
              <el-table-column
                label="Hiển thị"
                prop="status">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.status == 'active'" size="mini" type="success" disable-transitions>Có</el-tag>
                  <el-tag v-else type="danger" size="mini" disable-transitions>Không</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                align="right">
                <template slot="header" slot-scope="scope">
                  <el-input
                    v-model="searchProductAttribute"
                    size="mini"
                    placeholder="Type to search"/>
                </template>
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="editAttribute(scope.$index, scope.row)">Chỉnh sửa
                  </el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="deleteAttribute(scope.$index, scope.row)">Xóa</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="text-right col-12" style="margin-top: 20px;">
              <el-button class="pull-right" type="success" size="mini" @click="addAttribute">Thêm thuộc tính</el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="API" name="second">API</el-tab-pane>
    </el-tabs>

    <el-dialog title="Thuộc tính" :visible.sync="dialogEditAttribute" class="dialogEditAttribute">
      <el-form :model="formModalAttribute">
        <div class="form-item clearfix">
          <span class="">Tên thuộc tính</span>
          <el-input v-model="formModalAttribute.name" placeholder="Tên thuộc tính"></el-input>
        </div>
        <div class="form-item clearfix">
          <span>Hiển thị</span>
          <el-select v-model="formModalAttribute.status" placeholder="Trạng thái hiển thị">
            <el-option label="Có" value="active"></el-option>
            <el-option label="Không" value="inactive"></el-option>
          </el-select>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditAttribute = false">Hủy</el-button>
        <el-button v-if="modal_create" type="primary" @click="createAttribute">Thêm thuộc tính</el-button>
        <el-button v-else type="primary" @click="updateAttribute">Cập nhật</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Phục hồi phiên bản" :visible.sync="dialogFormRestoreVisible" width="30%" @keyup.enter.native="restore">
      <el-form :model="formRestore">
        <el-form-item label="Phiên bản:">
          <my-select
            :attribute="versionSetting"
            placeholder="Chọn phiên bản"
            v-model="formRestore.version"
          ></my-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormRestoreVisible = false">Đóng</el-button>
        <el-button type="primary" @click="restore">Phục hồi</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  Table, TableColumn, Input, Tag, MessageBox,
  Select, Option, Button, Tabs, TabPane, Message, Dialog, Form, FormItem,
} from 'element-ui';
import FormCard from 'src/components/UIComponents/FormCard.vue';
import MySelect from 'src/components/UIComponents/Select';
import { mapState } from 'vuex';

let _setting_views = {}; const
  _setting_data = {};

export default {
  components: {
    ElTable: Table,
    ElTableColumn: TableColumn,
    ElSelect: Select,
    ElOption: Option,
    ElButton: Button,
    ElTabs: Tabs,
    ElTag: Tag,
    ElInput: Input,
    ElTabPane: TabPane,
    ElFormItem: FormItem,
    ElDialog: Dialog,
    ElForm: Form,
    FormCard,
    Message,
    MySelect,
  },
  beforeCreate() {

  },
  computed: {
    tblProductAttribues() {
      let product_attributes = this.$store.state.productAttributes || [];
      let data = [];
      product_attributes.forEach((elem, index) => {
        data.push({
          id: elem.id,
          index: index + 1,
          name: elem.name,
          status: elem.status
        });
      });
      return data;
    },
    tblVariantAttribues() {
      let product_attributes = this.$store.state.variantAttributes || [];
      let data = [];
      product_attributes.forEach((elem, index) => {
        data.push({
          id: elem.id,
          index: index + 1,
          name: elem.name,
          status: elem.status
        });
      });
      return data;
    }
    // ...mapState(['settings', 'versionSetting'])

  },
  data() {
    return {
      activeTab: 'product',
      dialogFormRestoreVisible: false,
      formRestore: {},
      listVersion: [],
      versionSetting: [],
      searchProductAttribute: '',
      searchVariantAttribute: '',
      dialogEditAttribute: false,
      modal_create: false,
      formModalAttribute: {
        id: '',
        name: '',
        status: ''
      }
    };
  },
  mounted() {
    this.$store.dispatch('fetchAttributes');
    // this.$store.dispatch('fetchSettingData');
    // this.$store.dispatch('fetchVersionSettings');

    this.$store.dispatch('setPageTitle', 'Cấu hình');
    this.$store.dispatch('setCurrentActions', [{
      label: 'Phiên bản cũ',
      type: 'default',
      icon: '',
      callback: this.showRestore,
    }]);
  },
  methods: {
    addAttribute() {
      this.dialogEditAttribute = true;
      this.modal_create = true;
      this.formModalAttribute = {
        id: '',
        name: '',
        status: ''
      }
    },
    createAttribute() {
      if (!this.formModalAttribute.name) {
        return Message({
          message: 'Chưa nhập tên thuộc tính',
          type: 'error'
        });
      }
      if (!this.formModalAttribute.status) {
        return Message({
          message: 'Chưa chọn trạng thái hiển thị',
          type: 'error'
        });
      }
      this.$store.dispatch('storeAttributes', this.formModalAttribute).then((res) => {
        if (res.success) {
          Message({
            message: 'Thêm thuộc tính thành công',
            type: 'success'
          });
          this.dialogEditAttribute = false;
          this.$store.dispatch('fetchAttributes');
        } else {
          Message({
            message: res.message,
            type: 'error'
          });  
        }
      }, error => {
        console.error(error);
      });
    },
    editAttribute(index, row) {
      this.formModalAttribute = {
        id: row.id,
        name: row.name,
        status: row.status == 'active' ? "Có" : "Không"
      };
      this.dialogEditAttribute = true;
      this.modal_create = false;
    },
    updateAttribute() {
      this.$store.dispatch('updateAttributes', this.formModalAttribute).then((res) => {
        if (res.success) {
          Message({
            message: 'Cập nhật thành công',
            type: 'success'
          });
          this.dialogEditAttribute = false;
          this.$store.dispatch('fetchAttributes');
        } else {
          Message({
            message: res.message,
            type: 'error'
          });  
        }
      }, error => {
        console.error(error);
      });
    },
    deleteAttribute(index, row) {
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        this.$store.dispatch('removeAttributes', row.id).then((res) => {
          if (res.success) {
            Message({
              message: 'Xóa thành công',
              type: 'success'
            });
            this.$store.dispatch('fetchAttributes');
          } else {
            Message({
              message: res.message,
              type: 'error'
            });  
          }
        }, error => {
          console.error(error);
        });
      }).catch(() => {

      });
    },

    handleDelete(index, row) {
      console.log(index, row);
    },
    cancel() {
      this.$router.push({ name: 'dashboard' });
    },
    showRestore() {
      this.dialogFormRestoreVisible = true;
    },
    restore() {
      const self = this;
      this.$store.dispatch('loadSettingData', self.formRestore.version).then((result) => {
        self.dialogFormRestoreVisible = false;
      }, (error) => {
        Message({
          message: 'Có lỗi xảy ra',
          type: 'error',
        });
      });
    },
    save() {
      const self = this;
      const data = this.settingData;
      const settingView = this.$store.state.settingsView;

      settingView.tabs.forEach((tab) => {
        tab.groups.forEach((group) => {
          group.attributes.forEach((attr) => {
            if (attr.type == 'maps') {
              data.latlng = `${data[attr.name].lat},${data[attr.name].lng}`;
            }
          });
        });
      });
      this.$store.dispatch('storeSettings', data).then((res) => {
        Message({
          message: 'Cập nhật thành công',
          type: 'success',
        });
      }, (res) => {
        Message({
          message: res.message,
          type: 'error',
        });
      });
    },
  },
  watch: {
    settings(newValue, oldValue) {
      this.settingData = newValue;
    },
  },
  destroyed() {
    this.$store.dispatch('setCurrentActions', []);
    this.$store.state.settings = [];
  },
};
</script>
<style lang="scss">
  .el-tabs__nav-scroll {
    padding-bottom: 10px;
  }
  .el-tabs--top {
    width: 100%;
  }
  .el-tabs__nav-wrap::after {
    background-color: #fff;
    height: 0px;
  }
  .el-tabs__nav-wrap {
    background-color: #fff;
    border-radius: 8px;
  }
  .el-table .td-actions {
    button.btn {
      margin-right: 5px;
    }
  }
  .full-width{
    width: 100% !important;
  }

  .dialogEditAttribute {
    .el-dialog {
      width: 600px;
      .el-dialog__body {
        padding-bottom: 0;
      }
      .form-item {
        margin-bottom: 20px;
        > span {
          width: 110px;
          display: inline-block;
          float: left;
          padding-top: 10px;
        }
        > .el-input, > .el-select {
          width: calc(100% - 120px);
          display: inline-block;
          float: left;
          margin-left: 10px;
        }
      }
    }
  }

</style>
