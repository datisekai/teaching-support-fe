<template>
  <div class="row">
    <div class="col-md-12 card p-0">
      <div class="card-body">
        <!-- <div class="row">
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
        </div> -->
        <div class="col-sm-12 p-0">
          <my-table
            ref="table"
            :columnDefs="columnDefs"
            v-bind:data-rows="departments"
            :actions="actions"
            :actionsTable="actionsTable"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { MessageBox, Message } from "element-ui";
import MyTable from "src/components/UIComponents/Table.vue";
import MyFilter from "src/components/UIComponents/Filter.vue";
import dtHelper from "src/helpers/datatable";
import ColumnToggle from "src/components/UIComponents/ColumnToggle";
import departmentSchemas from "./department-schemas";

export default {
  components: {
    MyTable,
    MyFilter,
    ColumnToggle
  },
  computed: {
    departments() {
      const rows = this.$store.state.departments;
      return dtHelper.filterByRules(rows, this.filterOutput);
    }
  },
  data() {
    const initFiledArrays = ["id", "name", "description"];
    const columnDefs = dtHelper.buildInitFields(
      departmentSchemas,
      initFiledArrays
    );

    return {
      filterOutput: [],
      columnDefs,
      actions: [
        {
          type: "primary",
          icon: "nc-icon nc-ruler-pencil",
          callback: this.edit
        },
        {
          type: "danger",
          icon: "nc-icon nc-simple-remove",
          callback: this.remove
        }
      ],
      filter: {},
      rules: dtHelper.buildRules(departmentSchemas),
      actionsTable: [
        // {
        //   title: "Ẩn",
        //   callback: this.inactiveAll
        // },
        // {
        //   title: "Hiện",
        //   callback: this.activeAll
        // },
        // {
        //   title: "Xóa",
        //   color: "text-danger",
        //   callback: this.removeAll
        // }
      ]
    };
  },
  mounted() {
    this.$store.dispatch("fetchDepartments");

    this.$store.dispatch("setPageTitle", "department");
    this.$store.dispatch("setCurrentActions", [
      // {
      //   label: "Xuất excel",
      //   type: "default",
      //   icon: "",
      //   callback: this.exportExcel
      // },
      {
        label: "Tạo",
        type: "primary",
        icon: "",
        callback: this.createDepartment
      }
    ]);
  },
  methods: {
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    edit(index, row) {
      this.$router.push(`/departments/${row.id}`);
    },
    createDepartment() {
      this.$router.push("/departments/create");
    },
    remove(index, row) {
      MessageBox.confirm("Bạn có chắc chắn xoá department không?", "Warning", {
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$store.dispatch("removeDepartment", row.id).then(res => {
            Message({
              type: "success",
              message: "Đã xóa department"
            });
          });
        })
        .catch(() => {
          Message({
            type: "info",
            message: "Hủy bỏ"
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
        .updateStatusAll("department", rows, status)
        .then(result => {
          self.$store.dispatch("fetchGalleries");
          Message({
            type: "success",
            message: "Cập nhật thành công"
          });
        })
        .catch(error => {
          Message({
            type: "error",
            message: error.message
          });
        });
    }
    // exportExcel() {
    //   let self = this;
    //   this.$util.exportExcel("department", self.$store.state.galleries);
    // }
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
