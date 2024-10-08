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
            v-bind:data-rows="exams"
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
import examSchemas from "./exam-schemas";

export default {
  components: {
    MyTable,
    MyFilter,
    ColumnToggle
  },
  computed: {
    exams() {
      const rows = this.$store.state.exams;
      return dtHelper.filterByRules(rows, this.filterOutput);
    }
  },
  data() {
    const initFiledArrays = ["id", "name", "status", "createdAt"];
    const columnDefs = dtHelper.buildInitFields(examSchemas, initFiledArrays);

    return {
      filterOutput: [],
      columnDefs,
      actions: [
        {
          type: "primary",
          icon: "fa-solid fa-pen-to-square",
          title: "Chỉnh sửa",
          callback: this.edit
        },
        {
          type: "danger",
          icon: "fa-solid fa-xmark",
          title: "Xóa",
          callback: this.remove
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
      rules: dtHelper.buildRules(examSchemas)
    };
  },
  mounted() {
    this.$store.dispatch("fetchExams");

    this.$store.dispatch("setPageTitle", "Quản lý Bài thi trắc nghiệm");
    this.$store.dispatch("setCurrentActions", [
      {
        label: "Tạo mới",
        type: "primary",
        icon: "",
        callback: this.create
      }
    ]);
  },
  methods: {
    create() {
      this.$router.push("/education/exam/create");
    },
    edit(index, row) {
      this.$router.push(`/education/exam/${row.id}`);
    },
    remove(index, row) {
      MessageBox.confirm("Bạn có chắc chắn xóa không?", "Warning", {
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$store.dispatch("removeExam", row.id).then(
            res => {
              Message({
                message: "Đã xóa",
                type: "success"
              });
            },
            error => {
              Message({
                message: res.message,
                type: "error"
              });
            }
          );
        })
        .catch(() => {});
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
        .updateStatusAll("exam", rows, status)
        .then(result => {
          self.$store.dispatch("fetchExams");
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
      this.$store.dispatch("fetchExams", {
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
