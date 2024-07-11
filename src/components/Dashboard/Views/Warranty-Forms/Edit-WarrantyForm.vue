<template lang="html">
  <div class="row">
    <div class="col-md-8 col-sm-12 offset-md-2">
      <el-card>
        <div slot="header">
          <h6>{{$t('el.formCardTitle.customerInformation')}}</h6>
        </div>
        <el-form :model="formCustomer" :rules="rulesCustomer" ref="ruleFormCustomer"  label-position="top">
          <el-form-item :label="$t('el.formCard.phone')" prop="phone">
            <el-input disabled v-model="formCustomer.phone" ></el-input>
          </el-form-item>
          <el-form-item :label="$t('el.formCard.fullname')" prop="fullname">
            <el-input disabled v-model="formCustomer.fullname"></el-input>
          </el-form-item>
           <el-form-item :label="$t('el.formCard.email')" prop="email">
            <el-input disabled v-model="formCustomer.email"></el-input>
          </el-form-item>
          <el-form-item :label="$t('el.formCard.address')" prop="address">
            <el-input disabled v-model="form.address"></el-input>
          </el-form-item>
        </el-form>
        <el-form :model="form" label-position="top" :rules="rules" ref="ruleForm">
          <el-form-item :label="$t('el.formCard.breakStatus')" prop="note">
            <el-input :disabled="!['new', 'contacted'].includes(form.status)" type="textarea" :rows="3" v-model="form.note"></el-input>
          </el-form-item>
          <div class="row">
            <div class="col-6">
              <el-form-item :label="$t('el.formCard.receiveType')" prop="reception">
                <el-select :disabled="!['new', 'contacted'].includes(form.status)" style="width: 100%" v-model="form.reception">
                  <el-option v-for="opt in receiveTypeOptions" :key="opt.value" :value="opt.value" :label="opt.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-6">
              <el-form-item :label="$t('el.formCard.sendIn')"  prop="provinceCode">
                <my-select
                  class="full-width"
                  v-model="form.provinceCode"
                  :disabled="!['new', 'contacted'].includes(form.status)"
                  :attribute="{options: provinces, multiple: false, filterable: true}"
                  :placeholder="$t('el.formCard.sendIn')"
                >
                </my-select>
              </el-form-item>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <el-form-item label="Mã vận đơn">
                <el-input :disabled="!['new', 'contacted'].includes(form.status)" v-model="form.shipmentId"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { Message, Input, Button, Form, FormItem, Select, Option, Card } from 'element-ui';
import MySelect from 'src/components/UIComponents/Select';

export default {
  components: {
    ElCard: Card,
    ElForm: Form,
    ElFormItem: FormItem,
    ElInput: Input,
    ElButton: Button,
    ElSelect: Select,
    ElOption: Option,
    MySelect
  },

  data() {
    return {
      rulesCustomer: {
        fullname: [
          { required: true, message: ' ', trigger: 'change' },
        ],
        address: [
          { required: true, message: ' ', trigger: 'change' }
        ],
        email: [
          {required: true, message: ' ', trigger: 'change' }
        ],
        phone: [
          {required: true, message: ' ', trigger: 'change' }
        ],
      },
      rules: {
        note: [
          { required: true, message: ' ', trigger: 'change' },
        ],
        reception: [
          { required: true, message: ' ', trigger: 'change' }
        ],
        provinceCode: [
          {required: true, message: ' ', trigger: 'change' }
        ]
      },
      formCustomer: {
        phone: '',
        fullname: '',
        address: '',
        email: ''
      },
      form: {
        userId: null,
        status: '',
        note: '',
        reception: 'post_office_1',
        province: '',
        provinceCode: '',
        shipmentId: '',
      },
      receiveTypeOptions: [
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
          value: 'immediacy'
        },
        {
          label: 'Gấp',
          value: 'urgent'
        }
      ],
    };
  },
  mounted() {
    this.$store.dispatch('setPageTitle', this.$t('el.sidebar.warrantyForm'));
    this.$store.dispatch('fetchWarrantyFormDetail', this.$route.params.id);
  },
  computed: {
    provinces() {
      return this.$store.getters.provinces.map((c) => {
        return {
          title: c.name,
          value: c.code
        }
      })
    },
  },
  methods: {
    async save() {
      try {
        let valid = await this.$refs['ruleForm'].validate();
        if (valid) {
          await this.$store.dispatch('updateWarrantyForm', {
            reception: this.form.reception,
            provinceCode: this.form.provinceCode,
            province: this.form.province,
            shipmentId: this.form.shipmentId,
            id: this.form.id
          });
          this.form.status = 'confirmed';
          Message({
            message: 'Cập nhật thành công',
            type: 'success',
          });
        }
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
    async contact () {
      try {
        const res = await this.$store.dispatch('contactWarrantyForm', this.form.id);
        this.form.status = 'contacted';
        Message({
          message: 'Đã liên hệ',
          type: 'success',
        });
      } catch (e) {
        if (e) {
          Message({
            message: e.message,
            type: 'error',
          });
        }
      }
    }
  },
  watch: {
    'form.status': function(newVal, oldVal) {
      const currentAction = [];
      if (newVal === 'contacted') {
        currentAction.push({
          label: this.$t('el.button.update'),
          type: 'primary',
          icon: '',
          callback: this.save,
        });
      }
      if (newVal === 'new') {
        currentAction.push({
          label: this.$t('el.button.contact'),
          style: {backgroundColor: 'purple'},
          icon: '',
          callback: this.contact,
        });
        currentAction.push({
          label: this.$t('el.button.update'),
          type: 'primary',
          icon: '',
          callback: this.save,
        });
      }
      this.$store.dispatch('setCurrentActions', currentAction);
    },
    'form.provinceCode': function (newVal, oldVal) {
      if (this.provinces.length) {
        let province = this.provinces.find(p => p.value == newVal);
        if (province) {
          this.form.province = province.title;
        }
      }
    },
    '$store.state.warrantyFormDetail': function (newVal, oldVal) {
      if (newVal) {
        this.form = newVal;
        if (newVal.customer) {
          this.formCustomer = newVal.customer.profile;
        }
      }
    },
  },
  destroyed() {
    this.$store.dispatch('setCurrentActions', []);
    this.$store.state.customField = [];
  },
};
</script>
