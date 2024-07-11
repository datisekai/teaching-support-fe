<template>
  <div class="row">
    <div class="col-md-12 card p-0">
      <div class="card-body row p-0">
        <div class="col-sm-12">
          <my-filter :rules="rules" v-on:filter-change="updateFilter"></my-filter>
        </div>
        <div class="col-sm-12">
          <my-table :columnDefs="columnDefs" v-bind:data-rows="tags" :actions="actions" :actionsTable="actionsTable" @sortChange="sortChange"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { MessageBox, Message } from 'element-ui';
import MyTable from 'src/components/UIComponents/Table.vue';
import MyFilter from 'src/components/UIComponents/Filter.vue';
import dtHelper from 'src/helpers/datatable';
import tagSchemas from './tag-schemas';

export default {
  components: {
    MyTable,
    MyFilter,
  },
  computed: {
    tags() {
      const rows = this.$store.state.tags;
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
  },
  data() {
    return {
      filterOutput: [],
      columnDefs: dtHelper.buildColumDefs(tagSchemas),
      actions: [
        {
          type: 'danger',
          icon: 'nc-icon nc-simple-remove',
          callback: this.remove,
        },
      ],
      actionsTable: [
        {
          title: 'Xóa',
          color: 'text-danger',
          callback: this.removeAll,
        },
      ],
      filter: {},
      rules: dtHelper.buildRules(tagSchemas),
    };
  },
  mounted() {
    window.AP = this;
    this.$store.dispatch('fetchTag');
    this.$store.dispatch('setPageTitle', 'tag');
  },
  methods: {
    remove(index, row) {
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        this.updateStatus([row], 'delete');
      });
    },
    removeAll(rows) {
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        this.updateStatus(rows, 'delete');
      });
    },
    updateStatus(rows, status) {
      const self = this;
      this.$util.updateStatusAll('tag', rows, status).then((result) => {
        self.$store.dispatch('fetchTag');
        Message({
          type: 'success',
          message: 'Xóa thành công',
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
      this.$store.dispatch('fetchTag', {
        order: `${prop}=${order}`,
      });
    },
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
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
