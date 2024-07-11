<template lang="html">
  <div class="row">
    <div class="col-12">
      <el-card>
        <div slot="header" style="position: relative; padding: 15px 0;">
          <h6 >{{$t('el.formCardTitle.receiptInformation')}}</h6>
          <div style="position: absolute; right: 0" class="text-right font-weight-bold d-flex align-items-center">
            <div>
              <div>{{$t('el.tableHeader.formNo')}}: {{formReceipt.receiptNo}}</div>
              <div>{{$t('el.tableHeader.book')}}: {{formReceipt.notebook}}</div>
            </div>
            <qrcode :value="formReceipt.receiptNo" :options="{ width: 70 }"></qrcode>
          </div>
        </div>
        <el-form :model="formCustomer" label-position="top">
          <el-form-item :label="$t('el.formCard.phone')">
            <el-input disabled v-model="formCustomer.phone" ></el-input>
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
        <hr>
        <el-table border :data="warrantyItems" class="eye-table">
          <el-table-column
            minWidth="50px"
            :label="$t('el.tableHeader.#')">
             <span slot-scope="props">
              <span>{{props.$index + 1}}</span>
            </span>
          </el-table-column>
          <el-table-column
            minWidth="140px"
            label="Mã bảo hành/ Tên sản phẩm">
             <span slot-scope="props">
              <span>{{props.row.warrantyCode && props.row.warrantyCode.code || props.row.name || '-'}}</span>
            </span>
          </el-table-column>
          <el-table-column
            minWidth="200px"
            label="Nhóm ngành sản phẩm">
            <span slot-scope="props">
              <span>{{(props.row.model && props.row.model.name) || '-'}}</span>
            </span>
          </el-table-column>

          <el-table-column
            minWidth="200px"
            label="Dòng sản phẩm">
            <span slot-scope="props">
              <span>{{(props.row.productLine && props.row.productLine.name) || '-'}}</span>
            </span>
          </el-table-column>
          <el-table-column
            :label="$t('el.tableHeader.stamp')">
            <span slot-scope="props">
              <el-checkbox :disabled="formReceipt.status !== 'new'" v-model="props.row.stamp" @change="updateWarrantyItem(props.row)"></el-checkbox>
            </span>
          </el-table-column>
          <el-table-column
            :label="$t('el.tableHeader.dkbh')">
            <span slot-scope="props">
              <el-checkbox :disabled="formReceipt.status !== 'new'" v-model="props.row.isDKBH" @change="updateWarrantyItem(props.row)"></el-checkbox>
            </span>
          </el-table-column>
          <el-table-column
            prop="times"
            minWidth="100px"
            :label="$t('el.tableHeader.warrantyCount')">
          </el-table-column>
          <el-table-column
            v-if="formReceipt.status == 'new'"
            width="90px"
            fixed="right"
            :label="$t('el.tableHeader.actions')">
            <span slot-scope="props">
              <el-button size="mini" icon="el-icon-edit" type="info" @click="showEditModal(props.$index, props.row)"></el-button>
            </span>
          </el-table-column>
        </el-table>
        <div class="mt-4 mb-4" style="color: #444">TỔNG CỘNG {{warrantyItems.length}} THIẾT BỊ</div>
        <el-form :model="formReceipt" label-position="top">
          <el-form-item :label="$t('el.formCard.accessories')">
            <el-input v-model="formReceipt.accessories" :disabled="formReceipt.status !== 'new'"></el-input>
          </el-form-item>
          <div class="row">
            <div class="col-6">
              <el-form-item :label="$t('el.formCard.receiveDate')">
                <el-date-picker
                  disabled
                  v-model="formReceipt.receivedAt"
                  type="datetime"
                  name="receivedAt"
                  :style="{width: '100%'}"
                  placeholder="Chọn thời gian">
                </el-date-picker>
              </el-form-item>
            </div>
            <div class="col-6">
              <el-form-item :label="$t('el.formCard.returnDate')">
                <el-date-picker
                  disabled
                  v-model="formReceipt.returnedAt"
                  name="returnedAt"
                  type="datetime"
                  :style="{width: '100%'}"
                  placeholder="Chọn thời gian">
                </el-date-picker>
              </el-form-item>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <el-form-item :label="$t('el.formCard.actualReturnDate')">
                <el-date-picker
                  disabled
                  v-model="formReceipt.actualReturnedAt"
                  type="datetime"
                  name="returnedAt"
                  :style="{width: '100%'}"
                  placeholder="Chọn thời gian">
                </el-date-picker>
              </el-form-item>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <el-form-item :label="$t('el.formCard.warrantyAdmin')">
                <el-input disabled :value="findUser(formReceipt.adminId)"></el-input>
              </el-form-item>
            </div>
            <div class="col-6">
              <el-form-item :label="$t('el.formCard.technicalStaff')">
                <el-input disabled :value="findUser(formReceipt.assigneeId)"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </el-card>
    </div>
    <el-dialog 
      width="400px" 
      :title="$t('el.dialogTitle.editProductLine')" 
      :visible.sync="modal.editProductName"  
      @keyup.enter.native="editProductName"
    >
      <el-form :model="formEditProductName" data-vv-scope="formEditProductName">
        <el-form-item>
          <select-ajax
            key="productName"
            data-vv-name="productName"
            :placeholder="$t('el.formCard.productName')"
            v-model="formEditProductName.productLineId"
            v-validate="'required'"
            :data-vv-as="$t('el.formCard.productName')"
            :class="errors.has('formEditProductName.productLineId')?'border-danger':''"
            :attribute="{type: 'product_model', field: 'name', key: 'id', valueKey: 'id', multiple: false, initOptions: defaultProductLines, extraQuery: extraQuery}"
          >
          </select-ajax>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modal.editProductName = false">{{$t('el.button.cancel')}}</el-button>
        <el-button type="primary" @click="updateProductName" :disabled="!formEditProductName.productLineId">{{$t('el.button.update')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  Notification,
  MessageBox,
  Message,
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
  Dialog,
  DatePicker
} from "element-ui";
import SelectAjax from "src/components/UIComponents/SelectAjax";
import permissionSchemas from "./permission-schemas";

export default {
  components: {
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
    ElDatePicker: DatePicker,
    SelectAjax: SelectAjax,
  },

  data() {
    return {
      form: {},
      checkCode: "",
      formCustomer: {},
      formReceipt: {
        returnedAt: null,
        receivedAt: null,
      },
      formMaintenance: {
        warrantyItems: [],
      },
      formWarranty: {},
      formEditProductName: {
        id: null,
        productLineId: null,
        productLineName: null,
      },
      formReimbursement: {},
      modal: {
        editProductName: false,
      },
      defaultProductLines: [],
      extraQuery: {},
    };
  },
  async mounted() {
    await this.$store.dispatch("fetchUsers", {
      roles: [
        "admin",
        "manager",
        "supporter",
        "admin_warranty",
        "vice_admin_warranty",
        "warranty_manager",
        "technical_leader",
        "technician",
      ],
    });
    await this.$store.dispatch("fetchModels");
    this.$store.dispatch("setPageTitle", "receiptForm");
    this.$store.dispatch("setCurrentActions", []);
    this.$store.dispatch("fetchReceiptDetail", this.$route.params.id);
  },
  computed: {
    customField: {
      get() {
        return this.$store.state.customField;
      },
      set(value) {},
    },
    models() {
      return this.$store.state.models;
    },
    productLines() {
      return this.models.reduce((c, i) => c.concat(i.children), []);
    },
    warrantyItems() {
      return this.formMaintenance.warrantyItems.map(item => {
        item.productLine = this.productLines.find((l) => l.id === item.productLineId);
        item.model = this.models.find((i) => i.id === item.modelId);
        return item;
      })
    }
  },
  methods: {
    async exportPDF() {
      let resp = await this.$store.dispatch("exportReceiptForm", this.formReceipt.id);
      window.open(resp.data, "_blank");
    },
    showEditModal(index, row) {
      const productLines = this.productLines.filter((c) => c.parentId == row.modelId) || [];
      this.extraQuery = { parentId: row.modelId };
      this.defaultProductLines = productLines;
      this.formEditProductName.id = row.id;
      this.formEditProductName.productLineId = row.productLineId;
      this.formEditProductName.productLineName = row.name;
      this.modal.editProductName = true;
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
    async updateProductName(row) {
      try {
        let res = await this.$store.dispatch("updateWarrantyItem", this.formEditProductName);
        Notification({
          title: "Success",
          message: "Cập nhật thành công",
          position: "bottom-right",
          type: "success",
        });
        this.formMaintenance.warrantyItems = this.formMaintenance.warrantyItems.map((w) => {
            if (w.id == res.id) {
              w.productLineId = res.productLineId;
              w.productLine = this.productLines.find(
                (l) => l.id === w.productLineId
              );
            }
            return w;
          }
        );
        this.modal.editProductName = false;
      } catch (e) {
        Notification({
          title: "Error",
          message: e.message,
          position: "bottom-right",
          type: "error",
        });
      }
    },
    findUser(id) {
      let user = this.$store.state.users.find((u) => u.id == id);
      if (user) return user.fullname;
      return "-";
    },
    async complete() {
      if (!this.formReceipt.accessories) {
        this.formReceipt.accessories = "";
      }
      MessageBox.confirm(
        "Bạn có chắc chắn hoàn thành biên nhận không?",
        "Warning",
        {
          confirmButtonText: "Đồng ý",
          cancelButtonText: "Hủy bỏ",
          type: "warning",
          center: true,
        }
      )
        .then(async () => {
          try {
            await this.$store.dispatch("updateReceipt", {
              id: this.formReceipt.id,
              accessories: this.formReceipt.accessories,
              receivedAt: this.formReceipt.receivedAt,
              returnedAt: this.formReceipt.returnedAt,
            });
            await this.$store.dispatch(
              "completeReceiptForm",
              this.formReceipt.id
            );
            Notification({
              title: "Success",
              message: "Đã hoàn thành",
              position: "bottom-right",
              type: "success",
            });
            this.formReceipt.status = "completed";
          } catch (e) {
            Notification({
              title: "Error",
              message: res.message,
              position: "bottom-right",
              type: "error",
            });
          }
        })
        .catch(() => {});
    },
  },
  watch: {
    "$store.state.receiptDetail": function (newVal) {
      this.formReceipt = newVal;
      this.formReimbursement = this.formReceipt.reimbursementForm;
      this.formReceipt.actualReturnedAt = this.formReimbursement && this.formReimbursement.actualReturnedAt || this.formReceipt.returnedAt;
      this.formMaintenance = this.formReceipt.maintenanceForm;
      this.formCustomer = this.formMaintenance.customer.profile;
      this.formWarranty = this.formMaintenance.warrantyForm;
    },
    "formReceipt.status": function (newVal) {
      const currentAction = [];
      if (this.$util.checkPermissionAction(permissionSchemas, "update") && newVal === "new") {
        currentAction.push({
          label: this.$t("el.button.complete"),
          type: "primary",
          icon: "",
          callback: this.complete,
        });
      }
      if (this.$util.checkPermissionAction(permissionSchemas, "export")) {
        currentAction.push({
          label: this.$t("el.button.export"),
          type: "primary",
          icon: "",
          callback: this.exportPDF,
        });
      }
      this.$store.dispatch("setCurrentActions", currentAction);
    },
  },
  destroyed() {
    this.$store.dispatch("setCurrentActions", []);
    this.$store.state.customField = [];
  },
};
</script>
