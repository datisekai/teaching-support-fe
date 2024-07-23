<template>
  <div class="row">
    <div class="card">
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
            v-bind:data-rows="students"
            :actions="actions"
            :actionsTable="actionsTable"
          />
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <div class="page-action">
        <el-button @click="back">Quay lại</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  MessageBox,
  Notification,
  Dialog,
  Form,
  FormItem,
  Input,
  Button,
  Divider
} from "element-ui";
import MyMoney from "src/components/UIComponents/Money";
import MySelect from "src/components/UIComponents/Select";
import MyTable from "src/components/UIComponents/Table.vue";
import MyFilter from "src/components/UIComponents/Filter.vue";
import ColumnToggle from "src/components/UIComponents/ColumnToggle";
import dtHelper from "src/helpers/datatable";
import studentSchemas from "./student-schemas";

export default {
  components: {
    MyTable,
    MyMoney,
    MySelect,
    MyFilter,
    ColumnToggle,
    ElForm: Form,
    ElInput: Input,
    ElDialog: Dialog,
    ElButton: Button,
    ElDivider: Divider,
    ElFormItem: FormItem
  },
  computed: {
    students() {
      const rows = this.$store.state.roomStudents.map(c => ({
        ...c.student,
        success: c.success ? "Thành công" : "Thất bại",
        phone: c.student.phone || "Chưa có",
        type: c.success ? "success" : "danger",
        created_at: c.created_at
      }));
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
    models() {
      return this.$store.state.models.map(m => {
        return {
          value: m.id,
          title: m.title
        };
      });
    }
  },
  data() {
    const initFiledArrays = ["id", "code", "email", "phone", "success"];
    const columnDefs = dtHelper.buildInitFields(
      studentSchemas,
      initFiledArrays
    );
    return {
      filterOutput: [],
      columnDefs,
      actions: [],
      filter: {},
      rules: dtHelper.buildRules(studentSchemas),
      actionsTable: [],
      dialog: {
        formCreateVisible: false,
        formValidateVisible: false
      },
      formCreateWarrantyCode: {
        modelId: null,
        amount: 1
      },
      formValidateWarrantyCode: {
        code: "",
        result: null
      }
    };
  },
  mounted() {
    this.$store.dispatch("fetchRoomStudents", this.$route.params.id);
    this.$store.dispatch("setPageTitle", "roomStudents");
    this.$store.dispatch("setCurrentActions", [
      {
        label: "exportExcel",
        type: "default",
        icon: "",
        callback: this.exportExcel
      }
    ]);
  },
  methods: {
    exportExcel() {
      this.$util.exportExcel("roomStudents", this.$store.state.roomStudents);
    },
    back() {
      this.$router.push({ name: "AllRooms" });
    },
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    }
  },
  destroyed() {
    this.$store.dispatch("resetRoomStudents", []);
  }
};
</script>
<style lang="scss">
.el-table .td-actions {
  button.btn {
    margin-right: 5px;
  }
}

.el-dialog__body {
  padding: 10px 20px !important;
}

.el-form {
  .el-form-item {
    margin-bottom: 10px !important;
    .el-form-item__label {
      margin-bottom: 0px !important;
    }
    p {
      margin-bottom: 0px !important;
    }
  }
  .el-divider--horizontal {
    margin-bottom: 12px !important;
  }
}
</style>
