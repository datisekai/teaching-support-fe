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
            v-bind:data-rows="rooms"
            :actions="actions"
            :actionsTable="actionsTable"
          />
        </div>
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
import roomSchemas from "./room-schemas";

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
    rooms() {
      const rows = this.$store.state.myRooms.map(c => {
        return {
          ...c,
          group_course: `${c.group.name} - ${c.group.course.name}`
        };
      });
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
    const initFiledArrays = [
      "id",
      "title",
      "description",
      "status",
      "description",
      "duration",
      "updated_at"
    ];
    const columnDefs = dtHelper.buildInitFields(roomSchemas, initFiledArrays);
    return {
      filterOutput: [],
      columnDefs,
      actions: [
        {
          type: "secondary",
          icon: "nc-icon nc-badge",
          title: "details",
          callback: this.view
        },
        {
          type: "primary",
          icon: "nc-icon nc-ruler-pencil",
          title: "edit",
          callback: this.edit
        },
        {
          type: "danger",
          icon: "nc-icon nc-simple-remove",
          title: "delete",
          callback: this.remove
        }
      ],
      filter: {},
      rules: dtHelper.buildRules(roomSchemas),
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
    this.$store.dispatch("fetchMyRooms");
    this.$store.dispatch("setPageTitle", "room");
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
    view(index, row) {
      this.$router.push(`/rooms/students/${row.id}`);
    },
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },

    edit(index, row) {
      this.$router.push(`/rooms/${row.id}`);
    },
    create() {
      this.$router.push("/rooms/create");
    },

    remove(index, row) {
      MessageBox.confirm("Bạn có chắc chắn xóa không?", "Warning", {
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$store.dispatch("removeRoom", row.id).then(res => {
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
