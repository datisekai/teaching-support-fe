<template>
  <div class="row">
    <div class="col-md-12 card p-0">
      <div class="card-body">
        <div class="row">
          <div class="col-lg-9 col-md-6 col-sm-6 col-6">
            <my-filter
              :rules="rules"
              v-on:filter-change="updateFilter"
            ></my-filter>
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
            v-bind:data-rows="customers"
            :actions="actions"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MyTable from "src/components/UIComponents/Table.vue";
import MyFilter from "src/components/UIComponents/Filter.vue";
import dtHelper from "src/helpers/datatable";
import ColumnToggle from "src/components/UIComponents/ColumnToggle";
import customerSchemas from "./customer-schemas";

export default {
  components: {
    MyTable,
    MyFilter,
    ColumnToggle
  },
  computed: {
    customers() {
      const rows = this.$store.getters.customers.map(c => {
        const profile = c.profile || {};
        c.fullname = c.fullname || profile.fullname;
        c.email = c.email || profile.email;
        c.avatar = profile.avatar;
        c.gender = profile.gender;
        c.dateOfBirth = profile.dateOfBirth;
        c.phone = c.phone || "";
        return c;
      });
      return dtHelper.filterByRules(rows, this.filterOutput);
    }
  },
  data() {
    const initFiledArrays = [
      "id",
      "avatar",
      "fullname",
      "email",
      "phone",
      "gender",
      "dateOfBirth"
    ];
    const columnDefs = dtHelper.buildInitFields(
      customerSchemas,
      initFiledArrays
    );
    return {
      filterOutput: [],
      columnDefs,
      actions: [
        {
          type: "primary",
          icon: "fa-solid fa-pen-to-square",
          callback: this.edit
        }
      ],
      filter: {},
      rules: dtHelper.buildRules(customerSchemas)
    };
  },
  mounted() {
    this.$store.dispatch("fetchCustomers", { role: "user" });
    this.$store.dispatch("setPageTitle", "customer");
    this.$store.dispatch("setCurrentActions", []);
  },
  methods: {
    edit(index, row) {
      this.$router.push({ name: "EditCustomer", params: { id: row.id } });
    },
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    exportExcel() {
      let self = this;
      this.$util.exportExcel("customer", self.$store.state.customers);
    }
  },
  destroyed() {
    this.$store.dispatch("setCurrentActions", []);
  }
};
</script>
<style lang="scss">
.el-table .td-actions {
  button.btn {
    margin-right: 5px;
  }
}
</style>
