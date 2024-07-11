<template>
  <div class="row">
    <div class="col-md-12 card p-0">
      <div class="card-body row p-0">
        <div class="col-sm-12">
          <my-table :columnDefs="columnDefs" v-bind:data-rows="emails" :actions="actions" :actionsTable="actionsTable" :noSort="true"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MyTable from 'src/components/UIComponents/Table.vue';
import MyFilter from 'src/components/UIComponents/Filter.vue';
import dtHelper from 'src/helpers/datatable';
import emailInit from './email-schemas';

export default {
  components: {
    MyTable,
    MyFilter,
  },
  computed: {
    emails() {
      return emailInit.data;
    },
  },
  data() {
    return {
      filterOutput: [],
      columnDefs: dtHelper.buildColumDefs(emailInit.schemas),
      actions: [
        {
          type: 'primary',
          icon: 'nc-icon nc-ruler-pencil',
          callback: this.edit,
        },
      ],
      actionsTable: [],
      filter: {},
      rules: dtHelper.buildRules(emailInit.schemas),
    };
  },
  mounted() {
    this.$store.dispatch('setPageTitle', 'thiết lập email');
  },
  methods: {
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    edit(index, row) {
      this.$router.push(`/email/${this.$util.createHandle(row.title)}`);
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
