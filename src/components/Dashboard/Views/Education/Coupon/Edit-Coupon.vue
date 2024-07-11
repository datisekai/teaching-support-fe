<template lang="html">
  <div class="row">
    <div class="offset-xl-2 col-xl-8 col-md-12">
      <div class="card">
        <div class="card-header">
          <h6 class="title">{{$t('el.formCardTitle.coupon')}}</h6>
        </div>
        <div class="card-body form-card">
          <div class="row">
            <div class="col-sm-12 p-0">
              <label class="required">{{$t('el.formCard.code')}}</label>
              <el-input
                type="text"
                class="full-width uppercase"
                data-vv-name="code"
                v-model="form.code"
                v-validate="'required'"
                :placeholder="$t('el.formCard.code')"
                :class="errors.has('code')?'border-danger':''"
                :data-vv-as="$t('el.formCard.code')"
                :disabled="true"
              >
              </el-input>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12 p-0">
              <label>{{$t('el.formCard.isExpired')}}</label>
              <span v-if="educationCouponDetail.isExpired" class="p-badge badge-success badge-pill ml-2">
                ✔
              </span>
              <span v-else class="p-badge badge-default badge-pill ml-2">
                ✗
              </span>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12 p-0">
              <label>{{$t('el.formCard.description')}}</label>
              <el-input
                type="textarea"
                :rows="2"
                placeholder="Description"
                v-model="form.description"
                :disabled="!canEdit">
              </el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <h6 class="title">{{$t('el.formCardTitle.typeAndValue')}}</h6>
        </div>
        <div class="card-body form-card">
          <div class="row">
            <div class="col-sm-12 p-0">
              <label class="required">{{$t('el.formCard.type')}}</label>
              <my-select
                class="full-width"
                data-vv-name="type"
                v-model="form.discountType"
                v-validate="'required'"
                :attribute="{options: $util.getOptions('discountType')}"
                :placeholder="$t('el.formCard.type')"
                :class="errors.has('type')?'border-danger':''"
                :data-vv-as="$t('el.formCard.type')"
                :disabled="!canEdit"
              >
              </my-select>
              <span class="text-danger" v-if="errors.has('type')">{{ errors.first('type') }}</span>
            </div>
          </div>
          <hr />
          <div v-if="form.discountType != 'free_shipping'"> 
            <div v-if="form.discountType == 'percentage'">
              <div class="row">
                <div class="col-sm-12 p-0" >
                  <label class="required">{{$t('el.formCard.value')}}</label>
                  <my-money
                    fixed=0
                    data-vv-name="value"
                    v-model="form.discountValue"
                    v-validate="'required|min_value:0|max_value:100'"
                    :placeholder="$t('el.formCard.value')"
                    :class="errors.has('value')?'border-danger':''"
                    :data-vv-as="$t('el.formCard.value')"
                    :disabled="!canEdit"
                  >
                    <span slot="append">%</span>
                  </my-money>
                  <span class="text-danger" v-if="errors.has('value')">{{ errors.first('value') }}</span>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 p-0" >
                  <label class="required">{{$t('el.formCard.discountMaxAmount')}}</label>
                  <my-money
                    fixed=0
                    data-vv-name="discount_max_amount"
                    v-model="form.discountMaxAmount"
                    v-validate="'required|min_value:0'"
                    :placeholder="$t('el.formCard.discountMaxAmount')"
                    :class="errors.has('discount_max_amount')?'border-danger':''"
                    :data-vv-as="$t('el.formCard.discountMaxAmount')"
                    :disabled="!canEdit"
                  >
                    <span slot="append">VNĐ</span>
                  </my-money>
                  <span class="text-danger" v-if="errors.has('discount_max_amount')">{{ errors.first('discount_max_amount') }}</span>
                </div>
              </div>
            </div>
            <div v-if="form.discountType == 'fixed_amount'">
              <div class="row">
                <div class="col-sm-12 p-0" >
                  <label class="required">{{$t('el.formCard.value')}}</label>
                  <my-money
                    fixed=0
                    data-vv-name="value"
                    v-model="form.discountValue"
                    v-validate="'required|min_value:0'"
                    :placeholder="$t('el.formCard.value')"
                    :class="errors.has('value')?'border-danger':''"
                    :data-vv-as="$t('el.formCard.value')"
                    :disabled="!canEdit"
                  >
                    <span slot="append">VNĐ</span>
                  </my-money>
                  <span class="text-danger" v-if="errors.has('value')">{{ errors.first('value') }}</span>
                </div>
              </div>
            </div>
            <hr />
            <div class="row">
              <div class="col-sm-12 p-0">
                <label :class="educationCouponDetail.type !== 'birthday' ? 'required' : ''">{{$t('el.formCard.applyTo')}}</label>
                <my-select
                  v-if="educationCouponDetail.type !== 'birthday'"
                  :disabled="!canEdit"
                  class="full-width"
                  data-vv-name="type_relation"
                  v-model="form.typeRelation"
                  v-validate="'required'"
                  :attribute="{options: $util.getOptions('typeRelation').filter(opt => opt.value !== 'all_product')}"
                  :placeholder="$t('el.formCard.applyTo')"
                  :class="errors.has('type_relation')?'border-danger':''"
                  :data-vv-as="$t('el.formCard.applyTo')"
                >
                </my-select>
                <span class="ml-2" v-else>{{$t(`el.selectOptions.` + currentTypeRelationTitle)}}</span>
                <span class="text-danger" v-if="errors.has('type_relation')">{{ errors.first('type_relation') }}</span>
              </div>
            </div>
            <div class="row" v-if="form.typeRelation != 'all_product'">
              <div class="col-sm-12 p-0">
                <label class="required">{{$t('el.formCard.applyFor')}}</label>
                <select-ajax
                  v-if="form.typeRelation == 'category'"
                  key="categories"
                  data-vv-name="categoryIds"
                  v-model="form.categoryIds"
                  v-validate="'required'"
                  :data-vv-as="$t('el.formCard.applyFor')"
                  :class="errors.has('categoryIds')?'border-danger':''"
                  :attribute="{type: 'categories', field: 'name', key: 'id', valueKey: 'id', multiple: true, initOptions: initCategoryOptions}"
                  :disabled="!canEdit"
                  @input="handleCategory"
                >
                </select-ajax>
                <select-ajax
                  v-else
                  key="products"
                  data-vv-name="productIds"
                  v-model="form.productIds"
                  v-validate="'required'"
                  :data-vv-as="$t('el.formCard.applyFor')"
                  :class="errors.has('productIds')?'border-danger':''"
                  :attribute="{type: 'products', field: 'name', key: 'id', valueKey: 'id', multiple: true, initOptions: initProductOptions}"
                  :disabled="!canEdit"
                  @input="handleProduct"
                >
                </select-ajax>
                <span class="text-danger" v-if="errors.has('categoryIds')">{{ errors.first('categoryIds') }}</span>
                <span class="text-danger" v-if="errors.has('productIds')">{{ errors.first('productIds') }}</span>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="row">
              <div class="col-sm-12 p-0">
                <label class="required">{{$t('el.formCard.applyFor')}}</label>
                <el-radio-group class="full-width" v-model="form.isAllProvinces" :disabled="!canEdit">
                  <el-radio class="full-width pt-2"  :label="true">{{$t('el.selectOptions.allProvinces')}}</el-radio>
                  <el-radio class="full-width pt-2"  :label="false">{{$t('el.selectOptions.someProvinces')}}</el-radio>
                </el-radio-group>
                <my-select
                  v-if="form.isAllProvinces == false"
                  class="full-width"
                  data-vv-name="provinceIds"
                  v-model="form.provinceIds"
                  v-validate="'required'"
                  :attribute="{options: provinces, multiple: true, filterable: true}"
                  :placeholder="$t('el.formCard.province')"
                  :class="errors.has('provinceIds')?'border-danger':''"
                  :data-vv-as="$t('el.formCard.applyFor')"
                  :disabled="!canEdit"
                >
                </my-select>
                <span class="text-danger" v-if="errors.has('provinceIds')">{{ errors.first('provinceIds') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <h6 class="title">{{$t('el.formCardTitle.usageConditions')}}</h6>
        </div>
        <div class="card-body form-card">
          <div class="row">
            <div class="col-sm-12 p-0">
              <label class="required">{{$t('el.formCard.minimumRequirement')}}</label>
              <my-money
                fixed=0
                v-validate="'required'"
                data-vv-name="order_min_required"
                v-model="form.orderMinRequired"
                :placeholder="$t('el.formCard.minimumRequirement')"
                :class="errors.has('order_min_required')?'border-danger':''"
                :data-vv-as="$t('el.formCard.minimumRequirement')"
                :disabled="!canEdit"
              >
                <span slot="append">VNĐ</span>
              </my-money>
              <span class="text-danger" v-if="errors.has('order_min_required')">{{ errors.first('order_min_required') }}</span>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12 p-0">
              <label class="required">{{$t('el.formCard.activeDates')}}</label>
              <el-date-picker
                unlink-panels
                align="left"
                class="full-width"
                type="datetimerange"
                data-vv-name="start_end"
                value-format="yyyy/MM/dd H:m:s"
                v-model="form.start_end"
                v-validate="'required|earlier'"
                :picker-options="pickerOptions"
                :range-separator="$t('el.datepicker.to')"
                :start-placeholder="$t('el.datepicker.startDate')"
                :end-placeholder="$t('el.datepicker.endDate')"
                :data-vv-as="$t('el.formCard.activeDates')"
                :class="errors.has('start_end')?'border-danger':''"
                :disabled="!canEdit"
              >
              </el-date-picker>
              <span class="text-danger" v-if="errors.has('start_end')">{{ errors.first('start_end') }}</span>
            </div>
          </div>
          <div class="row" v-if="!form.forGiveAway">
            <el-switch 
              v-model="form.isLimitUsageTimes" 
              :active-value='true' 
              :inactive-value='false' 
              :active-text="$t('el.formCard.limitNumberOfTimes')"
              :disabled="!canEdit || form.forGiveAway">
              
            </el-switch>
          </div>
          <div class="row" v-if="!form.forGiveAway">
            <div class="col-sm-12 p-0">
              <my-money
                class="full-width"
                placeholder="Limit usage"
                :class="errors.has('limit_times')?'border-danger':''"
                :disabled="!form.isLimitUsageTimes || !canEdit"
                v-model="form.limitUsage"
                v-validate="'required'"
                data-vv-name="limit_times"
                data-vv-as="Limit usage"
              >
                <span slot="append">{{form.limitUsage > 1 ? $t('el.formCard.times') : $t('el.formCard.time')}}</span>
              </my-money>
              <span class="text-danger" v-if="errors.has('limit_times')">{{ errors.first('limit_times') }}</span>
            </div>
          </div>
          <div class="row">
            <el-switch 
              v-model="form.isLimitUsagePerCustomer" 
              :active-value='true' 
              :inactive-value='false' 
              :active-text="$t('el.formCard.limitToOneUsePerCustomer')"
              :disabled="!canEdit || form.forGiveAway">
              
            </el-switch>
          </div>
          <div class="row">
            <el-switch 
              v-model="form.isApplyWithOtherPromotion" 
              :active-value='true' 
              :inactive-value='false'
              :active-text="$t('el.formCard.isApplyWithOtherPromotion')"
              :disabled="!canEdit">

            </el-switch>
          </div>
          <div class="row">
            <el-switch 
              v-model="form.isActive" 
              :active-value='true' 
              :inactive-value='false'
              :active-text="$t('el.formCard.isActive')"
              :disabled="!canEdit">
            </el-switch>
          </div>
        </div>
      </div>
      <div v-if="form.forGiveAway" class="card">
        <div class="card-header">
          <h6 class="title">
            <el-switch 
              v-model="form.forGiveAway" 
              :active-value='true' 
              :inactive-value='false' 
              :active-text="$t('el.formCard.forGiveAway')"
              :disabled="true">
            </el-switch>
            <el-button class="pull-right" type="primary" @click="addUser" :disabled="!canAddUser ||!form.forGiveAway">{{$t('el.button.add')}}</el-button>
          </h6>
        </div>
        <div class="card-body form-card">
          <div class="row">
            <div class="col-sm-12 p-0">
              <select-ajax
                key="user"
                v-model="formUser.user"
                :disabled="!form.forGiveAway || !canEdit"
                placeholder="Tìm kiếm khách hàng theo số điện thoại..."
                :attribute="{type: 'user', field: 'phone', displayField: 'phone', key: 'id', valueKey: null, extraQuery: {role: 'user'}}"
              >
              </select-ajax>
            </div>
            <div class="col-sm-6 p-0">
              <div class="row">
                <div class="col-sm-12 p-0">
                  <label>{{$t('el.formCard.fullname')}}:</label>
                </div>
                <div class="col-sm-12 p-0">
                  <span>{{formUser.fullname || 'N/A'}}</span>
                </div>
                <div class="col-sm-12 p-0">
                  <label>{{$t('el.formCard.email')}}:</label>
                </div>
                <div class="col-sm-12 p-0">
                  <span>{{formUser.email || 'N/A'}}</span>
                </div>
                <div class="col-sm-12 p-0">
                  <label>{{$t('el.formCard.dateOfBirth')}}:</label>
                </div>
                <div class="col-sm-12 p-0">
                  <span>{{formUser.dateOfBirth ? $util.formatDate(formUser.dateOfBirth) : 'N/A'}}</span>
                </div>
              </div>
            </div>
            <div class="col-sm-6 p-0">
              <div class="row">
                <div class="col-sm-12 p-0" style="display: flex">
                  <label class="mr-2">{{$t('el.formCard.avatar')}}:</label>
                  <div v-if="formUser.avatar" class="feature-image" :style="{backgroundImage: 'url(' + formUser.avatar.src + ')'}"></div>
                  <div v-else class="feature-image" :style="{backgroundImage: 'url(' + noImage + ')'}"></div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div class="row" style="margin: 0 -15px; !important">
            <div class="col-sm-12 p-0">
              <my-table
                ref="table"
                :columnDefs="columnDefs"
                v-bind:data-rows="users"
                :actions="actions"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Select, Option, Button, Input, DatePicker, Radio, RadioGroup, Switch, Notification, MessageBox 
} from 'element-ui';
import MySelect from 'src/components/UIComponents/Select';
import MyMoney from 'src/components/UIComponents/Money';
import MyEditor from 'src/components/UIComponents/Editor';
import MyTable from 'src/components/UIComponents/Table.vue';
import SelectAjax from 'src/components/UIComponents/SelectAjax';
import { mapState } from 'vuex';
import userSchemas from './user-schemas';
import dtHelper from 'src/helpers/datatable';

export default {
  components: {
    ElInput: Input,
    ElRadio: Radio,
    ElOption: Option,
    ElButton: Button,
    ElSelect: Select,
    ElSwitch: Switch,
    ElRadioGroup: RadioGroup,
    ElDatePicker: DatePicker,
    MyTable,
    MyMoney,
    MyEditor,
    MySelect,
    SelectAjax
  },
  created() {
    const self = this;
    this.$validator.extend('earlier', {
      getMessage(field, val) {
        return self.$t('el.translate.endGreaterStart');
      },
      validate(value, field) {
        const momentStart = new Date(value[0]).getTime();
        const momentEnd = new Date(value[1]).getTime();
        return momentEnd >= momentStart;
      },
    });
  },
  data() {
    const initFiledArrays = ['id', 'avatar', 'fullname', 'email', 'dateOfBirth'];
    return {
      columnDefs: dtHelper.buildInitFields(userSchemas, initFiledArrays),
       actions: [
        {
          type: 'danger',
          icon: 'nc-icon nc-simple-remove',
          title: 'delete',
          disabled: () => !this.canEdit,
          callback: this.removeUser,
        },
      ],
      form: {
        code: '',
        discountType: 'percentage',
        discountValue: 0,
        discountMaxAmount: 9999999,
        isActive: true,
        typeRelation: 'product',
        isAllProvinces: true,
        orderMinRequired: 0,
        isLimitUsageTimes: false,
        isLimitUsagePerCustomer: false,
        isApplyWithOtherPromotion: false,
        forGiveAway: false,
        limitUsage: 0,
        productIds: [],
        categoryIds: [],
        provinceIds: [],
      },
      formUser: {
        user: null,
        userId: null,
        fullname: '',
        email: '',
        avatar: '',
        dateOfBirth: '',
        stt: '',
      },
      users: [],
      pickerOptions: {
        disabledDate(time) {
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          return time.getTime() < now.getTime();
        },
        shortcuts: [
          {
            text: 'Next week',
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              start.setDate(start.getDate() + (1 + 7 - start.getDay()) % 7);
              start.setHours(0,0,0,0);
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 6);
              end.setHours(23,59,59,999);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: 'Next month',
            onClick(picker) {
              let start = new Date();
              let end = new Date();
              if (start.getMonth() == 11) {
                  start = new Date(start.getFullYear() + 1, 0, 1);
              } else {
                  start = new Date(start.getFullYear(), start.getMonth() + 1, 1);
              }
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              end.setHours(23,59,59,999);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '1 week',
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              start.setTime(start.getTime() + 3600 * 1000 * 24);
              start.setHours(0,0,0,0);
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 6);
              end.setHours(23,59,59,999);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '1 month',
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              start.setTime(start.getTime() + 3600 * 1000 * 24);
              start.setHours(0,0,0,0);
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              end.setHours(23,59,59,999);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      initCategoryOptions: [],
      initProductOptions: [],
    };
  },
  computed: {
    ...mapState(['educationCouponDetail', 'noImage']),
    provinces() {
      return this.$store.getters.provinces.map((c) => {
        return {
          title: c.name,
          value: c.id
        }
      })
    },
    canAddUser() {
      return !!this.formUser.userId;
    },
    canEdit() {
      return !this.educationCouponDetail.isExpired;
    },
    currentTypeRelationTitle() {
      const typeRelation = this.$util.getOptions('typeRelation').find(t => t.value === this.educationCouponDetail.typeRelation);
      return typeRelation && typeRelation.title || '';
    }
  },
  async mounted() {
    await this.init();
    this.$store.dispatch('fetchProvinces');
    this.$store.dispatch('setPageTitle', 'couponUpdate');
    const actions = []
    if (this.canEdit) {
      actions.push({
        label: 'update',
        type: 'primary',
        icon: '',
        callback: this.save,
      });
    }
    this.$store.dispatch('setCurrentActions', actions);
  },
  methods: {
    updateSTT() {
      this.users = this.users.map((user, index) => {
        user.stt = index + 1;
        return user;
      });
    },
    async init() {
      const id = this.$route.params.id;
      await this.$store.dispatch('fetchEducationCouponDetail', id);
    },
    cancel() {
      this.$router.push('/education/coupon');
    },
    save() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          const start_end = this.form.start_end;
          const data = {
            ...this.form,
            startDate: new Date(start_end[0]).getTime(),
            expiredDate: new Date(start_end[1]).getTime(),
          }
          if (this.form.forGiveAway) {
            if (!this.users || !this.users.length) {
              return Notification ({
                title: 'Warning',
                message: 'Vui lòng chọn ít nhất một khách hàng',
                position: 'bottom-right',
                type: 'warning'
              });
            }
            data.userIds = this.users.map(u => u.id);
          }
          this.$store.dispatch('updateEducationCoupon', data).then((res) => {
            Notification ({
              title: 'Success',
              message: 'Update succeeded',
              position: 'bottom-right',
              type: 'success',
            });
            this.init();
          }, (err) => {
            Notification ({
              title: 'Error',
              message: err.message,
              position: 'bottom-right',
              type: 'error',
            });
          });
        } else {
          Notification ({
            title: 'Error',
            message: 'Validate failed',
            position: 'bottom-right',
            type: 'error',
          });
        }
      });
    },
    genNewCode() {
      this.$store.dispatch('generateCodeCoupon').then((res) => {
        this.form.code = res.code;
        Notification ({
          title: 'Success',
          message: `Generated new code is ${res.code}`,
          position: 'bottom-right',
          type: 'success',
        });
      }, (err) => {
        Notification ({
          title: 'Error',
          message: 'Generated new code failed',
          position: 'bottom-right',
          type: 'error',
        });
      });
    },
    addUser() {
      const user = {
        ...this.formUser,
        id: this.formUser.userId
      };
      if (this.users.find(p => p.id == user.id)) {
        return Notification ({
          title: 'Error',
          message: 'This user has been added',
          position: 'bottom-right',
          type: 'error',
        });
      }
      this.users.push(user);
      this.resetFormUser();
      this.updateSTT();
      Notification ({
        title: 'Success',
        message: 'Add user succeeded',
        position: 'bottom-right',
        type: 'success',
      });
    },
    resetFormUser() {
      this.formUser.user = null;
      this.formUser.userId = null;
      this.formUser.fullname = '';
      this.formUser.email = '';
      this.formUser.avatar = '';
      this.formUser.dateOfBirth = '';
    },
    removeUser(index, row) {
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        this.users.splice(index, 1);
        this.updateSTT();
        Notification ({
          title: 'Success',
          message: 'Delete completed',
          position: 'bottom-right',
          type: 'success',
        });
      }).catch(() => {
        Notification ({
          title: 'Canceled',
          message: 'Delete canceled',
          position: 'bottom-right',
          type: 'info',
        });
      });
    },
    handleCategory(val) {
      this.form.categoryIds = val;
    },
    handleProduct(val) {
      this.form.productIds = val;
    }
  },
  watch: {
    'form.code': function(newVal, oldVal) {
      if (newVal) {
        this.form.code = newVal.replace(/[\W_]+/g,"").toUpperCase();
      }
    },
    'formUser.user': function (newVal, oldVal) {
      if (newVal) {
        if (this.users.find(p => p.id == newVal.id)) {
          return Notification ({
            title: 'Error',
            message: 'This user has been added',
            position: 'bottom-right',
            type: 'error',
          });
        }
        const profile = newVal.profile || {};
        this.formUser.userId = newVal.id;
        this.formUser.fullname = newVal.fullname || profile.fullname;
        this.formUser.email = newVal.email || profile.email;
        this.formUser.avatar = profile.avatar;
        this.formUser.dateOfBirth = profile.dateOfBirth;
      } else {
        this.resetFormUser();
      }
    },
    'form.typeRelation': function(newVal) {
      if (newVal === 'category') {
        this.form.productIds = this.educationCouponDetail.productIds;
      } else if (newVal === 'product') {
        this.form.categoryIds = this.educationCouponDetail.categoryIds;
      }
    },
    async educationCouponDetail(newVal) {
      if (newVal) {
        this.form = {
          ...this.form,
          ...newVal,
          start_end: [new Date(newVal.startDate), new Date(newVal.expiredDate)],
          forGiveAway: newVal.users.length != 0,
        }
        this.users = newVal.users.map((u, index) => {
          return {
            id: u.id,
            stt: index + 1,
            fullname: u.fullname || u.profile && u.profile.fullname,
            email: u.email,
            avatar: u.profile && u.profile.avatar,
            dateOfBirth: u.profile && u.profile.dateOfBirth,
          }
        });

        if (newVal.typeRelation === 'category') {
        this.initCategoryOptions = await this.$store.dispatch('fetchCollections', {ids: newVal.categoryIds.join(',')});
        } else if (newVal.typeRelation === 'product') {
          this.initProductOptions = await this.$store.dispatch('fetchProducts', {ids: newVal.productIds.join(',')});
        }
      }
    }
  },
  destroyed() {
    this.$store.dispatch('setCurrentActions', []);
  },
};
</script>

<style lang="scss" scoped>
  .el-radio + .el-radio {
    margin-left: 0; 
  }
  .uppercase {
    input {
      text-transform: uppercase;
    }
  }
  button.is-disabled {
    opacity: 0.5;
  }
  .feature-image {
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    width: 150px;
    height: 150px;
  }
</style>
