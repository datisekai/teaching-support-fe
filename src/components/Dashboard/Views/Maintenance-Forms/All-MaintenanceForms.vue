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
            v-bind:data-rows="maintenanceForms"
            :actions="actions"
            :actionsTable="actionsTable"
          />
        </div>
      </div>
    </div>
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
import maintenanceFormSchemas from './maintenance-form-schemas';
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
    maintenanceForms() {
      const rows = this.$store.state.maintenanceForms.map(c => {
        c.customer_name = c.customer && c.customer.profile && c.customer.profile.fullname; 
        c.maintenanceFormStatus = c.status;
        return c;
      });
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
  },
  data() {
    const initFiledArrays = ['id', 'warrantyFormId', 'code', 'customer_name', 'maintenanceFormStatus', 'createdAt'];
    const columnDefs = dtHelper.buildInitFields(maintenanceFormSchemas, initFiledArrays);
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
      rules: dtHelper.buildRules(maintenanceFormSchemas),
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
    this.$store.dispatch('fetchMaintenanceForms', { perpage: 1000 });
    this.$store.dispatch('setPageTitle', 'maintenanceForm');
    this.$store.dispatch('setCurrentActions', []);
  },
  methods: {
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },

    edit(index, row) {
      this.$router.push(`/maintenance-form/${row.id}`);
    },
    create() {
      this.$router.push('/maintenance-form/create');
    },
   
    remove(index, row) {
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        this.$store.dispatch('removeMaintenanceForm', row.id).then((res) => {
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
</style>
