<template lang="html">
  <div class="row">
    <form class="offset-xl-2 col-xl-8 col-md-12" data-vv-scope="form">
      <div class="card">
        <div class="card-header">
          <h6 class="title">{{$t('el.formCardTitle.campaign')}}</h6>
        </div>
        <div class="card-body form-card">
          <div class="row">
            <div class="col-sm-12 p-0">
              <label class="required">{{$t('el.formCard.title')}}</label>
            </div>
            <div class="col-sm-12 p-0">
              <el-input
                type="text"
                class="full-width"
                data-vv-name="title"
                v-model="form.title"
                v-validate="'required'"
                :placeholder="$t('el.formCard.title')"
                :class="errors.has('form.title')?'border-danger':''"
                :data-vv-as="$t('el.formCard.title')"
                :disabled="!canEdit"
              >
              </el-input>
              <span class="text-danger" v-if="errors.has('form.title')">{{ errors.first('title') }}</span>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-3 p-0 pr-1">
              <label>{{$t('el.formCard.image')}}</label>
              <my-image-upload-single :disabled="!canEdit" v-model="form.image"></my-image-upload-single>
            </div>
            <div class="col-sm-9 p-0 pl-1">
              <el-col :span="24">
                <label class="required">{{$t('el.formCard.color')}}</label>
              </el-col>
              <el-col :span="24" class="mb-2">
                <compact-picker :disabled="!canEdit" :palette="palette" v-model="colorPicker"/>
              </el-col>
              <el-col style="width: 245px">
                <el-input
                  autocomplete="off"
                  data-vv-name="color"
                  placeholder="Hex..."
                  v-validate="'required'"
                  v-model="form.color"
                  :data-vv-as="$t('el.formCard.color')"
                  :placeholder="$t('el.formCard.color')"
                  :class="errors.has('form.color')?'border-danger':''"
                  :disabled="!canEdit"
                ></el-input>
              </el-col>
              <el-col :span="24" class="mb-2">
                <span class="text-danger" v-if="errors.has('form.color')">{{ errors.first('color')}}</span>
              </el-col>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12 p-0">
              <label>{{$t('el.formCard.description')}}</label>
            </div>
            <div class="col-sm-12 p-0">
              <my-editor
                v-if="canEdit"
                :disabled="!canEdit"
                v-model="form.description"
              ></my-editor>
              <div v-else class="campaign-description" v-html="form.description || 'N/A'"></div>
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
              <b class="required">{{$t('el.formCard.type')}}</b>
              <my-select
                class="full-width"
                data-vv-name="type"
                v-model="form.discountType"
                v-validate="'required'"
                :attribute="{options: $util.getOptions('discountType')}"
                :placeholder="$t('el.formCard.type')"
                :class="errors.has('form.type')?'border-danger':''"
                :data-vv-as="$t('el.formCard.type')"
                :disabled="!canEdit"
              >
              </my-select>
              <span class="text-danger" v-if="errors.has('form.type')">{{ errors.first('type') }}</span>
            </div>
          </div>
          <hr />
          <div v-if="form.discountType != 'free_shipping'"> 
            <div v-if="form.discountType == 'percentage'">
              <div class="row">
                <div class="col-sm-12 p-0" >
                  <b class="required">{{$t('el.formCard.value')}}</b>
                  <my-money
                    fixed=0
                    data-vv-name="value"
                    v-model="form.discountValue"
                    v-validate="'required|min_value:0|max_value:100'"
                    :placeholder="$t('el.formCard.value')"
                    :class="errors.has('form.value')?'border-danger':''"
                    :data-vv-as="$t('el.formCard.value')"
                    :disabled="!canEdit"
                  >
                    <span slot="append">%</span>
                  </my-money>
                  <span class="text-danger" v-if="errors.has('form.value')">{{ errors.first('value') }}</span>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 p-0" >
                  <b class="required">{{$t('el.formCard.discountMaxAmount')}}</b>
                  <my-money
                    fixed=0
                    data-vv-name="discount_max_amount"
                    v-model="form.discountMaxAmount"
                    v-validate="'required|min_value:0'"
                    :placeholder="$t('el.formCard.discountMaxAmount')"
                    :class="errors.has('form.discount_max_amount')?'border-danger':''"
                    :data-vv-as="$t('el.formCard.discountMaxAmount')"
                    :disabled="!canEdit"
                  >
                    <span slot="append">VNĐ</span>
                  </my-money>
                  <span class="text-danger" v-if="errors.has('form.discount_max_amount')">{{ errors.first('discount_max_amount') }}</span>
                </div>
              </div>
            </div>
            <div v-if="form.discountType == 'fixed_amount'">
              <div class="row">
                <div class="col-sm-12 p-0" >
                  <b class="required">{{$t('el.formCard.value')}}</b>
                  <my-money
                    fixed=0
                    data-vv-name="value"
                    v-model="form.discountValue"
                    v-validate="'required|min_value:0'"
                    :placeholder="$t('el.formCard.value')"
                    :class="errors.has('form.value')?'border-danger':''"
                    :data-vv-as="$t('el.formCard.value')"
                    :disabled="!canEdit"
                  >
                    <span slot="append">VNĐ</span>
                  </my-money>
                  <span class="text-danger" v-if="errors.has('form.value')">{{ errors.first('value') }}</span>
                </div>
              </div>
            </div>
            <hr />
            <div class="row">
              <div class="col-sm-12 p-0">
                <b class="required">{{$t('el.formCard.applyTo')}}</b>
                <my-select
                  class="full-width"
                  v-model="form.typeRelation"
                  :attribute="{options: $util.getOptions('typeRelation').filter(opt => opt.value !== 'all_product')}"
                  :disabled="true"
                >
                </my-select>
                <span class="text-danger" v-if="errors.has('form.type_relation')">{{ errors.first('type_relation') }}</span>
              </div>
            </div>
            <div class="row" v-if="form.typeRelation != 'all_product'">
              <div class="col-sm-12 p-0">
                <b class="required">{{$t('el.formCard.applyFor')}}</b>
                <select-ajax
                  v-if="form.typeRelation == 'category'"
                  key="categories"
                  data-vv-name="categoryIds"
                  v-model="form.categoryIds"
                  v-validate="'required'"
                  :data-vv-as="$t('el.formCard.applyFor')"
                  :class="errors.has('form.categoryIds')?'border-danger':''"
                  :attribute="{type: 'categories', field: 'name', valueKey: 'id', multiple: true, initOptions}"
                  :disabled="!canEdit"
                >
                </select-ajax>
                <!-- <my-select
                  v-if="form.typeRelation == 'category'"
                  class="full-width"
                  data-vv-name="categoryIds"
                  v-model="form.categoryIds"
                  v-validate="'required'"
                  :attribute="{options: categories, multiple: true, filterable: true}"
                  :placeholder="$t('el.formCard.collection')"
                  :class="errors.has('form.categoryIds')?'border-danger':''"
                  :data-vv-as="$t('el.formCard.applyFor')"
                >
                </my-select> -->
                <select-ajax
                  v-else
                  key="products"
                  data-vv-name="productIds"
                  v-model="form.productIds"
                  v-validate="'required'"
                  :data-vv-as="$t('el.formCard.applyFor')"
                  :class="errors.has('form.productIds')?'border-danger':''"
                  :attribute="{type: 'products', field: 'name', key: 'id', valueKey: 'id', multiple: true, initOptions}"
                  :disabled="!canEdit"
                >
                </select-ajax>
                <span class="text-danger" v-if="errors.has('form.categoryIds')">{{ errors.first('categoryIds') }}</span>
                <span class="text-danger" v-if="errors.has('form.productIds')">{{ errors.first('productIds') }}</span>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="row">
              <div class="col-sm-12 p-0">
                <b class="required">{{$t('el.formCard.applyFor')}}</b>
                <el-radio-group class="full-width" v-model="form.isAllProvinces">
                  <el-radio class="full-width pt-2"  :label="true">{{$t('el.selectOptions.allProvinces')}}</el-radio>
                  <el-radio class="full-width pt-2"  :label="false">{{$t('el.selectOptions.someProvinces')}}</el-radio>
                </el-radio-group>
                <!-- <select-ajax
                  v-if="form.isAllProvinces == false"
                  key="provinces"
                  data-vv-name="provinceIds"
                  v-model="form.provinceIds"
                  v-validate="'required'"
                  :data-vv-as="$t('el.formCard.applyFor')"
                  :class="errors.has('form.provinceIds')?'border-danger':''"
                  :attribute="{type: 'provinces', field: 'name', valueKey: 'id', multiple: true}"
                >
                </select-ajax> -->
                <my-select
                  v-if="form.isAllProvinces == false"
                  class="full-width"
                  data-vv-name="provinceIds"
                  v-model="form.provinceIds"
                  v-validate="'required'"
                  :attribute="{options: provinces, multiple: true, filterable: true}"
                  :placeholder="$t('el.formCard.provinces')"
                  :class="errors.has('form.provinceIds')?'border-danger':''"
                  :data-vv-as="$t('el.formCard.applyFor')"
                  :disabled="!canEdit"
                >
                </my-select>
                <span class="text-danger" v-if="errors.has('form.provinceIds')">{{ errors.first('provinceIds') }}</span>
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
              <b class="required">{{$t('el.formCard.minimumRequirement')}}</b>
              <my-money
                fixed=0
                v-validate="'required'"
                data-vv-name="order_min_required"
                v-model="form.orderMinRequired"
                :placeholder="$t('el.formCard.minimumRequirement')"
                :class="errors.has('form.order_min_required')?'border-danger':''"
                :data-vv-as="$t('el.formCard.minimumRequirement')"
                :disabled="!canEdit"

              >
                <span slot="append">VNĐ</span>
              </my-money>
              <span class="text-danger" v-if="errors.has('form.order_min_required')">{{ errors.first('order_min_required') }}</span>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12 p-0">
              <b class="required">{{$t('el.formCard.activeDates')}}</b>
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
                :class="errors.has('form.start_end')?'border-danger':''"
                :disabled="!canEdit"

              >
              </el-date-picker>
              <span class="text-danger" v-if="errors.has('form.start_end')">{{ errors.first('start_end') }}</span>
            </div>
          </div>
          <div class="row">
            <el-switch :disabled="!canEdit" v-model="form.isActive" :active-value='true' :inactive-value='false' :active-text="$t('el.formCard.isActive')">
            </el-switch>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { Compact } from 'vue-color';
import {
  Select, Option, Button, Input, DatePicker, Radio, Notification, MessageBox, RadioGroup, Switch, Col
} from 'element-ui';
import MySelect from 'src/components/UIComponents/Select';
import MyMoney from 'src/components/UIComponents/Money';
import FormCard from 'src/components/UIComponents/FormCard';
import SelectAjax from 'src/components/UIComponents/SelectAjax';
import MyEditor from 'src/components/UIComponents/Editor';
import MyImageUploadSingle from 'src/components/UIComponents/ImageUploadSingle';
import { mapState } from 'vuex';
import moment from 'moment'
import notiScheduleFormGroup from './notification-schedule-form';


export default {
  components: {
    ElCol: Col,
    ElInput: Input,
    ElRadio: Radio,
    ElSelect: Select,
    ElOption: Option,
    ElButton: Button,
    ElSwitch: Switch,
    ElDatePicker: DatePicker,
    ElRadioGroup: RadioGroup,
    MyMoney,
    MyEditor,
    MySelect,
    FormCard,
    SelectAjax,
    MyImageUploadSingle,
    CompactPicker: Compact
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
    return {
      colorPicker: '#2694A1',
      products: [],
      collections: [],
      form: {
        discountType: 'percentage',
        discountValue: 0,
        discountMaxAmount: 9999999,
        isActive: true,
        typeRelation: 'product',
        isAllProvinces: true,
        orderMinRequired: 0,
        color: '#2694A1'
      },
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
    };
  },
  computed: {
    ...mapState(['campaignDetail', 'palette']),
    provinces() {
      return this.$store.getters.provinces.map((c) => {
        return {
          title: c.name,
          value: c.id
        }
      })
    },
    initOptions() {
      if (this.campaignDetail.typeRelation === 'product') {
        return this.products;
      } else if (this.campaignDetail.typeRelation === 'category') {
        return this.collections;
      }
    },
    canEdit() {
      return !this.campaignDetail.isCompleted;
    },
  },
  mounted() {
    this.$store.dispatch('fetchPalette');
    this.$store.dispatch('fetchProvinces');
    this.$store.dispatch('setPageTitle', 'campaignUpdate');
    this.reload();
  },
  methods: {
    date: function (date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss');
    },
    cancel() {
      this.$router.push({ name: 'AllCampaigns' });
    },
    
    remove() {
      const self = this;
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        self.$store.dispatch('removeCampaign', self.form.id).then((res) => {
          Notification ({
            title: 'Success',
            message: 'Delete completed',
            position: 'bottom-right',
            type: 'success',
          });
          self.$router.push({ name: 'AllCampaigns' });
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
    async save() {

      this.$validator.validateAll().then((result) => {
        if (result) {
          let start_end = this.form.start_end;
          let data = {
            ...this.form,
            startDate: new Date(start_end[0]).getTime(),
            expiredDate: new Date(start_end[1]).getTime(),
            image: this.form.image,
          }
          this.$store.dispatch('updateCampaign', data).then((res) => {
            Notification ({
              title: 'Success',
              message: 'Update succeeded',
              position: 'bottom-right',
              type: 'success',
            });
            this.reload();
          }, (err) => {
            Notification ({
              title: 'Error',
              message: err.message,
              position: 'bottom-right',
              type: 'error',
            });
          }).catch(err => {
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
    async reload() {
      const id = this.$route.params.id;
      await this.$store.dispatch('fetchCampaignDetail', id);
      if (this.campaignDetail.typeRelation === 'product') {
        this.products = await this.$store.dispatch('fetchProducts', {ids: this.campaignDetail.productIds.join(',')});
      } else if (this.campaignDetail.typeRelation === 'category') {
        this.collections = await this.$store.dispatch('fetchCollections', {ids: this.campaignDetail.categoryIds.join(',')});
      }

      const actions = [{
        label: 'delete',
        type: 'danger',
        icon: '',
        callback: this.remove,
      }, {
        label: 'update',
        type: 'primary',
        icon: '',
        callback: this.save,
      }];
      if (!this.canEdit) {
        actions.pop();
      }

      this.$store.dispatch('setCurrentActions', actions);
    }
  },
  watch: {
    campaignDetail(new_val) {
      if (new_val) {
        this.form = {
          ...this.form,
          ...new_val,
          start_end: [new Date(new_val.startDate), new Date(new_val.expiredDate)]
        };
      }
    },
    'form.color': function(newVal, oldVal) {
      if(newVal) {
        this.colorPicker = newVal;
      }
    },
    colorPicker(newVal, oldVal) {
      if (newVal && typeof newVal == 'object') {
        this.form.color = newVal.hex;
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

  .campaign-description {
    max-height: 400px;
    overflow-y: auto;
  }
</style>
