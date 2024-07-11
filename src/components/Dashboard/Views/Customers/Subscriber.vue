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
            v-bind:data-rows="subscribers"
            :actions="actions"
            @sortChange="sortChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MyTable from 'src/components/UIComponents/Table.vue';
import MyFilter from 'src/components/UIComponents/Filter.vue';
import dtHelper from 'src/helpers/datatable';
import ColumnToggle from 'src/components/UIComponents/ColumnToggle';
import subscriberSchemas from './subscriber-schemas';

export default {
  components: {
    MyTable,
    MyFilter,
    ColumnToggle,
  },
  computed: {
    subscribers() {
      const rows = this.$store.state.subscribers;
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
  },
  data() {
    const initFiledArrays = ['id', 'title', 'email', 'created_at'];
    const columnDefs = dtHelper.buildInitFields(subscriberSchemas, initFiledArrays);

    return {
      filterOutput: [],
      columnDefs,
      actions: [],
      filter: {},
      rules: dtHelper.buildRules(subscriberSchemas),
    };
  },
  mounted() {
    this.$store.dispatch('fetchSubscriber');

    this.$store.dispatch('setPageTitle', 'nhận bản tin');
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
    sortChange(data) {
      const prop = data.prop;
      const order = data.order == 'ascending' ? 'asc' : 'desc';
      this.$store.dispatch('fetchSubscriber', {
        order: `${prop}=${order}`,
      });
    },
    exportExcel(){
      let self = this;
      this.$util.exportExcel('subscriber', self.$store.state.subscribers);
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
