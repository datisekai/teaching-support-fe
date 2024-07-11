<template>
  <div class="row">
    <div class="col-md-12 card p-0">
      <div class="card-body">
        <div class="row">
          <div class="col-sm-10">
            <my-filter :rules="rules" v-on:filter-change="updateFilter"></my-filter>
          </div>
          <div class="col-sm-2">
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
            v-bind:data-rows="users"
            :actions="actions"
            :no-sort="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { MessageBox, Notification } from 'element-ui';
import { mapState } from 'vuex';
import userSchemas from './user-schemas';
import dtHelper from 'src/helpers/datatable';
import MyTable from 'src/components/UIComponents/Table.vue';
import MyFilter from 'src/components/UIComponents/Filter.vue';
import ColumnToggle from 'src/components/UIComponents/ColumnToggle';

export default {
  components: {
    MyTable,
    MyFilter,
    ColumnToggle,
  },
  computed: {
    ...mapState(['user']),
    users() {
      const rows = this.$store.state.users;
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
  },
  data() {
    const initFiledArrays = ['fullname', 'email', 'phone', 'createdAt'];
    return {
      filterOutput: [],
      columnDefs: dtHelper.buildInitFields(userSchemas, initFiledArrays),
      actions: [
        {
          type: 'primary',
          icon: 'nc-icon nc-ruler-pencil',
          callback: this.edit,
        },
        {
          type: 'danger',
          icon: 'nc-icon nc-simple-remove',
          callback: this.remove,
        },
      ],
      filter: {},
      rules: dtHelper.buildRules(userSchemas),
    };
  },
  mounted() {
    this.$store.dispatch('fetchUsers', {roles: ['admin_agency']});
    this.$store.dispatch('setPageTitle', 'Đại lý');
    this.$store.dispatch('setCurrentActions', [{
      label: 'create',
      type: 'primary',
      icon: '',
      callback: this.createUser,
    }]);
  },
  methods: {
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    edit(index, row) {
      this.$router.push({name: 'EditAgency', params: {id: row.id}});
    },
    createUser() {
      this.$router.push({name: 'CreateAgency'});
    },
    remove(index, row) {
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        if (row.id == this.user.id) {
          return Notification({
            title: 'Delete canceled',
            message: 'Can not delete yourself!',
            position: 'bottom-right',
            type: 'error',
          });
        }
        this.$store.dispatch('removeUser', row.id);
        Notification ({
          title: 'Success',
          message: 'Delete completed',
          position: 'bottom-right',
          type: 'success',
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
