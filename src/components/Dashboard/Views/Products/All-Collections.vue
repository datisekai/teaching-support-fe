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
            v-bind:data-rows="collections"
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
import { MessageBox, Notification } from 'element-ui';
import MyTable from 'src/components/UIComponents/Table.vue';
import MyFilter from 'src/components/UIComponents/Filter.vue';
import dtHelper from 'src/helpers/datatable';
import ColumnToggle from 'src/components/UIComponents/ColumnToggle';
import collectionSchemas from './collection-schemas';

export default {
  components: {
    MyTable,
    MyFilter,
    ColumnToggle,
  },
  computed: {
    collections() {
      const rows = this.$store.state.collections.map(cat => {
        cat.categoryType = cat.type.split('_')[0];
        return cat;
      });
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
  },
  data() {
    const initFiledArrays = ['id', 'image', 'name', 'categoryType', 'createdAt'];
    const columnDefs = dtHelper.buildInitFields(collectionSchemas, initFiledArrays);
    return {
      filterOutput: [],
      columnDefs,
      actions: [],
      filter: {},
      rules: dtHelper.buildRules(collectionSchemas),
      actionsTable: [],
    };
  },
  mounted() {
    const actions = [
      {
        type: "primary",
        title: "create",
        icon: "",
        callback: () => this.$router.push("/collections/create"),
      },
    ];
    this.$store.dispatch('fetchCollections');
    this.$store.dispatch('setPageTitle', 'collection');
    this.$store.dispatch('setCurrentActions', actions);
  },
  methods: {
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    sortChange(data) {
      const prop = data.prop;
      const order = data.order == 'ascending' ? 'asc' : 'desc';
      this.$store.dispatch('fetchCollections', {
        order: `${prop}=${order}`,
      });
    },
    edit(index, row) {
      this.$router.push(`/collections/${row.id}`);
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
