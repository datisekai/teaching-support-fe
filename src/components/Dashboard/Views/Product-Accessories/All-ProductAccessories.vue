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
            :ignoreActions="ignoreActions"
            ref="table"
            rowKey="rowKey"
            :columnDefs="columnDefs"
            v-bind:data-rows="productAccessories"
            :actions="actions"
            :actionsTable="actionsTable"
          />
        </div>
      </div>
    </div>
    <el-dialog 
      width="500px" 
      :title="formCreateAccessory.id ? $t('el.button.update') : $t('el.button.create')" 
      :visible.sync="dialog.formCreateVisible" 
      @closed="handleClosed"
      @close="handleCloseCreateAccessory"
      @keyup.enter.native="storeProductAccessory"
    >
      <el-form :model="formCreateAccessory" data-vv-scope="formCreateAccessory">
        <el-form-item :label="$t('el.formCard.product')">
          <my-select
            class="full-width"
            :disabled="!!formCreateAccessory.id"
            v-model="formCreateAccessory.productLineId"
            :attribute="{options: menus, multiple: false, filterable: true}"
            data-vv-name="formCreateAccessory.productLineId"
            v-validate="'required'"
            :data-vv-as="$t('el.formCard.product')"
            :placeholder="$t('el.formCard.product')"
            :class="errors.has('formCreateAccessory.productLineId')?'border-danger':''"
          >
          </my-select>
          <span class="text-danger" v-if="errors.has('formCreateAccessory.productLineId')">{{ errors.first('formCreateAccessory.productLineId') }}</span>
        </el-form-item>
        <el-form-item :label="$t('el.formCard.productAccessories')">
          <el-input
            data-vv-name="formCreateAccessory.name"
            v-validate="'required'"
            v-model="formCreateAccessory.name"
            :data-vv-as="$t('el.formCard.productAccessories')"
            :placeholder="$t('el.formCard.productAccessories')"
            :class="errors.has('formCreateAccessory.name')?'border-danger':''"
          ></el-input>
          <span class="text-danger" v-if="errors.has('formCreateAccessory.name')">{{ errors.first('formCreateAccessory.name') }}</span>
        </el-form-item>
        <el-form-item :label="$t('el.formCard.price')">
          <my-money
            fixed=0
            data-vv-name="price"
            v-model="formCreateAccessory.price"
            v-validate="'required'"
            :placeholder="$t('el.formCard.price')"
            :class="errors.has('formCreateAccessory.price')?'border-danger':''"
            :data-vv-as="$t('el.formCard.price')"
          >
            <span slot="append">VND</span>
          </my-money>
          <span class="text-danger" v-if="errors.has('formCreateAccessory.price')">{{ errors.first('formCreateAccessory.price') }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.formCreateVisible = false">{{$t('el.button.cancel')}}</el-button>
        <el-button type="primary" v-if="formCreateAccessory.id" @click="updateAccessory" :disabled="disabledForm">{{$t('el.button.update')}}</el-button>
        <el-button type="primary" v-else @click="storeProductAccessory" :disabled="disabledForm">{{$t('el.button.create')}}</el-button>
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
import productAccessorySchemas from './product-accessory-schemas';
import MySelect from 'src/components/UIComponents/Select';
import permissionSchemas from './permission-schemas';

export default {
  components: {
    MyTable,
    MyMoney,
    MyFilter,
    MySelect,
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
    productAccessories() {
      const rows = this.$store.state.productAccessories.map((m, index) => {
        m.rowKey = m.id + '-' + index;
        m.product_line = m.name;
        m.children = m.children.map(c => {
          c.rowKey = c.id;
          c.accessory = c.name;
          return c
        })
        return m;
      });
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
    menus() {
      return this.$store.state.productAccessoryMenus.map(v => ({
        value: v.value,
        title: v.label
      }))
    },
    disabledForm() {
      return !this.formCreateAccessory.productLineId || !this.formCreateAccessory.name
    }
  },
  data() {
    const initFiledArrays = ['id', 'product_line', 'accessory', 'price'];
    const columnDefs = dtHelper.buildInitFields(productAccessorySchemas, initFiledArrays);

    const tableActions = [];
    if(this.$util.checkPermissionAction(permissionSchemas, 'edit')){
        tableActions.push({
          type: 'primary',
          icon: 'nc-icon nc-ruler-pencil',
          title: 'edit',
          callback: this.showUpdateAccessory,
      });
    };

    if(this.$util.checkPermissionAction(permissionSchemas, 'delete')){
        tableActions.push({
          type: 'danger',
          icon: 'nc-icon nc-simple-remove',
          title: 'delete',
          callback: this.removeAccessory,
        });
    };

    return {
      filterOutput: [],
      columnDefs,
      actions: tableActions,
      filter: {},
      rules: dtHelper.buildRules(productAccessorySchemas),
      actionsTable: [],
      dialog: {
        formCreateVisible: false,
      },
      formCreateAccessory: {
        name: '',
        productLineId: null,
        id: 0,
        price: 0
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
        callback: this.showCreateAccessory,
      });
    };

    this.$store.dispatch('fetchProductAccessories');
    this.$store.dispatch('setPageTitle', 'errorSetting');
    this.$store.dispatch('setCurrentActions', currentAction);
  },
  methods: {
    ignoreActions(row) {
      return row.children;
    },

    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    showCreateAccessory() {
      this.dialog.formCreateVisible = true;
    },
    showUpdateAccessory(index, row) {
      this.formCreateAccessory = Object.assign({}, row);
      this.dialog.formCreateVisible = true;
    },
    handleCloseCreateAccessory() {
      this.formCreateAccessory.name = '';
      this.formCreateAccessory.price = 0;
      this.formCreateAccessory.id = 0;
      this.formCreateAccessory.productLineId = null;
      this.dialog.formCreateVisible = false;
    },
  
    handleClosed() {
      this.errors.clear();
    },
    storeProductAccessory() {
      this.$validator.validateAll('formCreateAccessory').then((result) => {
        if (result) {
          this.$store.dispatch('storeProductAccessories', this.formCreateAccessory).then((res) => {
            Notification ({
              title: 'Success',
              message: 'Create succeeded',
              position: 'bottom-right',
              type: 'success',
            });
            this.$store.dispatch('fetchProductAccessories')
            this.dialog.formCreateVisible = false;
          }, (err) => {
            Notification ({
              title: 'Accessory',
              message: err.message,
              position: 'bottom-right',
              type: 'error',
            });
          });
        } else {
          Notification ({
            title: 'Accessory',
            message: 'Validate failed',
            position: 'bottom-right',
            type: 'error',
          });
        }
      });
    },
    updateAccessory() {
      this.$validator.validateAll('formCreateAccessory').then((result) => {
        if (result) {
          this.$store.dispatch('updateProductAccessories', this.formCreateAccessory).then((res) => {
            Notification ({
              title: 'Success',
              message: 'Update succeeded',
              position: 'bottom-right',
              type: 'success',
            });
            this.dialog.formCreateVisible = false;
          }, (err) => {
            Notification ({
              title: 'Accessory',
              message: err.message,
              position: 'bottom-right',
              type: 'error',
            });
          });
          
        } else {
          Notification ({
            title: 'Accessory',
            message: 'Validate failed',
            position: 'bottom-right',
            type: 'error',
          });
        }
      });
    },
    removeAccessory(index, row) {
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        this.$store.dispatch('removeProductAccessories', row.id).then((res) => {
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
