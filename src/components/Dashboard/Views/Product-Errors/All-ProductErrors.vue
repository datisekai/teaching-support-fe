<template>
  <div class="row">
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-lg-9 col-md-6 col-sm-6 col-6">
            <my-filter :rules="rules" v-on:filter-change="updateFilter"></my-filter>
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6 col-6">
            <column-toggle
              v-model="columnDefs"
              @input="cols => this.$refs['table'].updateColumns(cols)"
            ></column-toggle>
          </div>
        </div>
        <div class="col-sm-12 p-0">
          <my-table
            ref="table"
            rowKey="id"
            :columnDefs="columnDefs"
            v-bind:data-rows="productErrors"
            :actions="actions"
            :actionsTable="actionsTable"
          />
        </div>
      </div>
    </div>
    <el-dialog 
      width="500px" 
      :title="formCreateError.id ? $t('el.button.update') : $t('el.button.create')" 
      :visible.sync="dialog.formCreateVisible" 
      @closed="handleClosed"
      @close="handleCloseCreateError"
      @keyup.enter.native="storeProductError"
    >
      <el-form :model="formCreateError" data-vv-scope="formCreateError">
        <el-form-item v-if="formCreateError.type == 'detail_error'" :label="$t('el.formCard.error')">
          <el-select 
            :disabled="!!formCreateError.id"
            v-model="formCreateError.parentId" 
            data-vv-name="formCreateError.parentId"
            v-validate="'required'"
            :data-vv-as="$t('el.formCard.error')"
            :placeholder="$t('el.formCard.error')"
            :class="errors.has('formCreateError.parentId')?'border-danger':''"
            style="width: 100%">
            <el-option v-for="item in menus" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
          <span class="text-danger" v-if="errors.has('formCreateError.parentId')">{{ errors.first('formCreateError.parentId') }}</span>
        </el-form-item>
        
        <el-form-item v-if="formCreateError.type == 'error'" :label="$t('el.formCard.name')">
          <el-input
            data-vv-name="formCreateError.name"
            v-validate="'required'"
            v-model="formCreateError.name"
            :data-vv-as="$t('el.formCard.name')"
            :placeholder="$t('el.formCard.name')"
            :class="errors.has('formCreateError.name')?'border-danger':''"
          ></el-input>
          <span class="text-danger" v-if="errors.has('formCreateError.name')">{{ errors.first('formCreateError.name') }}</span>
        </el-form-item>
       <el-form-item  v-if="formCreateError.type == 'detail_error'" :label="$t('el.formCard.errorCode')">
          <el-input
            :disabled="!!formCreateError.id"
            data-vv-name="formCreateError.code"
            v-validate="'required'"
            v-model="formCreateError.code"
            data-vv-as="SKU"
            placeholder="SKU"
            :class="errors.has('formCreateError.code')?'border-danger':''"
          ></el-input>
          <span class="text-danger" v-if="errors.has('formCreateError.code')">{{ errors.first('formCreateError.code') }}</span>
        </el-form-item>
        <el-form-item v-if="formCreateError.type == 'detail_error'" :label="$t('el.formCard.description')">
           <el-input
            data-vv-name="formCreateError.name"
            v-validate="'required'"
            v-model="formCreateError.name"
            :data-vv-as="$t('el.formCard.description')"
            :placeholder="$t('el.formCard.description')"
            :class="errors.has('formCreateError.name')?'border-danger':''"
          ></el-input>
          <span class="text-danger" v-if="errors.has('formCreateError.name')">{{ errors.first('formCreateError.name') }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.formCreateVisible = false">{{$t('el.button.cancel')}}</el-button>
        <el-button type="primary" v-if="formCreateError.id" @click="updateError" :disabled="disabledForm">{{$t('el.button.update')}}</el-button>
        <el-button type="primary" v-else @click="storeProductError" :disabled="disabledForm">{{$t('el.button.create')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { MessageBox, Notification, Dialog, Form, FormItem, Input, Button, Select, Option } from 'element-ui';
import MyMoney from 'src/components/UIComponents/Money';
import MyTable from 'src/components/UIComponents/Table.vue';
import MyFilter from 'src/components/UIComponents/Filter.vue';
import ColumnToggle from 'src/components/UIComponents/ColumnToggle';
import dtHelper from 'src/helpers/datatable';
import productErrorSchemas from './product-error-schemas';
import permissionSchemas from './permission-schemas';

export default {
  components: {
    MyTable,
    MyMoney,
    MyFilter,
    ColumnToggle,
    ElForm: Form,
    ElInput: Input,
    ElDialog: Dialog,
    ElButton: Button,
    ElFormItem: FormItem,
    ElSelect: Select,
    ElOption: Option,
  },
  computed: {
    productErrors() {
      const rows = this.$store.state.productErrors.map(m => {
        m.error = m.name;
        if (m.children && m.children.length) {
          m.children = m.children.map(c => {
            c.error_code = c.code;
            c.error_name = c.name
            return c;
          })
        }
        return m;
      });
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
    menus() {
      return this.$store.state.productErrorMenus
    },
    disabledForm() {
      if (this.formCreateError.type == 'error') {
        return !this.formCreateError.name;
      }
      return !this.formCreateError.code || !this.formCreateError.parentId || !this.formCreateError.name
    }
  },
  data() {
    const initFiledArrays = ['id', 'error', 'error_code', 'error_name'];
    const columnDefs = dtHelper.buildInitFields(productErrorSchemas, initFiledArrays);
    const tableActions = [];
    if(this.$util.checkPermissionAction(permissionSchemas, 'edit')){
        tableActions.push({
          type: 'primary',
          icon: 'nc-icon nc-ruler-pencil',
          title: 'edit',
          callback: this.showUpdateError,
      });
    };

    if(this.$util.checkPermissionAction(permissionSchemas, 'delete')){
        tableActions.push({
          type: 'danger',
          icon: 'nc-icon nc-simple-remove',
          title: 'delete',
          callback: this.removeError,
        });
    };

    return {
      filterOutput: [],
      columnDefs,
      actions: tableActions,
      filter: {},
      rules: dtHelper.buildRules(productErrorSchemas),
      actionsTable: [],
      dialog: {
        formCreateVisible: false,
      },
      formCreateError: {
        name: '',
        note: '',
        type: 'detail_error',
        parentId: null,
        id: 0,
        code: ''
      },
    };
  },
  mounted() {

    const currentAction = [];
    if(this.$util.checkPermissionAction(permissionSchemas, 'create')){
        currentAction.push({
        label: 'create',
        type: 'primary',
        icon: '',
        callback: this.showCreateError,
      });
    };

    this.$store.dispatch('fetchProductErrors');
    this.$store.dispatch('setPageTitle', 'errorSetting');
    this.$store.dispatch('setCurrentActions', currentAction);
  },
  methods: {
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    showCreateError() {
      this.dialog.formCreateVisible = true;
    },
    showUpdateError(index, row) {
      this.formCreateError = Object.assign({}, row);
      this.dialog.formCreateVisible = true;
    },
    handleCloseCreateError() {
      this.formCreateError.name = '';
      this.formCreateError.note = '';
      this.formCreateError.code = '';
      this.formCreateError.id = 0;
      this.formCreateError.type = 'error';
      this.formCreateError.parentId = -1;
      this.dialog.formCreateVisible = false;
    },
  
    handleClosed() {
      this.errors.clear();
    },
    storeProductError() {
      this.$validator.validateAll('formCreateError').then((result) => {
        if (result) {
          this.$store.dispatch('storeProductError', this.formCreateError).then((res) => {
            Notification ({
              title: 'Success',
              message: 'Create succeeded',
              position: 'bottom-right',
              type: 'success',
            });
            this.$store.dispatch('fetchProductErrors')
            this.dialog.formCreateVisible = false;
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
    updateError() {
      this.$validator.validateAll('formCreateError').then((result) => {
        if (result) {
          this.$store.dispatch('updateProductError', this.formCreateError).then((res) => {
            Notification ({
              title: 'Success',
              message: 'Update succeeded',
              position: 'bottom-right',
              type: 'success',
            });
            this.dialog.formCreateVisible = false;
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
    removeError(index, row) {
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        this.$store.dispatch('removeProductError', row.id).then((res) => {
          Notification ({
            title: 'Success',
            message: 'Delete completed',
            position: 'bottom-right',
            type: 'success',
          });
        });
      }).catch(() => {
       
      });
    },
  },
  watch: {
    'formCreateError.type': function (newVal, oldVal) {
      if (!this.formCreateError.id) {
        if (newVal == 'detail_error' && this.menus.length) {
          this.formCreateError.parentId = this.menus[0].value;
          this.formCreateError.code = '';
        }
        else {
          this.formCreateError.parentId = -1;
          this.formCreateError.name = '';
          this.formCreateError.code = '';
        }
        console.log(this.formCreateError);
      }
    },
    'formCreateModel.parentId': function (newVal, oldVal) {
      if (newVal != -1) {
          let error = this.menus.find(m => m.value == newVal);
          this.formCreateModel.name = error.label;
      }
    },
  },
  destroyed() {
    this.$store.dispatch('setCurrentActions', []);
  },
};
</script>
<style lang="scss">
  .el-table .td-actions{
    button.btn {
      margin-right: 5px;
    }
  }

  .el-form {
    .el-form-item {
      margin-bottom: 10px !important;
      .el-form-item__label {
        margin-bottom: 0px !important;
      }
    }
  }
</style>
