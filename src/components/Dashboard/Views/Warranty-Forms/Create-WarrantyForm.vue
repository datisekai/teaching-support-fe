<template lang="html">
  <div class="row">
    <div class="col-md-8 col-sm-12 offset-md-2">
      <el-card>
        <div slot="header">
          <h6>{{$t('el.formCardTitle.customerInformation')}}</h6>
        </div>
        <el-form :model="formCustomer" :rules="rulesCustomer" ref="ruleFormCustomer"  label-position="top">
          <el-form-item :label="$t('el.formCard.phone')" prop="phone">
            <el-input v-model="formCustomer.phone" ></el-input>
          </el-form-item>
          <el-form-item :label="$t('el.formCard.fullname')" prop="fullname">
            <el-input v-model="formCustomer.fullname"></el-input>
          </el-form-item>
           <el-form-item :label="$t('el.formCard.email')" prop="email">
            <el-input v-model="formCustomer.email"></el-input>
          </el-form-item>
          <el-form-item :label="$t('el.formCard.address')" prop="address">
            <el-input v-model="formCustomer.address"></el-input>
          </el-form-item>
        </el-form>
        <el-form :model="form" label-position="top" :rules="rules" ref="ruleForm">
          <el-form-item :label="$t('el.formCard.breakStatus')" prop="note">
            <el-input type="textarea" :rows="3" v-model="form.note"></el-input>
          </el-form-item>
          <div class="row">
            <div class="col-6">
              <el-form-item :label="$t('el.formCard.receiveType')" prop="reception">
                <el-select style="width: 100%" v-model="form.reception">
                  <el-option v-for="opt in receiveTypeOptions" :key="opt.value" :value="opt.value" :label="opt.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-6">
              <el-form-item :label="$t('el.formCard.sendIn')"  prop="provinceCode">
                <my-select
                  class="full-width"
                  v-model="form.provinceCode"
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
                <el-input :disabled="form.status == 'confirmed'" v-model="form.shipmentId"></el-input>
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

const _form = {}; const _custom_field = {}; let firstGroups; let
  secondGroups;

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
        note: '',
        reception: 'post_office_1',
        province: '',
        provinceCode: '',
        shipmentId: ''
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
    this.$store.dispatch('setCurrentActions', [{
      label: this.$t('el.button.create'),
      type: 'primary',
      icon: '',
      callback: this.save,
    }]);

  },
  computed: {
    provinces() {
      return this.$store.getters.provinces.map((c) => {
        return {
          title: c.name,
          value: c.code
        }
      })
    }
  },
  methods: {
    async save() {
      try {
        let valid = await this.$refs['ruleFormCustomer'].validate();
        valid = await this.$refs['ruleForm'].validate();
        if (valid) {
          let res = await this.$store.dispatch('activateUser', this.formCustomer);
          this.form.userId = res.customerId;
          this.form.address = this.formCustomer.address;
          res = await this.$store.dispatch('storeWarrantyForm', this.form);
          Message({
            message: 'Tạo thành công',
            type: 'success',
          });
          this.$router.push({ path: `/warranty-form/${res.id}` });
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
  },
    watch: {
    'form.provinceCode': function (newVal, oldVal) {
      this.form.province = this.provinces.find(p => p.value == newVal).title
    },
  },
  destroyed() {
    this.$store.dispatch('setCurrentActions', []);
    this.$store.state.customField = [];
  },
};
</script>
