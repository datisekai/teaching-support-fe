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
            v-bind:data-rows="comments"
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
import commentSchmas from './comment-schemas';

export default {
  components: {
    MyTable,
    MyFilter,
    ColumnToggle,
  },
  computed: {
    comments() {
      const rows = this.$store.state.comment;
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
  },
  data() {
    const initFiledArrays = ['id', 'content', 'name', 'created_at', 'status'];
    const columnDefs = dtHelper.buildInitFields(commentSchmas, initFiledArrays);

    return {
      filterOutput: [],
      columnDefs,
      actions: [],
      filter: {},
      rules: dtHelper.buildRules(commentSchmas),
    };
  },
  mounted() {
    let type = this.$route.params.type;
    this.$store.dispatch('fetchComment', type);

    this.$store.dispatch('setPageTitle', 'bình luận');
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
      this.$store.dispatch('fetchComment', {
        order: `${prop}=${order}`,
      });
    },
    exportExcel(){
      let self = this;
      this.$util.exportExcel('comment', self.$store.state.comment);
    },
  },
  watch: {
    '$route' (to, from){
      let type = this.$route.params.type;
      this.$store.dispatch('fetchComment', type);
    }
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
