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
            v-bind:data-rows="warrantyForms"
            :actions="actions"
            :actionsTable="actionsTable"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { MessageBox, Notification, Dialog, Form, FormItem, Input, Button, Divider, DatePicker } from 'element-ui';
import MyMoney from 'src/components/UIComponents/Money';
import MySelect from 'src/components/UIComponents/Select';
import MyTable from 'src/components/UIComponents/Table.vue';
import MyFilter from 'src/components/UIComponents/Filter.vue';
import ColumnToggle from 'src/components/UIComponents/ColumnToggle';
import dtHelper from 'src/helpers/datatable';
import warrantyFormSchemas from './warranty-form-schemas';
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
    ElDatePicker: DatePicker,
  },
  computed: {
    warrantyForms() {
      const rows = this.$store.state.warrantyForms.map(c => {
        c.model_name = c.model && c.model.name; 
        c.customer_name = c.customer && c.customer.profile.fullname; 
        c.phone = c.customer && c.customer.profile.phone;
        c.warrantyFormStatus = c.status;
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
    const initFiledArrays = ['id', 'code', 'customer_name', 'phone', 'warrantyFormStatus','createdAt'];
    const columnDefs = dtHelper.buildInitFields(warrantyFormSchemas, initFiledArrays);
    const tableActions = [];
    if(this.$util.checkPermissionAction(permissionSchemas, 'edit')){
        tableActions.push({
          type: 'primary',
          icon: 'nc-icon nc-ruler-pencil',
          title: 'edit',
          callback: this.edit,
      });
    };
    return {
      filterOutput: [],
      columnDefs,
      actions: tableActions,
      filter: {},
      rules: dtHelper.buildRules(warrantyFormSchemas),
      actionsTable: [],
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
    };
  },
  mounted() {
    const currentAction = [];
    if(this.$util.checkPermissionAction(permissionSchemas, 'create')){
      currentAction.push({
        label: 'create',
        type: 'primary',
        icon: '',
        callback: this.create,
      });
    };
    this.$store.dispatch('fetchWarrantyForms', { perpage: 1000 });
    this.$store.dispatch('setPageTitle', 'warrantyForm');
    this.$store.dispatch('setCurrentActions', currentAction);
  },
  methods: {
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },

    edit(index, row) {
      this.$router.push(`/warranty-form/${row.id}`);
    },
    create() {
      this.$router.push('/warranty-form/create');
    },
   
    remove(index, row) {
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        this.$store.dispatch('removeWarrantyForm', row.id).then((res) => {
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

  .el-range-editor.el-input__inner {
    width: 100%;
  }
  .el-dialog {
    width: 40%;
  }
  .el-date-editor .el-range-separator {
    width: 100px;
  }
</style>
