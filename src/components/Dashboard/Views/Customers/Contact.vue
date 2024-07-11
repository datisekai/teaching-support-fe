<template>
  <div class="row">
    <div class="col-md-12 card p-0">
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
            v-bind:data-rows="contact"
            :actions="actions"
            :actionsTable="actionsTable"
            @sortChange="sortChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Message, MessageBox } from 'element-ui';
import MyTable from 'src/components/UIComponents/Table.vue';
import MyFilter from 'src/components/UIComponents/Filter.vue';
import dtHelper from 'src/helpers/datatable';
import ColumnToggle from 'src/components/UIComponents/ColumnToggle';
import contactSchemas from './contact-schemas';

export default {
  components: {
    MyTable,
    MyFilter,
    ColumnToggle,
  },
  computed: {
    contact() {
      const rows = this.$store.state.contact;
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
  },
  data() {
    const initFiledArrays = ['id', 'name', 'email', 'phone', 'created_at', 'reply'];
    const columnDefs = dtHelper.buildInitFields(contactSchemas, initFiledArrays);

    return {
      filterOutput: [],
      columnDefs,
      filter: {},
      rules: dtHelper.buildRules(contactSchemas),
      actions: [
        {
          type: 'primary',
          icon: 'nc-icon nc-ruler-pencil',
          callback: this.edit,
        },
      ],
      actionsTable: [
        {
          title: 'Chưa phản hồi',
          callback: this.unreplyAll,
        },
        {
          title: 'Đã phản hồi',
          callback: this.replyAll,
        },
        {
          title: 'Xóa',
          color: 'text-danger',
          callback: this.deleteAll,
        },
      ],
    };
  },
  mounted() {
    this.$store.dispatch('fetchContact');

    this.$store.dispatch('setPageTitle', 'Liên hệ');
    this.$store.dispatch('setCurrentActions', [{
      label: 'Xuất excel',
      type: 'default',
      icon: '',
      callback: this.exportExcel,
    }]);
  },
  methods: {
    edit(index, row) {
      this.$router.push(`/contacts/${row.id}`);
    },
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    readAll(rows) {
      this.updateStatus(rows, 'read', 'read');
    },
    replyAll(rows) {
      this.updateStatus(rows, 'reply', 'reply');
    },
    unreplyAll(rows) {
      this.updateStatus(rows, 'reply', 'unreply');
    },
    deleteAll(rows) {
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        this.updateStatus(rows, 'display', 'delete');
      });
    },
    updateStatus(rows, statusType, status) {
      let self = this;
      let arrID = [];
      for (let row of rows) {
        arrID.push(row.id);
      }

      let data = {
        type: 'contact',
        arrId: arrID,
        status
      };
      this.$store.dispatch('updateStatus', data).then((result) => {
        self.$store.dispatch('fetchContact');
        Message({
          type: 'success',
          message: 'Cập nhật thành công',
        });
      }).catch((error) => {
        Message({
          type: 'error',
          message: error.message,
        });
      });
    },
    sortChange(data) {
      const prop = data.prop;
      const order = data.order == 'ascending' ? 'asc' : 'desc';
      this.$store.dispatch('fetchContact', {
        order: `${prop}=${order}`,
      });
    },
    exportExcel(){
      let self = this;
      this.$util.exportExcel('contact', self.$store.state.contact);
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
</style>
