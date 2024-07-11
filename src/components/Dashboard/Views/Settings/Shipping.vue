<template>
  <div class="row">
    <div class="col-md-12 card p-0">
      <div class="card-body row p-0">
        <div class="col-sm-12">
          <my-filter :rules="rules" v-on:filter-change="updateFilter"></my-filter>
        </div>
        <div class="col-sm-12">
          <my-table
            :columnDefs="columnDefs"
            v-bind:data-rows="shippings"
            :actions="actions"
            :actionsTable="actionsTable"
            :no-sort="true"
          />
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
import shippingSchemas from './shipping-schemas';

export default {
  components: {
    MyTable,
    MyFilter,
  },
  computed: {
    shippings() {
      const rows = this.$store.state.shippings;
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
  },
  data() {
    return {
      filterOutput: [],
      columnDefs: dtHelper.buildColumDefs(shippingSchemas),
      filter: {},
      rules: dtHelper.buildRules(shippingSchemas),
      actionsTable: [{
        title: 'Xóa',
        color: 'text-danger',
        callback: this.removeAll,
      },
      ],
      actions: [],
    };
  },
  mounted() {
    window.AP = this;
    this.$store.dispatch('fetchShippings');

    this.$store.dispatch('setPageTitle', 'phí vận chuyển');
    this.$store.dispatch('setCurrentActions', [{
      label: 'Thêm phí vận chuyển',
      type: 'primary',
      icon: '',
      callback: this.addShipping,
    }]);
  },
  methods: {
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    sortChange(data) {
      const prop = data.prop;
      const order = data.order == 'ascending' ? 'asc' : 'desc';
      this.$store.dispatch('fetchShippings', {
        order: `${prop}=${order}`,
      });
    },
    addShipping() {
      this.$router.push('/shipping/create');
    },
    removeAll(rows) {
      const self = this;
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        rows.forEach((element, index) => {
          self.$store.dispatch('removeShipping', element.id).then((res) => {
            Message({
              type: 'success',
              message: 'Đã xóa phương thức',
            });
            self.$store.dispatch('fetchShippings');
          }).catch((err) => {
            Message({
              type: 'error',
              message: err.message,
            });
          });
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
