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
            v-bind:data-rows="reviews"
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
import reviewSchemas from './review-schemas';

export default {
  components: {
    MyTable,
    MyFilter,
    ColumnToggle,
  },
  computed: {
    reviews() {
      const rows = this.$store.state.review;
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
  },
  data() {
    const initFiledArrays = ['id', 'title', 'name', 'content', 'rating', 'created_at', 'status'];
    const columnDefs = dtHelper.buildInitFields(reviewSchemas, initFiledArrays);

    return {
      filterOutput: [],
      columnDefs,
      actions: [],
      filter: {},
      rules: dtHelper.buildRules(reviewSchemas),
      actionsTable: [
        {
          title: 'Ẩn',
          callback: this.inactiveAll,
        },
        {
          title: 'Hiện',
          callback: this.activeAll,
        },
        {
          title: 'Xóa',
          color: 'text-danger',
          callback: this.removeAll,
        },
      ],
    };
  },
  mounted() {
    this.$store.dispatch('fetchReview');

    this.$store.dispatch('setPageTitle', 'đánh giá');
    this.$store.dispatch('setCurrentActions', [{
      label: 'Xuất excel',
      type: 'default',
      icon: '',
      callback: this.exportExcel,
    }]);
  },
  methods: {
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    inactiveAll(rows) {
      this.updateStatus(rows, 'inactive');
    },
    activeAll(rows) {
      this.updateStatus(rows, 'active');
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
      this.$util.updateStatusAll('review', rows, status).then((result) => {
        self.$store.dispatch('fetchReview');
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
      this.$store.dispatch('fetchReview', {
        order: `${prop}=${order}`,
      });
    },
    exportExcel(){
      let self = this;
      this.$util.exportExcel('review', self.$store.state.review);
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
