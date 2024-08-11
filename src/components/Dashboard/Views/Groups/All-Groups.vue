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
            v-bind:data-rows="groups"
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
import groupsSchemas from "./group-schemas";

export default {
  components: {
    MyTable,
    MyFilter,
    ColumnToggle
  },
  computed: {
    groups() {
      const rows = this.$store.state.groups.map(item => ({
        ...item,
        teacher_name: item.teacher.name,
        course_name: item.course.name
      }));
      return dtHelper.filterByRules(rows, this.filterOutput);
    }
  },
  data() {
    const initFiledArrays = ["id", "name", "description"];
    const columnDefs = dtHelper.buildInitFields(groupsSchemas, initFiledArrays);

    return {
      filterOutput: [],
      columnDefs,
      actions: [
        {
          type: "secondary",
          icon: "fa-solid fa-clipboard-user",
          callback: this.createRoom
        },
        {
          type: "primary",
          icon: "fa-solid fa-pen-to-square",
          callback: this.edit
        },
        {
          type: "danger",
          icon: "fa-solid fa-xmark",
          callback: this.remove
        }
      ],
      filter: {},
      rules: dtHelper.buildRules(groupsSchemas),
      actionsTable: []
    };
  },
  mounted() {
    this.$store.dispatch("fetchGroups");

    this.$store.dispatch("setPageTitle", "group");
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
        callback: this.create
      }
    ]);
  },
  methods: {
    createRoom(index, row) {
      this.$router.push(`/rooms/create?group_id=${row.id}`);
    },
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    edit(index, row) {
      this.$router.push(`/groups/${row.id}`);
    },
    create() {
      this.$router.push("/groups/create");
    },
    remove(index, row) {
      MessageBox.confirm("Bạn có chắc chắn xoá course không?", "Warning", {
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$store.dispatch("removeGroup", row.id).then(res => {
            Message({
              type: "success",
              message: "Đã xóa course"
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
