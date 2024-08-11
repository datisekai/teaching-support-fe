<template lang="html">
  <div class="row">
    <div class="col-12">
      <el-card>
        <div slot="header">
          <h6>{{ $t("el.formCardTitle.receiptInformation") }}</h6>
          <div class="text-right font-weight-bold">
            <div>
              {{ $t("el.tableHeader.formNo") }}: {{ formReceipt.receiptNo }}
            </div>
            <div>
              {{ $t("el.tableHeader.book") }}: {{ formReceipt.notebook }}
            </div>
          </div>
        </div>
        <el-form :model="formCustomer" label-position="top">
          <el-form-item :label="$t('el.formCard.phone')">
            <el-input disabled v-model="formCustomer.phone"></el-input>
          </el-form-item>
          <el-form-item :label="$t('el.formCard.fullname')">
            <el-input disabled v-model="formCustomer.fullname"></el-input>
          </el-form-item>
          <el-form-item :label="$t('el.formCard.email')">
            <el-input disabled v-model="formCustomer.email"></el-input>
          </el-form-item>
          <el-form-item :label="$t('el.formCard.address')">
            <el-input disabled v-model="formWarranty.address"></el-input>
          </el-form-item>
        </el-form>
        <hr />
        <el-table border :data="warrantyItems" class="eye-table">
          <el-table-column minWidth="80px" :label="$t('el.tableHeader.#')">
            <template slot-scope="props">
              <span>{{ props.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column minWidth="140px" label="Mã bảo hành/ Tên sản phẩm">
            <template slot-scope="props">
              <span>{{
                (props.row.warrantyCode && props.row.warrantyCode.code) ||
                  props.row.name ||
                  "-"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column minWidth="200px" label="Nhóm ngành sản phẩm">
            <template slot-scope="props">
              <span>{{
                (props.row.model && props.row.model.name) || "-"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column minWidth="200px" label="Dòng sản phẩm">
            <template slot-scope="props">
              <span>{{
                (props.row.productLine && props.row.productLine.name) || "-"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('el.tableHeader.stamp')">
            <template slot-scope="props">
              <el-checkbox
                :disabled="formQuotation.status !== 'new'"
                v-model="props.row.stamp"
                @change="updateWarrantyItem(props.row)"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column :label="$t('el.tableHeader.dkbh')">
            <template slot-scope="props">
              <el-checkbox
                :disabled="formQuotation.status !== 'new'"
                v-model="props.row.isDKBH"
                @change="updateWarrantyItem(props.row)"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            prop="times"
            minWidth="100px"
            :label="$t('el.tableHeader.warrantyCount')"
          >
          </el-table-column>
        </el-table>
        <div class="mt-4 mb-4" style="color: #444">
          TỔNG CỘNG {{ warrantyItems.length }} THIẾT BỊ
        </div>
        <el-form :model="formReceipt" label-position="top">
          <el-form-item :label="$t('el.formCard.accessories')">
            <el-input
              v-model="formReceipt.accessories"
              :disabled="formReceipt.status == 'completed'"
            ></el-input>
          </el-form-item>
          <div class="row">
            <div class="col-6">
              <el-form-item :label="$t('el.formCard.receiveDate')">
                <el-input
                  disabled
                  :value="$util.formatDateTime(formReceipt.receivedAt)"
                ></el-input>
              </el-form-item>
            </div>
            <div class="col-6">
              <el-form-item :label="$t('el.formCard.returnDate')">
                <el-input
                  disabled
                  :value="$util.formatDateTime(formReceipt.returnedAt)"
                ></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <el-form-item :label="$t('el.formCard.warrantyAdmin')">
                <el-input
                  disabled
                  :value="findUser(formReceipt.adminId)"
                ></el-input>
              </el-form-item>
            </div>
            <div class="col-6">
              <el-form-item :label="$t('el.formCard.technicalStaff')">
                <el-input
                  disabled
                  :value="findUser(formReceipt.assigneeId)"
                ></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </el-card>
      <el-card>
        <div slot="header">
          <h6>{{ $t("el.formCardTitle.quotationInformation") }}</h6>
        </div>
        <div class="col-sm-12 p-0">
          <my-table
            :parentActions="parentActions"
            :ignoreActions="ignoreActions"
            ref="table"
            rowKey="rowKey"
            :columnDefs="columnDefs"
            v-bind:data-rows="foldableTableData"
            :actions="formQuotation.status === 'new' ? actions : []"
            :actionsTable="actionsTable"
          />
        </div>
      </el-card>
    </div>
    <el-dialog
      width="400px"
      :title="
        formAddError.id
          ? $t('el.dialogTitle.editResultError')
          : $t('el.dialogTitle.addError')
      "
      :visible.sync="modal.addError"
      @keyup.enter.native="addError"
    >
      <el-form :model="formAddError" data-vv-scope="formAddError">
        <el-form-item>
          <el-select
            style="width: 100%"
            v-model="formAddError.warrantyItemId"
            placeholder="Chọn mã/tên máy"
            disabled
          >
            <el-option
              v-for="item in warrantyItems"
              :value="item.id"
              :label="
                (item.warrantyCode && item.warrantyCode.code) || item.name
              "
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <select-ajax
            key="errorDescription"
            data-vv-name="errorDescription"
            placeholder="Tình trạng tiếp nhận"
            v-model="formAddError.productErrorId"
            v-validate="'required'"
            :disabled="formQuotation.status !== 'new'"
            :data-vv-as="$t('el.formCard.errorDescription')"
            :class="
              errors.has('formAddError.warrantyTypeId') ? 'border-danger' : ''
            "
            :attribute="{
              type: 'product_error',
              field: 'name',
              key: 'id',
              valueKey: 'id',
              multiple: false,
              initOptions: detailErrors('error'),
              extraQuery: { parentId: parentError && parentError.id }
            }"
          >
          </select-ajax>
        </el-form-item>
        <el-form-item>
          <select-ajax
            key="errorDescription"
            data-vv-name="errorDescription"
            placeholder="Đề nghị sửa chữa"
            v-model="formAddError.productSuggestionErrorId"
            v-validate="'required'"
            :disabled="formQuotation.status !== 'new'"
            :data-vv-as="$t('el.formCard.errorDescription')"
            :class="
              errors.has('formAddError.warrantyTypeId') ? 'border-danger' : ''
            "
            :attribute="{
              type: 'product_error',
              field: 'name',
              key: 'id',
              valueKey: 'id',
              multiple: false,
              initOptions: detailErrors('suggestion_error'),
              extraQuery: {
                parentId: parentSuggestionError && parentSuggestionError.id
              }
            }"
          >
          </select-ajax>
        </el-form-item>
        <el-form-item>
          <select-ajax
            key="errorDescription"
            data-vv-name="errorDescription"
            placeholder="Kết quả sửa chữa"
            v-model="formAddError.productResultErrorId"
            v-validate="'required'"
            :disabled="formQuotation.status !== 'new'"
            :data-vv-as="$t('el.formCard.errorDescription')"
            :class="
              errors.has('formAddError.warrantyTypeId') ? 'border-danger' : ''
            "
            :attribute="{
              type: 'product_error',
              field: 'name',
              key: 'id',
              valueKey: 'id',
              multiple: false,
              initOptions: detailErrors('result_error'),
              extraQuery: {
                parentId: parentResultError && parentResultError.id
              }
            }"
          >
          </select-ajax>
        </el-form-item>
        <el-form-item>
          <select-ajax
            key="errorDescription"
            data-vv-name="errorDescription"
            placeholder="Linh kiện sửa chữa"
            v-model="formAddError.productAccessoryId"
            v-validate="'required'"
            :disabled="formQuotation.status !== 'new'"
            :data-vv-as="$t('el.formCard.errorDescription')"
            :class="
              errors.has('formAddError.warrantyTypeId') ? 'border-danger' : ''
            "
            :attribute="{
              type: 'product_accessory',
              field: 'name',
              key: 'id',
              valueKey: 'id',
              multiple: false,
              initOptions: defaultProductAccessories,
              extraQuery: { productLineId: formAddError.productLineId }
            }"
          >
          </select-ajax>
        </el-form-item>
        <el-form-item>
          <my-money
            fixed="0"
            data-vv-name="price"
            :disabled="formQuotation.status !== 'new'"
            v-model="formAddError.price"
            v-validate="'required'"
            :placeholder="$t('el.formCard.price')"
            :class="errors.has('formAddError.price') ? 'border-danger' : ''"
            :data-vv-as="$t('el.formCard.price')"
          >
            <span slot="append">VND</span>
          </my-money>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modal.addError = false">{{
          $t("el.button.cancel")
        }}</el-button>
        <el-button
          v-if="!formAddError.id"
          type="primary"
          @click="addWarrantyLine"
          >{{ $t("el.button.add") }}</el-button
        >
        <el-button v-else type="primary" @click="editWarrantyLine">{{
          $t("el.button.update")
        }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      width="400px"
      :title="$t('el.dialogTitle.completeQuotationForm')"
      :visible.sync="modal.complete"
    >
      <el-form>
        <el-form-item>
          <div class="mt-2">
            {{ $t("el.formCard.customerAgree") + "?" }}
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modal.complete = false">{{
          $t("el.button.cancel")
        }}</el-button>
        <el-button type="danger" @click="complete(false)"
          >{{ $t("el.button.reject") }}
        </el-button>
        <el-button type="primary" @click="complete(true)"
          >{{ $t("el.button.agree") }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  Notification,
  MessageBox,
  Input,
  Button,
  Form,
  FormItem,
  Select,
  Option,
  Card,
  Table,
  TableColumn,
  Checkbox,
  RadioGroup,
  Radio,
  Dialog
} from "element-ui";
import SelectAjax from "src/components/UIComponents/SelectAjax";
import MyMoney from "src/components/UIComponents/Money";
import permissionSchemas from "./permission-schemas";
import quotationFoldableForm from "./quotation-foldable-form";
import dtHelper from "src/helpers/datatable";
import MyTable from "src/components/UIComponents/Table.vue";

export default {
  components: {
    MyTable,
    ElCard: Card,
    ElForm: Form,
    ElFormItem: FormItem,
    ElInput: Input,
    ElButton: Button,
    ElSelect: Select,
    ElOption: Option,
    ElTable: Table,
    ElTableColumn: TableColumn,
    ElCheckbox: Checkbox,
    ElRadioGroup: RadioGroup,
    ElRadio: Radio,
    ElDialog: Dialog,
    SelectAjax: SelectAjax,
    MyMoney
  },

  data() {
    const initFiledArrays = ["item_code", "method", "content", "price", "note"];
    const columnDefs = dtHelper.buildInitFields(
      quotationFoldableForm,
      initFiledArrays
    );
    const tableActions = [];
    if (this.$util.checkPermissionAction(permissionSchemas, "edit")) {
      tableActions.push({
        type: "primary",
        icon: "fa-solid fa-pen-to-square",
        title: "edit",
        callback: this.showModalEditError
      });
    }
    if (this.$util.checkPermissionAction(permissionSchemas, "delete")) {
      tableActions.push({
        type: "danger",
        icon: "fa-solid fa-xmark",
        title: "delete",
        callback: this.removeWarrantyLine
      });
    }
    const parentActions = [];
    if (this.$util.checkPermissionAction(permissionSchemas, "edit")) {
      parentActions.push({
        type: "primary",
        icon: "el-icon-circle-plus-outline",
        title: "add",
        callback: this.showModalAddError
      });
    }
    return {
      actions: tableActions,
      actionsTable: [],
      parentActions,
      formQuotation: {},
      columnDefs,
      formMaintenance: {
        warrantyItems: []
      },
      formWarranty: {},
      formCustomer: {},
      formReceipt: {},
      warrantyLinesButonEdit: false,
      formAddError: {
        id: null,
        productLineId: null,
        warrantyItemId: null,
        productErrorId: null,
        productAccessoryId: null,
        productResultErrorId: null,
        productSuggestionErrorId: null,
        price: 0
      },
      formDeleteError: {
        id: "",
        warrantyLineId: ""
      },
      modal: {
        addError: false,
        complete: false
      },
      defaultProductAccessories: []
    };
  },
  async mounted() {
    this.$store.dispatch("fetchModels");
    this.$store.dispatch("fetchProductErrors");
    this.$store.dispatch("fetchProductAccessories");
    this.$store.dispatch("setPageTitle", this.$t("el.sidebar.quotation"));
    this.$store.dispatch("setCurrentActions", []);
    this.$store.dispatch("fetchQuotationDetail", this.$route.params.id);
    if (this.$util.checkPermissionAction(permissionSchemas, "update")) {
      this.warrantyLinesButonEdit = true;
    }
  },
  computed: {
    foldableTableData() {
      return this.warrantyItems.map((item, index) => {
        item.rowKey = item.id + "-" + index;
        const productLine = this.productLines.find(
          i => i.id === item.productLineId
        );
        item.item_code =
          (productLine ? productLine.name + " - " : "") +
          ((item.warrantyCode && item.warrantyCode.code) || item.name);
        item.children = item.warrantyLines.map(line => {
          line.rowKey = line.id;
          line.productLineId = item.productLineId;
          const error = this.detailErrors("error").find(
            i => i.id === line.productErrorId
          );
          const resultError = this.detailErrors("result_error").find(
            i => i.id === line.productResultErrorId
          );
          const suggestionError = this.detailErrors("suggestion_error").find(
            i => i.id === line.productSuggestionErrorId
          );
          const accessory = this.detailAccessories.find(
            i => i.id === line.productAccessoryId
          );
          line.productError = (error && error.name) || "-";
          line.productResultError = (resultError && resultError.name) || "-";
          line.productSuggestionError =
            (suggestionError && suggestionError.name) || "-";
          line.productAccessory = (accessory && accessory.name) || "-";
          line.formattedMoney = this.$util.formatMoney(line.price);
          return line;
        });
        return item;
      });
    },
    warrantyItems() {
      return this.formMaintenance.warrantyItems.map(item => {
        item.model = this.models.find(i => i.id === item.modelId);
        item.productLine = this.productLines.find(
          l => l.id === item.productLineId
        );
        return item;
      });
    },
    warrantyLines() {
      return this.warrantyItems.reduce(
        (cur, i) => cur.concat(i.warrantyLines),
        []
      );
    },
    parentError() {
      return this.$store.state.productErrors.find(i => i.type === "error");
    },
    parentSuggestionError() {
      return this.$store.state.productErrors.find(
        i => i.type === "suggestion_error"
      );
    },
    parentResultError() {
      return this.$store.state.productErrors.find(
        i => i.type === "result_error"
      );
    },
    models() {
      return this.$store.state.models;
    },
    productLines() {
      return this.models.reduce((c, i) => c.concat(i.children), []);
    },
    detailAccessories() {
      return this.$store.state.productAccessories.reduce(
        (cur, i) => cur.concat(i.children),
        []
      );
    }
  },
  methods: {
    async removeWarrantyLine(index, row) {
      this.formDeleteError.id = this.formMaintenance.id;
      this.formDeleteError.warrantyLineId = row.id;
      try {
        let res = await this.$store.dispatch(
          "removeWarrantyLine",
          this.formDeleteError
        );
        if (res) {
          Notification({
            title: "Success",
            message: "Xóa lỗi thành công",
            position: "bottom-right",
            type: "success"
          });
          this.formMaintenance.warrantyItems = this.formMaintenance.warrantyItems.map(
            item => {
              if (item.id === res.warrantyItemId) {
                const index = item.warrantyLines.findIndex(
                  l => l.id === res.id
                );
                item.warrantyLines.splice(index, 1);
              }
              return item;
            }
          );
        }
      } catch (e) {
        Notification({
          title: "Error",
          message: e.message,
          position: "bottom-right",
          type: "error"
        });
      }
    },
    async updateWarrantyItem(row) {
      try {
        await this.$store.dispatch("updateWarrantyItem", {
          id: row.id,
          stamp: row.stamp,
          isDKBH: row.isDKBH
        });
      } catch (e) {
        Notification({
          title: "Error",
          message: e.message,
          position: "bottom-right",
          type: "error"
        });
      }
    },
    detailErrors(type) {
      const parent = this.$store.state.productErrors.find(i => i.type === type);
      return (parent && parent.children) || [];
    },
    ignoreActions(row) {
      return row.children;
    },
    showModalAddError(index, row) {
      this.formAddError = {
        id: null,
        warrantyItemId: row.id,
        productErrorId: null,
        productAccessoryId: null,
        productResultErrorId: null,
        productSuggestionErrorId: null,
        price: 0
      };
      this.modal.addError = true;
    },
    showModalEditError(index, row) {
      this.defaultProductAccessories = this.detailAccessories.filter(
        i => i.productLineId === row.productLineId
      );
      this.formAddError.productLineId = row.productLineId;
      this.formAddError.id = row.id;
      this.formAddError.warrantyItemId = row.warrantyItemId;
      this.formAddError.productErrorId = row.productErrorId;
      this.formAddError.productResultErrorId = row.productResultErrorId;
      this.formAddError.productSuggestionErrorId = row.productSuggestionErrorId;
      this.formAddError.productAccessoryId = row.productAccessoryId;
      this.formAddError.price = row.price;
      this.modal.addError = true;
    },
    findUser(id) {
      let user = this.$store.state.users.find(u => u.id == id);
      if (user) return user.fullname;
      return "-";
    },
    showCompleteModal() {
      this.modal.complete = true;
    },
    async updateCustomerAgree(agreeToFix) {
      this.formQuotation.agreeToFix = agreeToFix;
      if (this.formQuotation.status == "new") {
        try {
          await this.$store.dispatch("updateQuotation", {
            id: this.formQuotation.id,
            agreeToFix: this.formQuotation.agreeToFix
          });
        } catch (e) {
          Notification({
            title: "Error",
            message: e.message,
            position: "bottom-right",
            type: "error"
          });
        }
      }
    },
    async addWarrantyLine() {
      try {
        let res = await this.$store.dispatch("addWarrantyLine", {
          id: this.formMaintenance.id,
          data: this.formAddError
        });
        Notification({
          title: "Success",
          message: "Thêm thành công",
          position: "bottom-right",
          type: "success"
        });
        const warrantyItem = this.warrantyItems.find(
          i => i.id === res.warrantyItemId
        );
        if (warrantyItem) {
          warrantyItem.warrantyLines.push(res);
        }
        this.modal.addError = false;
      } catch (e) {
        Notification({
          title: "Error",
          message: e.message,
          position: "bottom-right",
          type: "error"
        });
      }
    },
    async editWarrantyLine() {
      try {
        let res = await this.$store.dispatch(
          "updateWarrantyLine",
          this.formAddError
        );
        Notification({
          title: "Success",
          message: "Cập nhật thành công",
          position: "bottom-right",
          type: "success"
        });
        const warrantyItem = this.warrantyItems.find(
          i => i.id === res.warrantyItemId
        );
        if (warrantyItem) {
          const index = warrantyItem.warrantyLines.findIndex(
            l => l.id === res.id
          );
          warrantyItem.warrantyLines[index] = Object.assign(
            warrantyItem.warrantyLines[index],
            res
          );
        }
        this.modal.addError = false;
      } catch (e) {
        Notification({
          title: "Error",
          message: e.message,
          position: "bottom-right",
          type: "error"
        });
      }
    },
    async complete(agreeToFix) {
      try {
        await this.updateCustomerAgree(agreeToFix);
        await this.$store.dispatch("completeQuotation", this.formQuotation.id);
        Notification({
          title: "Success",
          message: "Đã hoàn thành",
          position: "bottom-right",
          type: "success"
        });
        this.modal.complete = false;
        this.$store.dispatch("fetchQuotationDetail", this.$route.params.id);
      } catch (e) {
        Notification({
          title: "Error",
          message: e.message,
          position: "bottom-right",
          type: "error"
        });
      }
    },
    async createInvoice() {
      MessageBox.confirm("Bạn có chắc chắn muốn tạo phiếu thu?", "Warning", {
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ",
        type: "warning",
        center: true
      })
        .then(async () => {
          try {
            let res = await this.$store.dispatch("storeInvoice", {
              quotationFormId: this.formQuotation.id
            });
            Notification({
              title: "Success",
              message: "Đã tạo phiếu thu",
              position: "bottom-right",
              type: "success"
            });
            this.$router.push("/invoice/" + res.id);
          } catch (e) {
            Notification({
              title: "Error",
              message: e.message,
              position: "bottom-right",
              type: "error"
            });
          }
        })
        .catch(() => {});
    },
    async createReimbursement() {
      MessageBox.confirm("Bạn có chắc chắn muốn hoàn trả?", "Warning", {
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ",
        type: "warning",
        center: true
      })
        .then(async () => {
          try {
            let res = await this.$store.dispatch("storeReimbursement", {
              quotationFormId: this.formQuotation.id
            });
            Notification({
              title: "Success",
              message: "Đã tạo hoàn trả",
              position: "bottom-right",
              type: "success"
            });
            this.$router.push("/reimbursement/" + res.id);
          } catch (e) {
            Notification({
              title: "Error",
              message: e.message,
              position: "bottom-right",
              type: "error"
            });
          }
        })
        .catch(() => {});
    }
  },
  watch: {
    "formAddError.productAccessoryId": function(newVal) {
      const accessory = this.detailAccessories.find(i => i.id === newVal);
      if (!accessory) return;
      this.formAddError.price = accessory.price;
    },
    "$store.state.quotationDetail": function(newVal) {
      this.formQuotation = newVal;
      this.formMaintenance = this.formQuotation.maintenanceForm;
      this.formWarranty = this.formQuotation.maintenanceForm.warrantyForm;
      this.formCustomer = this.formMaintenance.customer.profile;
      this.formReceipt = this.formQuotation.receiptForm;
    },
    "formQuotation.status": function(newVal) {
      const currentActions = [];
      if (newVal == "completed") {
        const total =
          this.warrantyLines.reduce((cur, l) => cur + l.price, 0) || 0;
        if (total != 0) {
          currentActions.push({
            label: this.$t("el.button.invoice"),
            type: "warning",
            icon: "",
            disabled:
              this.formQuotation.invoiceForm ||
              this.$util.checkPermissionAction(
                permissionSchemas,
                "create_invoice"
              )
                ? false
                : true,
            callback: () => {
              if (this.formQuotation.invoiceForm) {
                this.$router.push(
                  "/invoice/" + this.formQuotation.invoiceForm.id
                );
              } else {
                this.createInvoice();
              }
            }
          });
        }
        if (
          this.$util.checkPermissionAction(
            permissionSchemas,
            "create_reimbursement"
          ) &&
          total === 0
        ) {
          currentActions.push({
            label: this.$t("el.button.reimbursement"),
            type: "primary",
            icon: "",
            callback: () => {
              if (this.formQuotation.reimbursementForm) {
                this.$router.push(
                  "/reimbursement/" + this.formQuotation.reimbursementForm.id
                );
              } else {
                this.createReimbursement();
              }
            }
          });
        }
      } else if (newVal == "new") {
        if (this.$util.checkPermissionAction(permissionSchemas, "update")) {
          currentActions.push({
            label: this.$t("el.button.complete"),
            type: "primary",
            icon: "",
            callback: this.showCompleteModal
          });
        }
      } else if (newVal == "denied") {
        currentActions.push({
          label: this.$t("el.button.reimbursement"),
          type: "primary",
          icon: "",
          callback: () => {
            if (this.formQuotation.reimbursementForm) {
              this.$router.push(
                "/reimbursement/" + this.formQuotation.reimbursementForm.id
              );
            } else {
              this.createReimbursement();
            }
          }
        });
      }
      this.$store.dispatch("setCurrentActions", currentActions);
    }
  },
  destroyed() {
    this.$store.dispatch("setCurrentActions", []);
    this.$store.state.customField = [];
  }
};
</script>
