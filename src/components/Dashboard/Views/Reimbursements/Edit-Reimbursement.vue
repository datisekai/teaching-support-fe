<template lang="html">
  <div class="row">
    <div class="col-12">
      <el-card>
        <div slot="header">
          <h6 >{{$t('el.formCardTitle.reimbursementInformation')}}</h6>
          <div class="text-right font-weight-bold">
            {{$t('el.tableHeader.receiptNo')}}: {{formReceipt.receiptNo}} - {{$t('el.tableHeader.book')}}: {{formReceipt.notebook}}
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
              <span>{{(props.row.warrantyCode && props.row.warrantyCode.code) || props.row.name || ''}}</span>
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
        <div class="mt-4 mb-4" style="color: #444">TỔNG CỘNG {{formMaintenance.warrantyItems.length}} THIẾT BỊ</div>
        <el-form :model="formReceipt" label-position="top" :rules="rules">
          <el-form-item :label="$t('el.formCard.accessories')">
            <el-input v-model="formReceipt.accessories" disabled></el-input>
          </el-form-item>
          <div class="row">
            <div class="col-6">
              <el-form-item :label="$t('el.formCard.receiveDate')">
                <el-input disabled :value="$util.formatDateTime(formReceipt.receivedAt)"></el-input>
              </el-form-item>
            </div>
            <div class="col-6">
              <el-form-item :label="$t('el.formCard.returnDate')">
                <el-input disabled :value="$util.formatDateTime(formReceipt.returnedAt)"></el-input>
              </el-form-item>
            </div>
            <div class="col-6">
              <el-form-item :label="$t('el.formCard.actualReturnDate')" prop="actualReturnedAt">
                <el-date-picker format="HH:mm dd/MM/yyyy" :disabled="formReimbursement.status == 'completed'" v-model="formReimbursement.actualReturnedAt" type="datetime" placeholder="Chọn thời gian" :style="{width: '100%'}"></el-date-picker>
              </el-form-item>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <el-form-item :label="$t('el.formCard.warrantyAdmin')">
                <el-input disabled :value="admin"></el-input>
              </el-form-item>
            </div>
            <div class="col-6">
              <el-form-item :label="$t('el.formCard.technicalStaff')">
                <el-input disabled :value="assignee"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <el-form :model="formReimbursement" :rules="rules" ref="ruleForm" label-position="left" class="mt-4">
          <div class="row">
            <div class="col-6">
              <el-form-item :label="$t('el.formCard.reimbursementType')" prop="reception">
                <el-select style="width: 200px" :disabled="formReimbursement.status == 'completed'" v-model="formReimbursement.reception">
                  <el-option v-for="opt in reimbursementTypeOptions" :key="opt.value" :value="opt.value" :label="opt.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-6">
              <el-form-item :label="$t('el.formCard.shipmentId')" prop="shipmentId">
                <el-input :disabled="formReimbursement.status == 'completed'" style="width: 200px" v-model="formReimbursement.shipmentId"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </el-card>
      <el-card v-if="formReceipt.status === 'commented'">
         <div slot="header">
          <h6 >{{$t('el.formCardTitle.review')}}</h6>
        </div>
        <div style="color: #2c2c2c">
          <div>Nhận xét: {{formReceipt.isGood ? 'Tốt' : 'Không tốt'}}</div>
          <div>Đánh giá: {{formReceipt.note}}</div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {MessageBox, Notification, Message, Input, Button, Form, FormItem, Select, Option, Card, Table, TableColumn, Checkbox, RadioGroup, Radio, Dialog, DatePicker} from 'element-ui';
import SelectAjax from 'src/components/UIComponents/SelectAjax';
import permissionSchemas from './permission-schemas';


const _form = {}; const _custom_field = {}; let firstGroups; let secondGroups;

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
      formReimbursement: {},
      formQuotation: {},
      formMaintenance: {
        warrantyItems: []
      },
      formWarranty: {},
      formCustomer: {},
      formReceipt: {
      },
      reimbursementTypeOptions: [
        {
          label: 'VNPost',
          value: 'post_office_1'
        },
        {
          label: 'Nhất Tín',
          value: 'post_office_2'
        },
        {
          label: '247 Express',
          value: 'post_office_3'
        },
        {
          label: 'Viettel',
          value: 'post_office_4'
        },
        {
          label: 'Bưu điện khác',
          value: 'post_office_5'
        },
        {
          label: 'Trực tiếp',
          value: 'direct'
        }
      ],
      rules: {
        reception: [
          { required: true, message: ' ', trigger: 'blur'},
        ],
        shipmentId: [
          { required: true, message: ' ', trigger: 'blur'}
        ],
        actualReturnedAt: [
          { required: true, message: ' ', trigger: 'blur'}
        ],
      },
    };
  },
  mounted() {
    this.$store.dispatch('fetchModels');
    this.$store.dispatch('setPageTitle', this.$t('el.sidebar.reimbursement'));
    this.$store.dispatch('fetchReimbursementDetail', this.$route.params.id);
  },
  computed: {
    warrantyItems() {
      return this.formMaintenance.warrantyItems.map(item => {
        item.model = this.models.find(i => i.id === item.modelId);
        item.productLine = this.productLines.find(l => l.id === item.productLineId);
        return item;
      });
    },
    models() {
      return this.$store.state.models;
    },
    productLines() {
      return this.models.reduce((c, i) => c.concat(i.children), []);
    },
    admin() {
      const admin = this.$store.state.users.find(u => u.id === this.formReceipt.adminId);
      if (admin) {
        return admin.fullname;
      }
      return '-';
    },
    assignee() {
      const assignee = this.$store.state.users.find(u => u.id === this.formReceipt.assigneeId);
      if (assignee) {
        return assignee.fullname;
      }
      return '-';
    }
  },
  methods: {
    async export() {
      const { data: publicUrl } = await this.$store.dispatch('exportReimbursement', this.formReimbursement.id);
      const filename = publicUrl.split('/').pop();
      this.$util.downloadURI(publicUrl);
    },
    findUser(id) {
      let user = this.$store.state.users.find(u => u.id == id);
      if (user) return user.fullname;
      return '-'
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 2) {
          sums[index] = this.$t('el.tableHeader.totalPrice') + ':';
          return;
        }
        if (index != 3) return;
        sums[index] = this.$util.formatNumber(this.formReimbursement.total || 0);
      })
      return sums;
    },
    async complete() {
      try {
        let valid = await this.$refs['ruleForm'].validate();
        MessageBox.confirm('Bạn có chắc chắn hoàn thành hoàn trả không?', 'Warning', {
          confirmButtonText: 'Đồng ý',
          cancelButtonText: 'Hủy bỏ',
          type: 'warning',
          center: true,
        }).then(async () => {
          try {
            await this.$store.dispatch('updateReimbursement', {
              id: this.formReimbursement.id,
              reception: this.formReimbursement.reception,
              shipmentId: this.formReimbursement.shipmentId,
              actualReturnedAt: this.formReimbursement.actualReturnedAt,
            });
            await this.$store.dispatch('completeReimbursement', this.formReimbursement.id);
            Notification ({
              title: 'Success',
              message: 'Đã hoàn thành',
              position: 'bottom-right',
              type: 'success',
            });
            this.formReimbursement.status = 'completed';
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
      }
      catch(e) {
        if (e) {
          Message({
            message: e.message,
            type: 'error',
          });
        }
      }     
    },
  },
  watch: {
    '$store.state.reimbursementDetail': function(newVal) {
      this.formReimbursement = newVal
      this.formMaintenance = this.formReimbursement.maintenanceForm;
      this.formWarranty = this.formMaintenance.warrantyForm;
      this.formCustomer = this.formMaintenance.customer.profile;
      this.formReceipt = this.formReimbursement.receiptForm;
    },
    'formReimbursement.status': function(newVal) {
      const currentAction = [];
      if (newVal == 'completed') {
        if (this.$util.checkPermissionAction(permissionSchemas, 'export')) {
          currentAction.push({
              label: this.$t('el.button.export'),
              type: 'secondary',
              icon: '',
              callback: this.export,
            })
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
        }
        if (this.$util.checkPermissionAction(permissionSchemas, 'export')) {
          currentAction.push({
              label: this.$t('el.button.export'),
              type: 'secondary',
              icon: '',
              callback: this.export,
            })
        }
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
