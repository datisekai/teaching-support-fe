<template lang="html">
  <div class="row">
    <div class="col-12">
      <el-card>
        <div slot="header">
          <h6>{{ $t("el.formCardTitle.customerInformation") }}</h6>
          <span>Số phiếu: {{ formMaintenance.id }}</span>
        </div>
        <el-form label-position="top">
          <el-form-item :label="$t('el.formCard.phone')">
            <el-input disabled :value="formCustomer.phone"></el-input>
          </el-form-item>
          <el-form-item :label="$t('el.formCard.fullname')">
            <el-input disabled :value="formCustomer.fullname"></el-input>
          </el-form-item>
          <el-form-item :label="$t('el.formCard.address')">
            <el-input disabled :value="formWarranty.address"></el-input>
          </el-form-item>
          <el-form-item :label="$t('el.formCard.repairRequest')">
            <el-input
              disabled
              type="textarea"
              :rows="3"
              :value="formWarranty.note"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card>
        <div slot="header">
          <h6>Sản phẩm đã kích hoạt của khách hàng</h6>
        </div>
        <el-table border :data="formActivatedProducts" class="eye-table">
          <el-table-column minWidth="140px" :label="$t('el.tableHeader.code')">
            <template slot-scope="props">
              <span>{{ props.row.code || "" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            minWidth="200px"
            :label="$t('el.tableHeader.modelBranch')"
          >
            <template slot-scope="props">
              <span>{{ (props.row.model && props.row.model.name) || "" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            minWidth="130px"
            :label="$t('el.tableHeader.expiredDate')"
          >
            <template slot-scope="props">
              <span>{{ $util.formatDate(props.row.expiredDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="times"
            minWidth="100px"
            :label="$t('el.tableHeader.warrantyCount')"
          >
          </el-table-column>
          <el-table-column :label="$t('el.tableHeader.stamp')">
            <template slot-scope="props">
              <el-checkbox v-model="props.row.stamp"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column :label="$t('el.tableHeader.dkbh')">
            <template slot-scope="props">
              <el-checkbox
                :disabled="
                  formMaintenance.status != 'new' && warrantyLinesRemove
                "
                v-model="props.row.isDKBH"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            width="90px"
            fixed="right"
            :label="$t('el.tableHeader.actions')"
          >
            <template slot-scope="props">
              <el-button
                size="mini"
                icon="el-icon-circle-plus-outline"
                type="primary"
                @click="addWarrantyItemDirectly(props.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card>
        <div slot="header">
          <h6>{{ $t("el.formCardTitle.maintenanceForm") }}</h6>
        </div>
        <div
          class="d-flex justify-content-between"
          v-if="formMaintenance.status == 'new'"
        >
          <el-input
            v-model="checkCode"
            :placeholder="$t('el.formCard.inputCode')"
            :disabled="!warrantyLinesRemove"
          ></el-input>
          <el-button
            class="ml-3"
            type="warning"
            :disabled="!checkCode"
            @click="validateWarrantyCode"
            >Kiểm tra</el-button
          >
          <el-button
            class="ml-3"
            type="primary"
            @click="openPopupAddWarrantyItemWithoutCode"
            >Thêm sản phẩm khác</el-button
          >
        </div>
        <hr v-if="formMaintenance.status == 'new'" />
        <el-table border :data="formMaintenanceItemsRows" class="eye-table">
          <el-table-column minWidth="140px" label="Mã bảo hành/ Tên sản phẩm">
            <template slot-scope="props">
              <span v-if="props.row.type == 'without_warranty_code'">
                {{ props.row.name || "-" }}
              </span>
              <span v-else>{{
                (props.row.warrantyCode && props.row.warrantyCode.code) || "-"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column minWidth="220px" label="Nhóm ngành sản phẩm">
            <template slot-scope="props">
              <span>
                {{ props.row.modelName || "-" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column minWidth="220px" label="Dòng sản phẩm">
            <template slot-scope="props">
              <span>
                {{ props.row.productLineName || "-" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            minWidth="130px"
            :label="$t('el.tableHeader.expiredDate')"
          >
            <template slot-scope="props">
              <span v-if="props.row.type == 'without_warranty_code'">
                {{ $util.formatDate(props.row.expiredDate) }}
              </span>
              <span v-else>{{
                $util.formatDate(props.row.warrantyCode.expiredDate)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="times"
            minWidth="100px"
            :label="$t('el.tableHeader.warrantyCount')"
          >
          </el-table-column>
          <el-table-column :label="$t('el.tableHeader.stamp')">
            <template slot-scope="props">
              <el-checkbox
                :disabled="
                  formMaintenance.status != 'new' && warrantyLinesRemove
                "
                @change="updateWarrantyItem(props.row)"
                v-model="props.row.stamp"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column :label="$t('el.tableHeader.dkbh')">
            <template slot-scope="props">
              <el-checkbox
                :disabled="formMaintenance.status != 'new' && warrantyLinesRemove"
                @change="updateWarrantyItem(props.row)"
                v-model="props.row.isDKBH"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            v-if="formMaintenance.status == 'new' && warrantyLinesRemove"
            width="150px"
            fixed="right"
            :label="$t('el.tableHeader.actions')"
          >
            <template slot-scope="props">
              <el-button
                size="mini"
                icon="el-icon-edit"
                type="primary"
                @click="showEditProductNameModal(props.$index, props.row)"
              ></el-button>
              <el-button
                size="mini"
                icon="el-icon-delete"
                type="danger"
                @click="removeWarrantyItem(props.$index, props.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- <span v-if="props.row.type == 'without_warranty_code'">   -->
        <div class="mt-4 mb-3 font-weight-bold" style="color: #444">
          Hình ảnh sản phẩm kích hoạt
        </div>
        <el-table border :data="warrantyItemWithCode">
          <el-table-column width="180" :label="$t('el.tableHeader.code')">
            <template slot-scope="props">
              <span>
                {{
                  (props.row.warrantyCode && props.row.warrantyCode.code) || ""
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column min-width="180" label="Hình ảnh">
            <template slot-scope="props">
              <div class="warranty-image" v-if="props.row.warrantyCode">
                <img
                  style="cursor:pointer; width: 120px; height: 120px; margin-top: 10px; margin-right: 15px; object-fit: contain;"
                  v-for="(img, index) in props.row.warrantyCode.images"
                  :src="img.thumbnail"
                  @click="showPreview(props.row.id, index)"
                  :key="index"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div
        v-for="(item, index) in formMaintenance.warrantyItems"
        :key="item.id"
      >
        <previewer
          v-if="item.warrantyCode"
          :ref="'previewer-' + item.id"
          :list="listImagesPreview(item.warrantyCode.images)"
          :options="options"
        >
        </previewer>
      </div>

      <el-card>
        <div slot="header">
          <h6>Tình trạng ban đầu</h6>
        </div>
        <div class="col-sm-12 p-0">
          <my-table
            :parentActions="parentActions"
            :ignoreActions="ignoreActions"
            ref="table"
            rowKey="id"
            :columnDefs="columnDefs"
            v-bind:data-rows="repairRequestData"
            :actions="formMaintenance.status === 'new' ? actions : []"
            :actionsTable="actionsTable"
          />
        </div>
        <div class="ml-3 font-weight-bold" style="color: #444">
          Chọn ngày hoàn trả dự kiến
        </div>
        <el-date-picker
        class="ml-3 mt-3"
          v-model="workingDate"
          type="date"
          @change="onChangeDatePicker"
          placeholder="Chọn ngày">
        </el-date-picker>
      </el-card>
    </div>

    <el-dialog
      width="400px"
      title="Thêm lỗi"
      :visible.sync="modal.addError"
      @keyup.enter.native="addError"
    >
      <el-form :model="formAddError" data-vv-scope="formAddError">
        <el-form-item>
          <el-select
            disabled
            style="width: 100%"
            v-model="formAddError.warrantyItemId"
            placeholder="Chọn mã/tên máy"
          >
            <el-option
              v-for="item in formMaintenance.warrantyItems"
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
            :placeholder="$t('el.formCard.errorDescription')"
            v-model="formAddError.productErrorId"
            v-validate="'required'"
            :data-vv-as="$t('el.formCard.errorDescription')"
            :class="errors.has('formAddError.warrantyTypeId')?'border-danger':''"
            :attribute="{type: 'product_error', field: 'name', key: 'id', valueKey: 'id', multiple: false, initOptions: defaultProductErrors, extraQuery: extraQuery}"
          >
          </select-ajax>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modal.addError = false">{{
          $t("el.button.cancel")
        }}</el-button>
        <el-button
          type="primary"
          @click="addWarrantyLine"
          >{{ $t("el.button.add") }}</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      width="400px"
      title="Cập nhật lỗi"
      :visible.sync="modal.editError"
      @keyup.enter.native="editError"
    >
      <el-form :model="formEditError" data-vv-scope="formEditError">
        <el-form-item>
          <el-select
            style="width: 100%"
            disabled
            v-model="formEditError.warrantyItemId"
          >
            <el-option
              v-for="item in formMaintenance.warrantyItems"
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
            :placeholder="$t('el.formCard.errorDescription')"
            v-model="formEditError.productErrorId"
            v-validate="'required'"
            :data-vv-as="$t('el.formCard.errorDescription')"
            :class="errors.has('formAddError.warrantyTypeId')?'border-danger':''"
            :attribute="{type: 'product_error', field: 'name', key: 'id', valueKey: 'id', multiple: false, initOptions: defaultProductErrors, extraQuery: extraQuery}"
          >
          </select-ajax>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modal.editError = false">{{
          $t("el.button.cancel")
        }}</el-button>
        <el-button
          type="primary"
          @click="editWarrantyLine"
          :disabled="!formEditError.productErrorId"
          >{{ $t("el.button.edit") }}</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      width="500px"
      :title="$t('el.button.validate')"
      :visible.sync="modal.formValidateVisible"
      @close="handleCloseValidateWarrantyCode"
      @keyup.enter.native="addWarrantyItem"
    >
      <el-form
        :model="formValidateWarrantyCode"
        data-vv-scope="formValidateWarrantyCode"
      >
        <div v-if="formValidateWarrantyCode">
          <el-form-item>
            <p>
              <strong>{{ $t("el.formCard.serial") }}: </strong>
              {{ formValidateWarrantyCode.serial }}
            </p>
            <p>
              <strong>{{ $t("el.formCard.code") }}: </strong>
              {{ formValidateWarrantyCode.code }}
            </p>
            <p>
              <strong>{{ $t("el.formCard.model") }}: </strong>
              {{
                formValidateWarrantyCode.model &&
                  formValidateWarrantyCode.model.name
              }}
            </p>
            <p>
              <strong>{{ $t("el.formCard.status") }}: </strong>
              {{
                formValidateWarrantyCode.isActivated
                  ? "✔ Đã kích hoạt"
                  : "✗ Chưa kích hoạt"
              }}
            </p>
            <div v-if="formValidateWarrantyCode.isActivated">
              <p>
                <strong>{{ $t("el.formCard.customer") }}: </strong>
                {{
                  formValidateWarrantyCode.customer &&
                    formValidateWarrantyCode.customer.fullname
                }}
                -
                {{
                  formValidateWarrantyCode.customer &&
                    formValidateWarrantyCode.customer.phone
                }}
              </p>
              <p>
                <strong>{{ $t("el.formCard.activatedDate") }}: </strong>
                {{
                  $util.formatDateTime(formValidateWarrantyCode.activatedDate)
                }}
              </p>
              <p>
                <strong>{{ $t("el.formCard.expiredDate") }}: </strong>
                {{ $util.formatDateTime(formValidateWarrantyCode.expiredDate) }}
              </p>
            </div>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modal.formValidateVisible = false">{{
          $t("el.button.cancel")
        }}</el-button>
        <el-button
          type="warning"
          @click="addWarrantyItem"
          :disabled="!formValidateWarrantyCode.isActivated"
          >{{ $t("el.button.add") }}</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      width="400px"
      :title="$t('el.dialogTitle.completeMaintenanceForm')"
      :visible.sync="modal.complete"
    >
      <el-form :model="formComplete" data-vv-scope="formComplete">
        <el-form-item>
          <el-select style="width: 100%" v-model="formComplete.volumeId">
            <el-option
              v-for="(option, index) in volumes"
              :key="index"
              :value="option.id"
              :label="`${option.code} - ${option.assignee.fullname}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modal.complete = false">{{
          $t("el.button.cancel")
        }}</el-button>
        <el-button
          type="primary"
          @click="complete"
          :disabled="!formComplete.volumeId"
          >{{ $t("el.button.complete") }}</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="Thêm sản phẩm khác"
      :visible.sync="modal.dialogProductVisible"
      width="600px"
      :before-close="handleCloseAddProduct"
    >
      <div class="col-12 mb-2">
        <label class="required">Tên thiết bị</label>
        <el-input
          type="text"
          placeholder="Nhập tên thiết bị"
          v-model="formAddProductWithoutCode.name"
        ></el-input>
      </div>

      <div class="col-12 mb-2">
        <label class="required">Ngành hàng</label>
        <select-ajax
          key="model"
          data-vv-name="model"
          :placeholder="$t('el.formCard.model')"
          v-model="formAddProductWithoutCode.modelId"
          v-validate="'required'"
          :data-vv-as="$t('el.formCard.model')"
          :class="errors.has('formAddProductWithoutCode.modelId')?'border-danger':''"
          :attribute="{type: 'product_model', field: 'name', key: 'id', valueKey: 'id', multiple: false, initOptions: defaultProductModels, extraQuery: { parentId: -1}}"
        >
        </select-ajax>
      </div>

      <div class="col-12 mb-2">
        <label class="required">Dòng sản phẩm</label>
        <select-ajax
          key="productLine"
          data-vv-name="productLine"
          :placeholder="$t('el.formCard.productLine')"
          v-model="formAddProductWithoutCode.productLineId"
          v-validate="'required'"
          :data-vv-as="$t('el.formCard.productLine')"
          :class="errors.has('formAddProductWithoutCode.productLineId')?'border-danger':''"
          :attribute="{type: 'product_model', field: 'name', key: 'id', valueKey: 'id', multiple: false, initOptions: defaultProductLines, extraQuery: extraQueryLine}"
        >
        </select-ajax>
      </div>

      <div id="expiredDate-picker" class="col-12 mb-2">
        <label class="required">Ngày hết hạn bảo hành</label>
        <el-date-picker
          v-model="formAddProductWithoutCode.expiredDate"
          type="date"
          placeholder="Ngày hết hạn bảo hành"
        >
        </el-date-picker>
      </div>

      <div class="col-12 mb-2">
        <label class="required">Số lần bảo hành</label>
        <el-input
          type="number"
          v-model="formAddProductWithoutCode.times"
        ></el-input>
      </div>

      <div class="col-12 mb-2">
        <el-checkbox v-model="formAddProductWithoutCode.stamp">Tem</el-checkbox>
      </div>

      <div class="col-12 mb-2">
        <el-checkbox v-model="formAddProductWithoutCode.isDKBH"
          >Điều kiện bảo hành</el-checkbox
        >
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="modal.dialogProductVisible = false">Hủy</el-button>
        <el-button type="primary" @click="addWarrantyProductWithoutCode"
          >Thêm</el-button
        >
      </span>
    </el-dialog>
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
        <el-button type="primary" @click="updateProductName">{{$t('el.button.update')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  Image,
  MessageBox,
  Notification,
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
import vuePicturePreview from "vue-picture-preview";
import permissionSchemas from "./permission-schemas";

import dtHelper from "src/helpers/datatable";
import maintainanceFoldableFormSchemas from "./maintainance-foldable-form";
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
    ElImage: Image,
    SelectAjax: SelectAjax,
    Previewer: vuePicturePreview,
    ElDatePicker: DatePicker
  },

  data() {
    const initFiledArrays = ["id", "item_code", "method", "error"];
    const columnDefs = dtHelper.buildInitFields(
      maintainanceFoldableFormSchemas,
      initFiledArrays
    );
    const tableActions = [];
    if (this.$util.checkPermissionAction(permissionSchemas, "edit")) {
      tableActions.push({
        type: "primary",
        icon: "nc-icon nc-ruler-pencil",
        title: "edit",
        callback: this.popupWarrantyLine
      });
    }
    if (this.$util.checkPermissionAction(permissionSchemas, "delete")) {
      tableActions.push({
        type: "danger",
        icon: "nc-icon nc-simple-remove",
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
      checkCode: "",
      columnDefs,
      workingDate: null,
      formCustomer: {},
      url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      formMaintenance: {
        warrantyItems: [],
        warrantyLines: []
      },
      formEditProductName: {
        id: null,
        productLineId: null,
      },
      formActivatedProducts: [],
      newLines: [],
      warrantyLinesRemove: false,
      formWarranty: {},
      formAddError: {
        warrantyItemId: "",
        id: null,
        productErrorId: null,
        price: 1
      },
      formEditError: {
        warrantyItemId: "",
        productErrorId: null,
        note: "",
        price: 1
      },
      formDeleteError: {
        id: "",
        warrantyLineId: ""
      },
      formComplete: {
        volumeId: null
      },
      receiveTypeOptions: [
        {
          label: "Bưu điện",
          value: "post_office"
        }
      ],
      sendInOptions: [
        {
          label: "Hồ Chí Minh",
          value: "Hồ Chí Minh"
        }
      ],
      formValidateWarrantyCode: {},
      modal: {
        complete: false,
        addError: false,
        editError: false,
        formValidateVisible: false,
        dialogProductVisible: false,
        editProductName: false
      },
      defaultProductErrors: [],
      defaultCategory: [],
      options: {},
      formAddProduct: {
        warrantyCode: {
          code: "",
          model: {
            name: ""
          },
          expiredDate: "",
          isExpired: null
        },
        times: null,
        stamp: null
      },
      defaultProductModels: [],
      defaultProductLines: [],
      formAddProductWithoutCode: {
        name: "",
        modelId: "",
        productLineId: "",
        expiredDate: "",
        times: 0,
        stamp: true,
        isDKBH: false
      },
      extraQuery: {},
      extraQueryLine: {},
      extraQueryModel: {},
    };
  },
  async created() {
    this.$store.dispatch("fetchModels");
    this.$store.dispatch("fetchProductErrors");
    this.$store.dispatch("fetchProductAccessories");
    this.$store.dispatch("fetchMaintenanceFormDetail", this.$route.params.id);
  },
  mounted() {
    this.$store.dispatch("setPageTitle", this.$t("el.sidebar.maintenanceForm"));
    if (this.$util.checkPermissionAction(permissionSchemas, "update")) {
      this.warrantyLinesRemove = true;
    }
  },
  computed: {
    repairRequestData() {
      return this.formMaintenance.warrantyItems.map(item => {
        const productLine = this.productLines.find(i => i.id === item.productLineId);
        item.item_code = (productLine ? productLine.name + ' - ' : '') + (item.warrantyCode && item.warrantyCode.code || item.name);
        item.children = (item.warrantyLines || []).map(line => {
          const productError = this.productErrors.find(i => i.id === line.productErrorId);
          line.productError = (productError && productError.name) || "-";
          return line;
        });
        return item;
      });
    },
    models() {
      return this.$store.state.models;
    },
    productLines() {
      return this.models.reduce((c, i) => c.concat(i.children), []);
    },
    parentError() {
      return this.$store.state.productErrors.find(i => i.type === 'error');
    },
    productErrors() {
      if (!this.parentError) return [];
      return this.parentError.children;
    },
    warrantyItemWithCode() {
      return this.formMaintenance.warrantyItems.filter(item => item.type === "warranty_code");
    },
    formMaintenanceItemsRows() {
      this.formMaintenance.warrantyItems = this.formMaintenance.warrantyItems.map(item => {
        const foundModel = this.models.find(m => m.id === item.modelId);
        item.modelName = foundModel && foundModel.name;
        const foundLine = this.productLines.find(line => line.id === item.productLineId);
        item.productLineName = foundLine && foundLine.name;
        return item;
      });
      return this.formMaintenance.warrantyItems;
    },
    models() {
      return this.$store.state.models;
    },
    productLines() {
      return this.models.reduce((cur, i) => cur.concat(i.children), []);
    },
    selectedModelChildren() {
      const modelId = this.formAddProductWithoutCode.modelId;
      if (!modelId) return [];
      return this.models.find(m => m.id === modelId).children;
    },
    warrantyCodeImages() {
      if (!this.formMaintenance.warrantyItems.length) return [];
      return this.formMaintenance.warrantyItems
        .map(w => w.warrantyCode.images)
        .reduce((a, b) => a.concat(b));
    },
    volumes() {
      return this.$store.state.volumes;
    }
  },
  methods: {
    openPopupAddWarrantyItemWithoutCode() {
      this.defaultProductModels = this.models;
      this.defaultProductLines = [];
      this.modal.dialogProductVisible = true;
    },
    ignoreActions(row) {
      return row.children;
    },
    onChangeDatePicker() {
      const now = new Date();
      const date = new Date(this.workingDate);
      const dates = this.getDates(now, date);
      this.updateMaintenanceForm(dates);
    },
    getDates(startDate, endDate) {
      const oneDay = 24 * 60 * 60 * 1000;
      return Math.ceil(Math.abs((startDate - endDate) / oneDay));
    },
    showEditProductNameModal(index, row) {
      const productLines = this.productLines.filter((c) => c.parentId == row.modelId) || [];
      this.extraQuery = { parentId: row.modelId };
      this.defaultProductLines = productLines;
      this.formEditProductName.id = row.id;
      this.formEditProductName.productLineId = row.productLineId;
      this.modal.editProductName = true;
    },
    async updateProductName() {
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
              w.productLine = this.productLines.find((l) => l.id === w.productLineId);
              w.productLineName = w.productLine && w.productLine.name;
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
    async addWarrantyProductWithoutCode() {
      this.formAddProductWithoutCode.times = +this.formAddProductWithoutCode.times;
      this.formAddProductWithoutCode.isDKBH = this.formAddProductWithoutCode.isDKBH;
      this.formAddProductWithoutCode = Object.assign({ formId: this.formMaintenance.id }, this.formAddProductWithoutCode);
      try {
        let resp = await this.$store.dispatch(
          "addWarrantyProductWithoutCode",
          this.formAddProductWithoutCode
        );
        if (resp) {
          this.formAddProductWithoutCode = {
            name: "",
            modelId: "",
            expiredDate: "",
            times: 0,
            stamp: true,
            isDKBH: false
          }
          this.modal.dialogProductVisible = false;
          this.$store.dispatch("fetchMaintenanceFormDetail", this.$route.params.id);
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
    listImagesPreview(images) {
      if (images) {
        return images.map(v => ({
            msrc: v.small,
            src: v.origin
          }));
      }
      return [];
    },
    handleCloseAddProduct() {
      this.modal.dialogProductVisible = false;
    },
    showModalAddError(index, value) {
      this.formAddError = {
        warrantyItemId: value.id,
        item_code: "",
        id: null,
        productErrorId: null
      };
      this.extraQuery = { parentId: this.parentError.id};
      this.defaultProductErrors = this.productErrors;
      this.modal.addError = true;
    },
    showModalComplete() {
      this.formComplete = {
        volumeId: null
      };
      this.modal.complete = true;
    },
    handleCloseValidateWarrantyCode() {
      this.formValidateWarrantyCode = {};
      this.modal.formValidateVisible = false;
    },
    showPreview(id, index) {
      this.$refs["previewer-" + id][0].show(index);
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
        this.formMaintenance.warrantyItems = this.formMaintenance.warrantyItems.map(i => {
          if (i.id === res.warrantyItemId) {
            i.warrantyLines.push(res);
          }
          return i;
        });
        this.$store.dispatch("fetchMaintenanceFormDetail", this.$route.params.id);
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
    popupWarrantyLine(index, row) {
      this.extraQuery = { parentId: this.parentError.id};
      this.defaultProductErrors = this.productErrors;
      this.formEditError.warrantyItemId = row.warrantyItemId;
      this.formEditError.productErrorId = row.productErrorId;
      this.formEditError.id = row.id;
      this.modal.editError = true;
    },
    async editWarrantyLine() {
      try {
        let res = await this.$store.dispatch("updateWarrantyLine", this.formEditError);
        Notification({
          title: "Success",
          message: "Cập nhật thành công",
          position: "bottom-right",
          type: "success"
        });
        this.formMaintenance.warrantyItems = this.formMaintenance.warrantyItems.map(item => {
          if (item.id === res.warrantyItemId) {
            item.warrantyLines = item.warrantyLines.map(line => {
              if (line.id === res.id) {
                line = res;
              }
              return line;
            });
          }
          return item;
        });
        this.$store.dispatch("fetchMaintenanceFormDetail", this.$route.params.id);
        this.modal.editError = false;
      } catch (e) {
        Notification({
          title: "Error",
          message: e.message,
          position: "bottom-right",
          type: "error"
        });
      }
    },
    async removeWarrantyLine(index, row) {
      this.formDeleteError.id = this.formMaintenance.id;
      this.formDeleteError.warrantyLineId = row.id;
      try {
        let res = await this.$store.dispatch("removeWarrantyLine", this.formDeleteError);
        if (res) {
          Notification({
            title: "Success",
            message: "Xóa lỗi thành công",
            position: "bottom-right",
            type: "success"
          });
          this.formMaintenance.warrantyItems = this.formMaintenance.warrantyItems.map(item => {
            if (item.id === res.warrantyItemId) {
              const index = item.warrantyLines.findIndex(l => l.id === res.id);
              item.warrantyLines.splice(index, 1);
            }
            return item;
          });
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
    async addWarrantyItemDirectly(id) {
      try {
        let res = await this.$store.dispatch("addWarrantyItem", {
          id: this.formMaintenance.id,
          warrantyCodeId: id
        });
        res.warrantyLines = [];
        this.formMaintenance.warrantyItems.push(res);
        Notification({
          title: "Success",
          message: "Thêm kết quả kiểm tra thành công!",
          position: "bottom-right",
          type: "success"
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
    async addWarrantyItem() {
      try {
        let res = await this.$store.dispatch("addWarrantyItem", {
          id: this.formMaintenance.id,
          warrantyCodeId: this.formValidateWarrantyCode.id
        });
        this.formMaintenance.warrantyItems.push(res);
        this.modal.formValidateVisible = false;
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
    async removeWarrantyItem(index, row) {
      MessageBox.confirm("Xóa mã bảo hành này ?", "Warning", {
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy bỏ",
        type: "warning",
        center: true
      })
        .then(async () => {
          try {
            await this.$store.dispatch("removeWarrantyItem", {
              id: this.formMaintenance.id,
              warrantyCodeId: row.id
            });
            this.formMaintenance.warrantyItems.splice(index, 1);
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
    async validateWarrantyCode() {
      try {
        this.formValidateWarrantyCode = await this.$store.dispatch(
          "validateWarrantyCode",
          this.checkCode
        );
        this.modal.formValidateVisible = true;
      } catch (e) {
        Notification({
          title: "Error",
          message: e.message,
          position: "bottom-right",
          type: "error"
        });
      }
    },
    async complete() {
      MessageBox.confirm(
        "Bạn có chắc chắn hoàn thành phiếu kiểm tra không?",
        "Warning",
        {
          confirmButtonText: "Đồng ý",
          cancelButtonText: "Hủy bỏ",
          type: "warning",
          center: true
        }
      )
        .then(() => {
          const data = {
            id: this.formMaintenance.id,
            volumeId: this.formComplete.volumeId
          };
          this.$store
            .dispatch("completeMaintenanceForm", data)
            .then(res => {
              Notification({
                title: "Success",
                message: "Đã hoàn thành",
                position: "bottom-right",
                type: "success"
              });
              this.formMaintenance.status = "completed";
              this.modal.complete = false;
            })
            .catch(e => {
              Notification({
                title: "Error",
                message: e.message,
                position: "bottom-right",
                type: "error"
              });
            });
        })
        .catch(() => {});
    },
    async updateMaintenanceForm(working_date) {
      try {
        await this.$store.dispatch("updateMaintenanceForm", {
          id: this.formMaintenance.id,
          working_date,
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
    async createReceipt() {
      MessageBox.confirm("Tạo biên nhận ?", "Warning", {
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$store
            .dispatch("storeReceipt", {
              maintenanceFormId: this.formMaintenance.id
            })
            .then(res => {
              Notification({
                title: "Success",
                message: "Tạo biên nhận thành công",
                position: "bottom-right",
                type: "success"
              });
              this.$router.push("/receipt-form/" + res.id);
            })
            .catch(e => {
              Notification({
                title: "Error",
                message: e,
                position: "bottom-right",
                type: "error"
              });
            });
        })
        .catch(() => {});
    }
  },
  watch: {
    "formAddProductWithoutCode.modelId": function() {
      this.formAddProductWithoutCode.productLineId = "";
      this.extraQueryLine = { parentId: this.formAddProductWithoutCode.modelId};
      this.defaultProductLines = this.productLines.filter(i => i.parentId === this.formAddProductWithoutCode.modelId);
    },
    "$store.state.maintenanceFormDetail": function(newVal) {
      this.formMaintenance = newVal;
      this.formCustomer = this.formMaintenance.customer.profile;
      this.formWarranty = this.formMaintenance.warrantyForm;
      this.workingDate = new Date();
      this.workingDate.setDate(this.workingDate.getDate() + this.formMaintenance.working_date);
      this.$store.dispatch("fetchActivatedProducts", {
        userId: this.formMaintenance.userId
      });
    },
    "$store.state.activatedProducts": function(nVal) {
      this.formActivatedProducts = nVal;
    },
    "formMaintenance.status": function(newVal) {
      const currentAction = [];
      if (newVal == "completed") {
        if (this.$util.checkPermissionAction(permissionSchemas, "create_recept")) {
          currentAction.push({
            label: this.$t("el.button.receipt"),
            type: "primary",
            icon: "",
            callback: this.createReceipt
          });
        }
      } else if (newVal == "new") {
        this.$store.dispatch("fetchVolumes", { type: "notebook" });
        if (this.$util.checkPermissionAction(permissionSchemas, "update")) {
          currentAction.push({
            label: this.$t("el.button.complete"),
            type: "primary",
            icon: "",
            callback: this.showModalComplete
          });
        }
      }
      this.$store.dispatch("setCurrentActions", currentAction);
    }
  },
  destroyed() {
    this.$store.dispatch("setCurrentActions", []);
  }
};
</script>
<style lang="scss" scoped>
.image-wrapper {
  display: flex;
  flex-wrap: wrap;
  img {
    width: 120px;
    height: 120px;
    margin-right: 15px;
    margin-top: 15px;
    object-fit: contain;
    object-position: center center;
  }
}
#expiredDate-picker .el-date-editor {
  display: block;
  width: 100%;
}
</style>
