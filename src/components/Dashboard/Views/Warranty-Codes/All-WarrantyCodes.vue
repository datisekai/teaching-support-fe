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
            :columnDefs="columnDefs"
            v-bind:data-rows="warrantyCodes"
            :actions="actions"
            :actionsTable="actionsTable"
          />
        </div>
      </div>
    </div>
    <el-dialog 
      width="500px" 
      :title="$t('el.button.create')" 
      :visible.sync="dialog.formCreateVisible"  
      @closed="handleClosed"
      @close="handleCloseCreateWarrantyCode"
      @keyup.enter.native="storeWarrantyCode"
    >
      <el-form :model="formCreateWarrantyCode" data-vv-scope="formCreateWarrantyCode">
        <el-form-item :label="$t('el.formCard.model')">
          <my-select
            data-vv-name="formCreateWarrantyCode.modelId"
            v-validate="'required'"
            v-model="formCreateWarrantyCode.modelId"
            :attribute="{multiple: false, options: models}"
            :data-vv-as="$t('el.formCard.model')"
            :placeholder="$t('el.formCard.model')"
            :class="errors.has('formCreateWarrantyCode.modelId')?'border-danger':''"
          ></my-select>
          <span class="text-danger" v-if="errors.has('formCreateWarrantyCode.modelId')">{{ errors.first('formCreateWarrantyCode.modelId') }}</span>
        </el-form-item>
        <el-form-item :label="$t('el.formCard.amount')">
          <el-input
            type="number"
            data-vv-name="formCreateWarrantyCode.amount"
            v-model="formCreateWarrantyCode.amount"
            v-validate="'required|min_value:1'"
            :data-vv-as="$t('el.formCard.amount')"
            :placeholder="$t('el.formCard.amount')"
            :class="errors.has('formCreateWarrantyCode.amount')?'border-danger':''"
          >
          </el-input>
          <span class="text-danger" v-if="errors.has('formCreateWarrantyCode.amount')">{{ errors.first('formCreateWarrantyCode.expiredIn') }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.formCreateVisible = false">{{$t('el.button.cancel')}}</el-button>
        <el-button type="primary" :loading="loadingButton" @click="storeWarrantyCode" :disabled="!formCreateWarrantyCode.modelId">{{$t('el.button.create')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog 
      width="500px" 
      :title="$t('el.button.validate')" 
      :visible.sync="dialog.formValidateVisible"
      @closed="handleClosed"
      @close="handleCloseValidateWarrantyCode"
      @keyup.enter.native="validateWarrantyCode"
    >
      <el-form :model="formValidateWarrantyCode" data-vv-scope="formValidateWarrantyCode">
        <el-form-item :label="$t('el.formCard.code')">
           <el-input
            data-vv-name="formValidateWarrantyCode.code"
            v-validate="'required'"
            v-model="formValidateWarrantyCode.code"
            :data-vv-as="$t('el.formCard.code')"
            :placeholder="$t('el.formCard.code')"
            :class="errors.has('formValidateWarrantyCode.code')?'border-danger':''"
          ></el-input>
          <span class="text-danger" v-if="errors.has('formValidateWarrantyCode.code')">{{ errors.first('formValidateWarrantyCode.code') }}</span>
        </el-form-item>
        <div v-if="formValidateWarrantyCode.result">
          <el-divider></el-divider>
          <el-form-item>
            <div v-if="formValidateWarrantyCode.result.error">
              <p><strong>{{$t('el.formCard.error')}}: </strong>
                {{formValidateWarrantyCode.result.error.message}}
              </p>
            </div>
            <div v-else>
              <p><strong>{{$t('el.formCard.serial')}}: </strong>
                {{formValidateWarrantyCode.result.data.serial}}
              </p>
              <p><strong>{{$t('el.formCard.code')}}: </strong>
                {{formValidateWarrantyCode.result.data.code}}
              </p>
              <p><strong>{{$t('el.formCard.model')}}: </strong>
                {{formValidateWarrantyCode.result.data.model.name}}
              </p>
              <p><strong>{{$t('el.formCard.status')}}: </strong>
                {{formValidateWarrantyCode.result.data.isActivated ? '✔ Đã kích hoạt' : '✗ Chưa kích hoạt'}}
              </p>
              <div v-if="formValidateWarrantyCode.result.data.isActivated">
                <p><strong>{{$t('el.formCard.customer')}}: </strong>
                  {{formValidateWarrantyCode.result.data.customer.fullname}} -  {{formValidateWarrantyCode.result.data.customer.phone}}
                </p>
                <p><strong>{{$t('el.formCard.activatedDate')}}: </strong>
                  {{$util.formatDateTime(formValidateWarrantyCode.result.data.activatedDate)}}
                </p>
                <p><strong>{{$t('el.formCard.expiredDate')}}: </strong>
                  {{$util.formatDateTime(formValidateWarrantyCode.result.data.expiredDate)}}
                </p>
              </div>
            </div>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.formValidateVisible = false">{{$t('el.button.cancel')}}</el-button>
        <el-button type="warning" :loading="loadingButton" @click="validateWarrantyCode" :disabled="!formValidateWarrantyCode.code">{{$t('el.button.validate')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { MessageBox, Notification, Dialog, Form, FormItem, Input, Button, Divider } from 'element-ui';
import MyMoney from 'src/components/UIComponents/Money';
import MySelect from 'src/components/UIComponents/Select';
import MyTable from 'src/components/UIComponents/Table.vue';
import MyFilter from 'src/components/UIComponents/Filter.vue';
import ColumnToggle from 'src/components/UIComponents/ColumnToggle';
import dtHelper from 'src/helpers/datatable';
import warrantyCodeSchemas from './warranty-code-schemas';
import permissionSchemas from './permission-schemas';

export default {
  components: {
    MyTable,
    MyMoney,
    MySelect,
    MyFilter,
    ColumnToggle,
    ElForm: Form,
    ElInput: Input,
    ElDialog: Dialog,
    ElButton: Button,
    ElDivider: Divider,
    ElFormItem: FormItem,
  },
  computed: {
    warrantyCodes() {
      const rows = this.$store.state.warrantyCodes.map(c => {
        c.model_name = c.model && c.model.name; 
        c.cusstomer_name = c.cusstomer && c.cusstomer.fullname; 
        return c;
      });
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
    models() {
      return this.$store.state.models.map(m => {
        return {
          value: m.id,
          title: m.name,
        }
      });
    },
  },
  data() {
    const initFiledArrays = ['id', 'serial', 'code', 'createdAt'];
    const columnDefs = dtHelper.buildInitFields(warrantyCodeSchemas, initFiledArrays);

    const tableActions = [];
    if(this.$util.checkPermissionAction(permissionSchemas, 'delete')){
        tableActions.push({
          type: 'danger',
          icon: 'nc-icon nc-simple-remove',
          title: 'delete',
          callback: this.removeWarrantyCode,
        });
    };

    return {
      filterOutput: [],
      columnDefs,
      actions: tableActions,
      filter: {},
      rules: dtHelper.buildRules(warrantyCodeSchemas),
      actionsTable: [],
      loadingButton: false,
      dialog: {
        formCreateVisible: false,
        formValidateVisible: false,
      },
      formCreateWarrantyCode: {
        modelId: null,
        amount: 1,
      },
      formValidateWarrantyCode: {
        code: '',
        result: null,
      },
      exportPath: ''
    };
  },
  mounted() {
    this.$store.dispatch('fetchModels');
    // this.$store.dispatch('fetchWarrantyCodes');
    this.$store.dispatch('setPageTitle', 'warrantyCode');
    
  },
  methods: {
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    showCreateWarrantyCode() {
      this.dialog.formCreateVisible = true;
    },
    showValidateWarrantyCode() {
      this.dialog.formValidateVisible = true;
    },
    exportExcel() {
      window.open(this.exportPath, "_blank");
      // var link = document.createElement("a");
      // link.download = 'Mã code';
      // link.href = this.exportPath;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
    },
    handleCloseCreateWarrantyCode() {
      this.formCreateWarrantyCode.modelId = null;
      this.formCreateWarrantyCode.amount = 1;
      this.dialog.formCreateVisible = false;
    },
    handleCloseValidateWarrantyCode() {
      this.formValidateWarrantyCode.code = '';
      this.formValidateWarrantyCode.result = null;
      this.dialog.formValidateVisible = false;
    },
    handleClosed() {
      this.errors.clear();
    },
    storeWarrantyCode() {
      this.$validator.validateAll('formCreateWarrantyCode').then((result) => {
        if (result) {
          this.loadingButton = true;
          this.formCreateWarrantyCode.amount = parseInt(this.formCreateWarrantyCode.amount);
          this.$store.dispatch('storeWarrantyCode', this.formCreateWarrantyCode).then((res) => {
            const { returnPath, total } = res;
            Notification ({
              title: 'Success',
              message: `Create succeeded ${total} codes`,
              position: 'bottom-right',
              type: 'success',
            });
            this.exportPath = returnPath;
            this.loadingButton = false;
            this.dialog.formCreateVisible = false;
            this.exportExcel();
          }, (err) => {
            Notification ({
              title: 'Error',
              message: err.message,
              position: 'bottom-right',
              type: 'error',
            });
            this.loadingButton = false;
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
    removeWarrantyCode(index, row) {
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        this.$store.dispatch('removeWarrantyCode', row.id).then((res) => {
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
    validateWarrantyCode() {
      this.$validator.validateAll('formValidateWarrantyCode').then((result) => {
        if (result) {
          this.loadingButton = true;
          this.$store.dispatch('validateWarrantyCode', this.formValidateWarrantyCode.code).then((res) => {
            this.formValidateWarrantyCode.result = { data: res };
            Notification ({
              title: 'Success',
              message: 'Validate succeeded',
              position: 'bottom-right',
              type: 'success',
            });
            this.loadingButton = false;
          }, (error) => {
            console.log(error);
            this.formValidateWarrantyCode.result = { error };
            Notification ({
              title: 'Error',
              message: error.message,
              position: 'bottom-right',
              type: 'error',
            });
            this.loadingButton = false;
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
  },
  watch: {
    'exportPath': {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal) {
          const currentAction = [];
          if(this.$util.checkPermissionAction(permissionSchemas, 'validate')){
              currentAction.push({
                label: 'validate',
                type: 'info',
                icon: '',
                callback: this.showValidateWarrantyCode,
            });
          };
          if(this.$util.checkPermissionAction(permissionSchemas, 'exportExcel')){
              currentAction.push({
                label: 'exportExcel',
                type: 'warning',
                icon: '',
                callback: this.exportExcel,
            });
          };
          if(this.$util.checkPermissionAction(permissionSchemas, 'create')){
              currentAction.push({
                label: 'create',
                type: 'primary',
                icon: '',
                callback: this.showCreateWarrantyCode,
            });
          };

          this.$store.dispatch('setCurrentActions', currentAction);
        }
        else {
          const currentAction = [];
          if(this.$util.checkPermissionAction(permissionSchemas, 'validate')){
              currentAction.push({
                label: 'validate',
                type: 'info',
                icon: '',
                callback: this.showValidateWarrantyCode,
            });
          };
          if(this.$util.checkPermissionAction(permissionSchemas, 'create')){
              currentAction.push({
                label: 'create',
                type: 'primary',
                icon: '',
                callback: this.showCreateWarrantyCode,
            });
          };
          this.$store.dispatch('setCurrentActions', currentAction);
        }
      }
      
    }
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

  .el-dialog__body {
    padding: 10px 20px !important;
  }

  .el-form {
    .el-form-item {
      margin-bottom: 10px !important;
      .el-form-item__label {
        margin-bottom: 0px !important;
      }
      p {
        margin-bottom: 0px !important;
      }
    }
    .el-divider--horizontal {
      margin-bottom: 12px !important;
    }
  }
</style>
