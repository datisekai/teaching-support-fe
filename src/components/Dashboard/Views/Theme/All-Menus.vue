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
            v-bind:data-rows="menus"
            :actions="actions"
            :actionsTable="[]"
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
import menuSchemas from './menu-schemas';

export default {
  components: {
    MyTable,
    MyFilter,
    ColumnToggle
  },
  computed: {
    menus() {
      const rows = this.$store.state.menus;
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
  },
  data() {
    const initFiledArrays = ['id', 'title', 'slug', 'createdAt', 'isActive'];
    const columnDefs = dtHelper.buildInitFields(menuSchemas, initFiledArrays);
    return {
      filterOutput: [],
      columnDefs,
      actions: [
        {
          type: 'primary',
          title: 'edit',
          icon: 'nc-icon nc-ruler-pencil',
          callback: this.edit,
        }
      ],
      filter: {},
      rules: dtHelper.buildRules(menuSchemas),
    };
  },
  mounted() {
    this.$store.dispatch('fetchMenus');
    this.$store.dispatch('setPageTitle', 'Menu');
    this.$store.dispatch('setCurrentActions', []);
  },
  methods: {
    edit(index, row) {
      this.$router.push({name: 'EditMenu', params: {id: row.id}});
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
  label.el-form-item__label {
    margin-bottom: 0;
  }
</style>
