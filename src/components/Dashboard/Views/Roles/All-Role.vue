<template>
  <div class="row">
    <div class="card">
      <div class="card-body p-0">
        <div class="row">
          <div class="col-sm-12">
            <my-filter :rules="rules" v-on:filter-change="updateFilter"></my-filter>
          </div>
          <div class="col-sm-12">
            <my-table :columnDefs="columnDefs" v-bind:data-rows="roles" :actions="actions" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { MessageBox, Message } from 'element-ui'
import MyTable from 'src/components/UIComponents/Table.vue';
import MyFilter from 'src/components/UIComponents/Filter.vue';
import dtHelper from 'src/helpers/datatable';
import roleSchemas from './role-schemas';

export default {
  components: {
    MyTable,
    MyFilter,
  },
  computed: {
    roles() {
      const rows = this.$store.state.roles;
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
  },
  data() {
    return {
      filterOutput: [],
      columnDefs: dtHelper.buildColumDefs(roleSchemas),
      actions: [
        {
          type: 'primary',
          icon: 'nc-icon nc-ruler-pencil',
          callback: this.edit
        },
        {
          type: 'danger',
          icon: 'nc-icon nc-simple-remove',
          callback: this.remove
        },
      ],
      filter: {},
      rules: dtHelper.buildRules(roleSchemas),
    };
  },
  mounted() {
    window.AP = this;
    this.$store.dispatch('fetchRoles');
    this.$store.dispatch('setPageTitle', 'phân quyền');
    this.$store.dispatch('setCurrentActions', [{
      label: 'Thêm phân quyền',
      type: 'primary',
      callback: this.createRole,
    }]);
  },
  methods: {
    edit(index, row) {
      this.$router.push('/roles/' + row.id);
    },
    remove(index, row) {
      MessageBox.confirm('Xóa phân quyền', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true
      }).then(() => {
        this.$store.dispatch('removeRole', row.id).then(res => {
          if (res.success) {
            Message({
              message: 'Đã xóa',
              type: 'success'
            });
            this.$store.dispatch('fetchRoles');
          } else {
            Message({
              message: res.message,
              type: 'danger'
            });
          }
        });
      });
    },
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    createRole() {
      this.$router.push('/roles/create');
    }
  },
  destroyed() {
    this.$store.dispatch('setCurrentActions', []);
  },
};
</script>
<style lang="scss">
  .el-table .td-actions {
    button.btn {
      margin-right: 5px;
    }
  }
</style>
