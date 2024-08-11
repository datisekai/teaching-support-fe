<template>
  <div class="row">
    <div class="col-md-12 card p-0">
      <div class="card-body row p-0">
        <div class="col-sm-12">
          <my-filter
            :rules="rules"
            v-on:filter-change="updateFilter"
          ></my-filter>
        </div>
        <div class="col-sm-12">
          <my-table
            v-bind:data-rows="meta"
            :columnDefs="columnDefs"
            :actions="actions"
            :actionsTable="actionsTable"
          />
        </div>
      </div>
    </div>
    <el-dialog
      width="700px"
      :title="$t('el.button.create')"
      :visible.sync="dialogFormCreateVisible"
      @keyup.enter.native="storeMeta"
    >
      <el-form :model="formCreateMeta">
        <el-form-item :label="$t('el.formCard.metaKey')">
          <el-input
            autocomplete="off"
            data-vv-name="metaKey"
            v-model="formCreateMeta.metaKey"
            :placeholder="$t('el.formCard.metaKey')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('el.formCard.metaValue')">
          <el-input
            autocomplete="off"
            data-vv-name="metaValue"
            v-model="formCreateMeta.metaValue"
            :placeholder="$t('el.formCard.metaValue')"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormCreateVisible = false">{{
          $t("el.button.cancel")
        }}</el-button>
        <el-button
          type="primary"
          @click="storeMeta"
          :disabled="!formCreateMeta.metaKey || !formCreateMeta.metaValue"
          >{{ $t("el.button.create") }}</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      width="700px"
      :title="$t('el.button.update')"
      :visible.sync="dialogFormEditVisible"
      @keyup.enter.native="updateMeta"
    >
      <el-form :model="formUpdateMeta">
        <el-form-item :label="$t('el.formCard.metaKey')">
          <el-input
            autocomplete="off"
            data-vv-name="metaKey"
            :disabled="true"
            :value="formUpdateMeta.metaKey"
            :placeholder="$t('el.formCard.metaKey')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('el.formCard.metaValue')">
          <el-input
            autocomplete="off"
            data-vv-name="metaValue"
            v-model="formUpdateMeta.metaValue"
            :placeholder="$t('el.formCard.metaValue')"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormEditVisible = false">{{
          $t("el.button.cancel")
        }}</el-button>
        <el-button
          type="primary"
          @click="updateMeta"
          :disabled="!formUpdateMeta.metaKey || !formUpdateMeta.metaValue"
          >{{ $t("el.button.update") }}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  MessageBox,
  Dialog,
  Input,
  Form,
  FormItem,
  Notification,
  Button
} from "element-ui";
import MyTable from "src/components/UIComponents/Table.vue";
import MyFilter from "src/components/UIComponents/Filter.vue";
import dtHelper from "src/helpers/datatable";
import metaSchemas from "./meta-schemas";

export default {
  components: {
    MyTable,
    MyFilter,
    ElForm: Form,
    ElInput: Input,
    ElDialog: Dialog,
    ElButton: Button,
    ElFormItem: FormItem
  },
  computed: {
    meta() {
      const rows = this.$store.getters.meta;
      return dtHelper.filterByRules(rows, this.filterOutput);
    }
  },
  data() {
    const initFiledArrays = ["metaKey", "metaValue", "createdAt"];
    return {
      filterOutput: [],
      columnDefs: dtHelper.buildInitFields(metaSchemas, initFiledArrays),
      actions: [
        {
          type: "primary",
          title: "edit",
          icon: "fa-solid fa-pen-to-square",
          callback: this.showEditMetaForm
        },
        {
          type: "danger",
          title: "delete",
          icon: "fa-solid fa-xmark",
          callback: this.remove
        }
      ],
      actionsTable: [],
      filter: {},
      rules: dtHelper.buildRules(metaSchemas),
      dialogFormCreateVisible: false,
      dialogFormEditVisible: false,
      formCreateMeta: {
        metaKey: "",
        metaValue: ""
      },
      formUpdateMeta: {
        metaKey: "",
        metaValue: ""
      }
    };
  },
  mounted() {
    this.$store.dispatch("fetchMeta");
    this.$store.dispatch("setPageTitle", "meta");
    this.$store.dispatch("setCurrentActions", [
      {
        label: "create",
        type: "primary",
        icon: "",
        callback: this.showCreateMetaForm
      }
    ]);
  },
  methods: {
    remove(index, row) {
      MessageBox.confirm("Bạn có chắc chắn xóa không?", "Warning", {
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$store.dispatch("removeMeta", row.metaKey).then(res => {
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
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    storeMeta() {
      this.$store.dispatch("storeMeta", this.formCreateMeta).then(
        res => {
          Notification({
            title: "Success",
            message: "Create succeeded",
            position: "bottom-right",
            type: "success"
          });
          this.dialogFormCreateVisible = false;
          this.$store.dispatch("fetchMetas");
        },
        err => {
          Notification({
            title: "Error",
            message: err.message,
            position: "bottom-right",
            type: "error"
          });
        }
      );
    },
    updateMeta() {
      this.$store.dispatch("updateMeta", this.formUpdateMeta).then(
        res => {
          Notification({
            title: "Success",
            message: "Update succeeded",
            position: "bottom-right",
            type: "success"
          });
          this.dialogFormUpdateVisible = false;
          this.$store.dispatch("fetchMetas");
        },
        err => {
          Notification({
            title: "Error",
            message: err.message,
            position: "bottom-right",
            type: "error"
          });
        }
      );
    },
    showCreateMetaForm() {
      this.dialogFormCreateVisible = true;
    },
    showEditMetaForm(index, row) {
      this.formUpdateMeta.metaKey = row.metaKey;
      this.formUpdateMeta.metaValue = row.metaValue;
      this.dialogFormEditVisible = true;
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
button.is-disabled {
  opacity: 0.5;
}
</style>
