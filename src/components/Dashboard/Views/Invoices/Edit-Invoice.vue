<template lang="html">
  <div class="row">
    <div class="col-12">
      <el-card>
        <div slot="header">
          <h6 >{{$t('el.formCardTitle.invoiceInformation')}}</h6>
          <div class="text-right font-weight-bold">
            <div>
              {{$t('el.tableHeader.formNo')}}: {{formInvoice.invoiceNo}} - {{$t('el.tableHeader.book')}}: {{formInvoice.notebook}}
            </div>
            <div>
              {{$t('el.tableHeader.receiptNo')}}: {{formReceipt.receiptNo}} - {{$t('el.tableHeader.receiptDate')}}: {{$util.formatDate(formReceipt.createdAt)}}
            </div>
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
        <div class="mt-4 mb-3 font-weight-bold" style="color: #444">Danh sách máy bảo hành</div>
        <el-table border :data="warrantyItems" class="eye-table">
          <el-table-column
            minWidth="80px"
            :label="$t('el.tableHeader.#')">
             <template slot-scope="props">
              <span>{{props.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column
            minWidth="140px"
            label="Mã bảo hành/ Tên sản phẩm">
             <template slot-scope="props">
              <span>{{(props.row.warrantyCode && props.row.warrantyCode.code) || props.row.name || '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            minWidth="200px"
            label="Nhóm ngành sản phẩm">
            <template slot-scope="props">
              <span>{{(props.row.model && props.row.model.name) || '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            minWidth="200px"
            label="Dòng sản phẩm">
            <template slot-scope="props">
              <span>{{(props.row.productLine && props.row.productLine.name) || '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('el.tableHeader.stamp')">
            <template slot-scope="props">
              <el-checkbox disabled v-model="props.row.stamp"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('el.tableHeader.dkbh')">
            <template slot-scope="props">
              <el-checkbox disabled v-model="props.row.isDKBH"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            prop="times"
            minWidth="100px"
            :label="$t('el.tableHeader.warrantyCount')">
          </el-table-column>
        </el-table>
        <div class="mt-4 mb-3 font-weight-bold" style="color: #444">Danh sách sửa chữa - thay thế</div>
        <my-table
          ref="table"
          rowKey="id"
          :columnDefs="columnDefs"
          v-bind:data-rows="tableData"
          :summary="summary"
        />
        <el-form class="mt-3">
          <div class="row">
            <div class="col-6">
              <el-form-item :label="$t('el.formCard.warrantyTime')">
                <el-input :disabled="formInvoice.status != 'new'" v-model="formInvoice.note"></el-input>
              </el-form-item>
            </div>
            <div class="col-6">
              <el-form-item :label="$t('el.formCard.warrantyAdmin')">
                <el-input disabled :value="findUser(formInvoice.adminId)"></el-input>
              </el-form-item>
            </div>
            <div class="col-6">
              <el-form-item :label="$t('Phân loại thanh toán')">
                <el-select style="width: 100%" placeholder="Nhập nhóm sản phẩm" v-model="formInvoice.type" :disabled="formInvoice.status != 'new'">
                  <el-option v-for="type in paymentTypes" :key="type.value" :label="type.label" :value="type.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
        </el-form>
        
      </el-card>
    </div>
  </div>
</template>

<script>
import {MessageBox, Notification, Message, Input, Button, Form, FormItem, Select, Option, Card, Table, TableColumn, Checkbox, RadioGroup, Radio, Dialog } from 'element-ui';
import SelectAjax from 'src/components/UIComponents/SelectAjax';
import permissionSchemas from './permission-schemas';
import dtHelper from 'src/helpers/datatable';
import invoiceFoldableForm from './invoice-foldable-form';
import MyTable from 'src/components/UIComponents/Table.vue';

const initFiledArrays = ['item_code', 'method', 'content', 'price', 'note'];
const columnDefs = dtHelper.buildInitFields(invoiceFoldableForm, initFiledArrays);

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
    SelectAjax: SelectAjax,
    MyTable,
  },

  data() {
    return {
      summary: {},
      columnDefs,
      formInvoice: {},
      formQuotation: {},
      formMaintenance: {
        warrantyItems: []
      },
      formWarranty: {},
      formCustomer: {},
      formReceipt: {},
      paymentTypes: []
    };
  },
  async mounted() {
    this.$store.dispatch('fetchMeta');
    this.$store.dispatch('fetchModels');
    this.$store.dispatch('fetchProductErrors');
    this.$store.dispatch('fetchProductAccessories');
    this.$store.dispatch('setPageTitle', this.$t('el.sidebar.invoice'));
    this.$store.dispatch('setCurrentActions', []);
    this.$store.dispatch('fetchInvoiceDetail', this.$route.params.id);
    this.paymentTypes = await this.$store.dispatch('fetchMetaByKey', '__invoice_payment_types')
  },
  computed: {
    tableData() {
      const tableRows = this.warrantyItems.map(item => {
        const productLine = this.productLines.find(i => i.id === item.productLineId);
        item.item_code = (productLine ? productLine.name + ' - ' : '') + (item.warrantyCode && item.warrantyCode.code || item.name);
        item.children = item.warrantyLines.map(line => {
          const error = this.detailErrors('TINH_TRANG_TIEP_NHAN').find(i => i.id === line.productErrorId);
          const resultError = this.detailErrors('KET_QUA').find(i => i.id === line.productResultErrorId);
          const suggestionError = this.detailErrors('DE_NGHI_SUA_CHUA').find(i => i.id === line.productSuggestionErrorId);
          const accessory = this.detailAccessories.find(i => i.id === line.productAccessoryId);
          line.productError = error && error.name || '-';
          line.productResultError = resultError && resultError.name || '-';
          line.productSuggestionError = suggestionError && suggestionError.name || '-';
          line.productAccessory = accessory && accessory.name || '-';
          line.formattedMoney = this.$util.formatMoney(line.price);
          return line;
        })
        return item;
      })
      return tableRows;
    },
    meta() {
      return this.$store.state.meta;
    },
    models() {
      return this.$store.state.models;
    },
    productLines() {
      return this.models.reduce((c, i) => c.concat(i.children), []);
    },
    detailAccessories() {
      return this.$store.state.productAccessories.reduce((cur, i) => cur.concat(i.children), []);
    },
    warrantyItems() {
      return this.formMaintenance.warrantyItems.map(item => {
        item.model = this.models.find(i => i.id === item.modelId);
        item.productLine = this.productLines.find(l => l.id === item.productLineId);
        return item;
      });
    }
  },
  methods: {
    async createReimbursement() {
      MessageBox.confirm('Bạn có chắc chắn muốn hoàn trả?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(async () => {
        try {
          const res = await this.$store.dispatch('storeReimbursement', { quotationFormId: this.formInvoice.quotationFormId})
          Notification ({
            title: 'Success',
            message: 'Đã tạo hoàn trả',
            position: 'bottom-right',
            type: 'success',
          });
          this.$router.push('/reimbursement/'+res.id);
        }
        catch(e) {
          Notification ({
            title: 'Error',
            message: e.message,
            position: 'bottom-right',
            type: 'error',
          });
        }
      }).catch(() => {

      });
    },
    detailErrors(metaKey) {
      const row = this.meta.find(i => i.metaKey === metaKey);
      if (!row) return [];
      const parent = this.$store.state.productErrors.find(i => i.id === row.metaValue);
      return parent && parent.children || [];
    },
    findUser(id) {
      let user = this.$store.state.users.find(u => u.id == id);
      if (user) return user.fullname;
      return '-'
    },
    async exportInvoice() {
      let resp = await this.$store.dispatch('exportInvoiceForm', this.formInvoice.id);
      window.open(resp, '_blank');
    },
    async complete() {
      MessageBox.confirm('Bạn có chắc chắn hoàn thành phiếu thu không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(async () => {
        try {
          await this.$store.dispatch('updateInvoice', {id: this.formInvoice.id, note: this.formInvoice.note || '', type: this.formInvoice.type})
          await this.$store.dispatch('completeInvoice', this.formInvoice.id)
          Notification ({
            title: 'Success',
            message: 'Đã hoàn thành',
            position: 'bottom-right',
            type: 'success',
          });
          this.formInvoice.status = 'completed';
        }
        catch(e) {
          Notification ({
            title: 'Error',
            message: e.message,
            position: 'bottom-right',
            type: 'error',
          });
        }
      }).catch(() => {
       
      });
    },
  },
  watch: {
    '$store.state.invoiceDetail': async function(newVal) {
      this.formInvoice = newVal;
      this.formMaintenance = this.formInvoice.maintenanceForm;
      await this.$store.dispatch('fetchQuotationDetail', this.formInvoice.quotationFormId);
      this.formQuotation = this.$store.state.quotationDetail;
      this.formWarranty = this.formMaintenance.warrantyForm;
      this.formCustomer = this.formMaintenance.customer.profile;
      this.formReceipt = this.formInvoice.receiptForm;
      this.summary = {
        isSummary: true,
        total: this.formInvoice.total,
        index: 5,
      }
    },
    'formInvoice.status': function(newVal) {
      const currentAction = [];
      if (newVal == 'completed') {
        if (this.$util.checkPermissionAction(permissionSchemas, 'export')) {
          currentAction.push({
            label: this.$t('el.button.export'),
            type: 'primary',
            icon: '',
            callback: this.exportInvoice,
          })
        }
        if (this.$util.checkPermissionAction(permissionSchemas, 'create_reimbursement')) {
          currentAction.push({
            label: this.$t('el.button.reimbursement'),
            type: 'primary',
            icon: '',
            callback: () => {
              if (this.formQuotation.reimbursementForm) {
                this.$router.push('/reimbursement/'+this.formQuotation.reimbursementForm.id)
              }
              else {
                this.createReimbursement();
              }
            }
          });
        }
      }
      else {
        if(this.$util.checkPermissionAction(permissionSchemas, 'update')){
            currentAction.push({
              label: this.$t('el.button.complete'),
              type: 'primary',
              icon: '',
              callback: this.complete,
            });
        };
      }
      this.$store.dispatch('setCurrentActions', currentAction);
    },
  },
  destroyed() {
    this.$store.dispatch('setCurrentActions', []);
    this.$store.state.customField = [];
  },
};
</script>
