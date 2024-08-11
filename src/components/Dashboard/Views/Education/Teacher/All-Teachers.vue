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
            v-bind:data-rows="teachers"
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
import { MessageBox, Message } from "element-ui";
import MyTable from "src/components/UIComponents/Table.vue";
import MyFilter from "src/components/UIComponents/Filter.vue";
import dtHelper from "src/helpers/datatable";
import ColumnToggle from "src/components/UIComponents/ColumnToggle";
import teacherSchemas from "./teacher-schemas";

export default {
  components: {
    MyTable,
    MyFilter,
    ColumnToggle
  },
  computed: {
    teachers() {
      const rows = this.$store.state.teachers;
      return dtHelper.filterByRules(rows, this.filterOutput);
    }
  },
  data() {
    const initFiledArrays = ["id", "fullname", "email", "phone", "status"];
    const columnDefs = dtHelper.buildInitFields(
      teacherSchemas,
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
      actionsTable: [
        {
          title: "Ẩn",
          callback: this.inactiveAll
        },
        {
          title: "Hiện",
          callback: this.activeAll
        },
        {
          title: "Xóa",
          color: "text-danger",
          callback: this.removeAll
        }
      ],
      filter: {},
      rules: dtHelper.buildRules(teacherSchemas)
    };
  },
  mounted() {
    this.$store.dispatch("fetchTeachers");
    this.$store.dispatch("setPageTitle", "Yêu cầu xác thực giáo viên");
    this.$store.dispatch("setCurrentActions", []);
  },
  methods: {
    create() {
      this.$router.push("/education/teacher/create");
    },
    edit(index, row) {
      this.$router.push(`/education/teacher/${row.id}`);
    },

    updateStatus(rows, status) {
      const self = this;
      this.$util
        .updateStatusAll("teacher", rows, status)
        .then(result => {
          self.$store.dispatch("fetchTeachers");
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
    },
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    sortChange(data) {
      const prop = data.prop;
      const order = data.order == "ascending" ? "asc" : "desc";
      this.$store.dispatch("fetchTeachers", {
        order: `${prop}=${order}`
      });
    }
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
