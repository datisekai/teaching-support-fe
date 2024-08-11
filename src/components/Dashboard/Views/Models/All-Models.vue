<template>
  <div class="row">
    <div class="card">
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
            rowKey="id"
            :columnDefs="columnDefs"
            v-bind:data-rows="models"
            :actions="actions"
            :actionsTable="actionsTable"
          />
        </div>
      </div>
    </div>
    <el-dialog
      width="500px"
      :title="
        formCreateModel.id ? $t('el.button.update') : $t('el.button.create')
      "
      :visible.sync="dialog.formCreateVisible"
      @closed="handleClosed"
      @close="handleCloseCreateModel"
      @keyup.enter.native="storeModel"
    >
      <el-select
        v-if="!formCreateModel.id"
        v-model="formCreateModel.type"
        style="width: 100%"
      >
        <el-option value="model" :label="$t('el.formCard.model')"></el-option>
        <el-option
          value="product_line"
          :label="$t('el.formCard.productLine')"
        ></el-option>
      </el-select>
      <el-form :model="formCreateModel" data-vv-scope="formCreateModel">
        <el-form-item
          v-if="formCreateModel.type == 'product_line'"
          :label="$t('el.formCard.model')"
        >
          <el-select
            :disabled="!!formCreateModel.id"
            v-model="formCreateModel.parentId"
            data-vv-name="formCreateModel.parentId"
            v-validate="'required'"
            :data-vv-as="$t('el.formCard.model')"
            :placeholder="$t('el.formCard.model')"
            :class="
              errors.has('formCreateModel.parentId') ? 'border-danger' : ''
            "
            style="width: 100%"
          >
            <el-option
              v-for="item in modelMenus"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
          <span
            class="text-danger"
            v-if="errors.has('formCreateModel.parentId')"
            >{{ errors.first("formCreateModel.parentId") }}</span
          >
        </el-form-item>

        <el-form-item
          :label="$t('el.formCard.sku')"
          v-if="formCreateModel.type == 'product_line'"
        >
          <el-input disabled v-model="formCreateModel.model"></el-input>
        </el-form-item>
        <el-form-item :label="$t('el.formCard.name')">
          <el-input
            data-vv-name="formCreateModel.name"
            v-validate="'required'"
            v-model="formCreateModel.name"
            :data-vv-as="$t('el.formCard.name')"
            :placeholder="$t('el.formCard.name')"
            :class="errors.has('formCreateModel.name') ? 'border-danger' : ''"
          ></el-input>
          <span class="text-danger" v-if="errors.has('formCreateModel.name')">{{
            errors.first("formCreateModel.name")
          }}</span>
        </el-form-item>
        <el-form-item label="SKU">
          <el-input
            :disabled="!!formCreateModel.id"
            data-vv-name="formCreateModel.sku"
            v-validate="'required'"
            v-model="formCreateModel.sku"
            data-vv-as="SKU"
            placeholder="SKU"
            :class="errors.has('formCreateModel.sku') ? 'border-danger' : ''"
          ></el-input>
          <span class="text-danger" v-if="errors.has('formCreateModel.sku')">{{
            errors.first("formCreateModel.sku")
          }}</span>
        </el-form-item>
        <el-form-item :label="$t('el.formCard.expiredTime')">
          <el-input
            :disabled="formCreateModel.type == 'product_line'"
            data-vv-name="formCreateModel.expiredIn"
            v-validate="'required'"
            v-model="formCreateModel.expiredIn"
            :data-vv-as="$t('el.formCard.expiredTime')"
            :placeholder="$t('el.formCard.expiredTime')"
            :class="
              errors.has('formCreateModel.expiredIn') ? 'border-danger' : ''
            "
          ></el-input>
          <span
            class="text-danger"
            v-if="errors.has('formCreateModel.expiredIn')"
            >{{ errors.first("formCreateModel.expiredIn") }}</span
          >
        </el-form-item>
        <el-form-item
          v-if="formCreateModel.type == 'product_line'"
          :label="$t('el.formCard.note')"
        >
          <el-input
            v-model="formCreateModel.note"
            :placeholder="$t('el.formCard.note')"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.formCreateVisible = false">{{
          $t("el.button.cancel")
        }}</el-button>
        <el-button
          type="primary"
          v-if="formCreateModel.id"
          @click="updateModel"
          :disabled="disabledForm"
          >{{ $t("el.button.update") }}</el-button
        >
        <el-button
          type="primary"
          v-else
          @click="storeModel"
          :disabled="disabledForm"
          >{{ $t("el.button.create") }}</el-button
        >
      </span>
    </el-dialog>
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
  Select,
  Option
} from "element-ui";
import MyMoney from "src/components/UIComponents/Money";
import MyTable from "src/components/UIComponents/Table.vue";
import MyFilter from "src/components/UIComponents/Filter.vue";
import ColumnToggle from "src/components/UIComponents/ColumnToggle";
import dtHelper from "src/helpers/datatable";
import modelSchemas from "./model-schemas";
import permissionSchemas from "./permission-schemas";

export default {
  components: {
    MyTable,
    MyMoney,
    MyFilter,
    ColumnToggle,
    ElForm: Form,
    ElInput: Input,
    ElDialog: Dialog,
    ElButton: Button,
    ElFormItem: FormItem,
    ElSelect: Select,
    ElOption: Option
  },
  computed: {
    models() {
      const rows = this.$store.state.models.map(m => {
        m.expiredTime = `${m.expiredIn} tháng`;
        m.modelName = m.name;
        if (m.children && m.children.length) {
          m.children = m.children.map(c => {
            c.productLine = c.name;
            return c;
          });
        }
        return m;
      });
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
    modelMenus() {
      return this.$store.state.modelMenus;
    },
    disabledForm() {
      if (this.formCreateModel.type == "model") {
        return !this.formCreateModel.name || !this.formCreateModel.sku;
      }
      return !this.formCreateModel.name || !this.formCreateModel.parentId;
    }
  },
  data() {
    const initFiledArrays = [
      "id",
      "modelName",
      "productLine",
      "sku",
      "expiredTime"
    ];
    const columnDefs = dtHelper.buildInitFields(modelSchemas, initFiledArrays);

    const tableActions = [];
    if (this.$util.checkPermissionAction(permissionSchemas, "edit")) {
      tableActions.push({
        type: "primary",
        icon: "fa-solid fa-pen-to-square",
        title: "edit",
        callback: this.showUpdateModel
      });
    }

    if (this.$util.checkPermissionAction(permissionSchemas, "delete")) {
      tableActions.push({
        type: "danger",
        icon: "fa-solid fa-xmark",
        title: "delete",
        callback: this.removeModel
      });
    }

    return {
      filterOutput: [],
      columnDefs,
      actions: tableActions,
      filter: {},
      rules: dtHelper.buildRules(modelSchemas),
      actionsTable: [],
      dialog: {
        formCreateVisible: false
      },
      formCreateModel: {
        expiredIn: 0,
        name: "",
        note: "",
        sku: "",
        type: "model",
        parentId: -1,
        id: 0
      }
    };
  },
  mounted() {
    const currentAction = [];
    if (this.$util.checkPermissionAction(permissionSchemas, "create")) {
      currentAction.push({
        label: "create",
        type: "primary",
        icon: "",
        callback: this.showCreateModel
      });
    }

    this.$store.dispatch("fetchModels");
    this.$store.dispatch("setPageTitle", "model");
    this.$store.dispatch("setCurrentActions", currentAction);
  },
  methods: {
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    showCreateModel() {
      this.dialog.formCreateVisible = true;
    },
    showUpdateModel(index, row) {
      this.formCreateModel = Object.assign({}, row);
      this.dialog.formCreateVisible = true;
    },
    handleCloseCreateModel() {
      this.formCreateModel.sku = "";
      this.formCreateModel.name = "";
      this.formCreateModel.id = 0;
      this.formCreateModel.type = "model";
      this.formCreateModel.expiredIn = 1;
      this.formCreateModel.parentId = -1;
      this.dialog.formCreateVisible = false;
    },

    handleClosed() {
      this.errors.clear();
    },
    storeModel() {
      this.$validator.validateAll("formCreateModel").then(result => {
        if (result) {
          this.formCreateModel.expiredIn = parseInt(
            this.formCreateModel.expiredIn
          );
          this.$store.dispatch("storeModel", this.formCreateModel).then(
            res => {
              Notification({
                title: "Success",
                message: "Create succeeded",
                position: "bottom-right",
                type: "success"
              });
              this.$store.dispatch("fetchModels");
              this.dialog.formCreateVisible = false;
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
        } else {
          Notification({
            title: "Error",
            message: "Validate failed",
            position: "bottom-right",
            type: "error"
          });
        }
      });
    },
    updateModel() {
      this.$validator.validateAll("formCreateModel").then(result => {
        if (result) {
          MessageBox.confirm(
            "Thời gian kết thúc của các mã bảo hành liên quan có thể bị thay đổi, bạn có chắc chắn cập nhật không?",
            "Warning",
            {
              confirmButtonText: "Đồng ý",
              cancelButtonText: "Hủy bỏ",
              type: "warning",
              center: true
            }
          )
            .then(() => {
              this.formCreateModel.expiredIn = parseInt(
                this.formCreateModel.expiredIn
              );
              this.$store.dispatch("updateModel", this.formCreateModel).then(
                res => {
                  Notification({
                    title: "Success",
                    message: "Update succeeded",
                    position: "bottom-right",
                    type: "success"
                  });
                  this.dialog.formCreateVisible = false;
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
            })
            .catch(() => {});
        } else {
          Notification({
            title: "Error",
            message: "Validate failed",
            position: "bottom-right",
            type: "error"
          });
        }
      });
    },
    removeModel(index, row) {
      MessageBox.confirm("Bạn có chắc chắn xóa không?", "Warning", {
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$store.dispatch("removeModel", row.id).then(res => {
            Notification({
              title: "Success",
              message: "Delete completed",
              position: "bottom-right",
              type: "success"
            });
          });
        })
        .catch(() => {});
    }
  },
  watch: {
    "formCreateModel.type": function(newVal, oldVal) {
      if (!this.formCreateModel.id) {
        if (newVal == "product_line" && this.modelMenus.length) {
          this.formCreateModel.parentId = this.modelMenus[0].value;
          this.formCreateModel.name = "";
          this.formCreateModel.note = "";
          this.formCreateModel.sku = "";
          this.formCreateModel.model = this.modelMenus[0].sku;
          this.formCreateModel.expiredIn = this.modelMenus[0].expiredIn;
        } else {
          this.formCreateModel.parentId = -1;
          this.formCreateModel.name = "";
          this.formCreateModel.note = "";
          this.formCreateModel.sku = "";
          this.formCreateModel.expiredIn = 0;
        }
      }
    },
    "formCreateModel.parentId": function(newVal, oldVal) {
      if (newVal != -1) {
        let model = this.modelMenus.find(m => m.value == newVal);
        this.formCreateModel.model = model.sku;
        this.formCreateModel.expiredIn = model.expiredIn;
      }
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

.el-form {
  .el-form-item {
    margin-bottom: 10px !important;
    .el-form-item__label {
      margin-bottom: 0px !important;
    }
  }
}
</style>
