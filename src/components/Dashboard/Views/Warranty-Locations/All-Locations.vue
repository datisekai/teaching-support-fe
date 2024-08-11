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
            v-bind:data-rows="warrantyLocations"
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
import { mapState } from "vuex";
import { MessageBox, Notification } from "element-ui";
import MyTable from "src/components/UIComponents/Table.vue";
import MyFilter from "src/components/UIComponents/Filter.vue";
import dtHelper from "src/helpers/datatable";
import ColumnToggle from "src/components/UIComponents/ColumnToggle";
import locationSchemas from "./location-schemas";

export default {
  components: {
    MyTable,
    MyFilter,
    ColumnToggle
  },
  computed: {
    warrantyLocations() {
      const rows = this.$store.state.warrantyLocations;
      return dtHelper.filterByRules(rows, this.filterOutput);
    }
  },
  data() {
    let initFiledArrays = ["id", "name", "address", "phone", "createdAt"];
    let columnDefs = dtHelper.buildInitFields(locationSchemas, initFiledArrays);
    window.columnDefs = columnDefs;
    return {
      filterOutput: [],
      columnDefs,
      actions: [
        {
          type: "primary",
          icon: "fa-solid fa-pen-to-square",
          title: "edit",
          callback: this.edit
        },
        {
          type: "danger",
          icon: "fa-solid fa-xmark",
          title: "delete",
          callback: this.remove
        }
      ],
      actionsTable: [],
      filter: {},
      rules: dtHelper.buildRules(locationSchemas)
    };
  },
  mounted() {
    this.$store.dispatch("fetchWarrantyLocations");
    this.$store.dispatch("setPageTitle", "Các địa điểm bảo hành");
    this.$store.dispatch("setCurrentActions", [
      {
        label: "create",
        type: "primary",
        icon: "",
        callback: this.create
      }
    ]);
  },
  methods: {
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    sortChange(data) {
      const prop = data.prop;
      const order = data.order == "ascending" ? "asc" : "desc";
      this.$store.dispatch("fetchWarrantyLocations", {
        order: `${prop}=${order}`
      });
    },
    edit(index, row) {
      this.$router.push(`/warranty-location/${row.id}`);
    },
    create() {
      this.$router.push("/warranty-location/create");
    },
    remove(index, row) {
      MessageBox.confirm("Bạn có chắc chắn xóa không?", "Warning", {
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$store.dispatch("removeWarrantyLocation", row.id).then(res => {
            this.$store.dispatch("fetchWarrantyLocations");
            Notification({
              title: "Success",
              message: "Delete completed",
              position: "bottom-right",
              type: "success"
            });
          });
        })
        .catch(() => {
          Notification({
            title: "Canceled",
            message: "Delete canceled",
            position: "bottom-right",
            type: "info"
          });
        });
    },
    inactiveAll(rows) {
      this.updateStatus(rows, "inactive");
    },
    activeAll(rows) {
      this.updateStatus(rows, "active");
    },
    removeAll(rows) {
      MessageBox.confirm("Bạn có chắc chắn xóa không?", "Warning", {
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ",
        type: "warning",
        center: true
      }).then(() => {
        this.updateStatus(rows, "delete");
      });
    },
    updateStatus(rows, status) {
      const self = this;
      this.$util
        .updateStatusAll("location", rows, status)
        .then(result => {
          self.$store.dispatch("fetchWarrantyLocations");
          Notification({
            title: "Success",
            message: "Update succeeded",
            position: "bottom-right",
            type: "success"
          });
        })
        .catch(err => {
          Notification({
            title: "Error",
            message: err.message,
            position: "bottom-right",
            type: "error"
          });
        });
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
