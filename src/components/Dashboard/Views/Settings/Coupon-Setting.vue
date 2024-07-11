<template>
  <div class="row">
    <div class="offset-md-2 col-md-8 card p-0">
      <div class="card-header">
        <h6 class="title">{{$t('el.formCardTitle.birthdayCouponSetting')}}</h6>
      </div>
      <div class="card-body row p-0">
        <div class="col-md-12">
          <el-form class="p-3" :model="couponSettingMeta">
            <el-form-item :label="$t('el.formCard.type')">
              <my-select
                class="full-width"
                data-vv-name="type"
                v-model="couponSettingMeta.discountType"
                v-validate="'required'"
                :attribute="{options: $util.getOptions('discountType')}"
                :placeholder="$t('el.formCard.type')"
                :class="errors.has('type')?'border-danger':''"
                :data-vv-as="$t('el.formCard.type')"
              >
              </my-select>
              <span class="text-danger" v-if="errors.has('type')">{{ errors.first('type') }}</span>
            </el-form-item>
            <div v-if="couponSettingMeta.discountType == 'percentage'">
              <el-form-item :label="$t('el.formCard.value')">
                <my-money
                  fixed=0
                  data-vv-name="value"
                  v-model="couponSettingMeta.discountValue"
                  v-validate="'required|min_value:0|max_value:100'"
                  :placeholder="$t('el.formCard.value')"
                  :class="errors.has('value')?'border-danger':''"
                  :data-vv-as="$t('el.formCard.value')"
                >
                  <span slot="append">%</span>
                </my-money>
                <span class="text-danger" v-if="errors.has('value')">{{ errors.first('value') }}</span>
              </el-form-item>
              <el-form-item :label="$t('el.formCard.discountMaxAmount')">
                <my-money
                  fixed=0
                  data-vv-name="discount_max_amount"
                  v-model="couponSettingMeta.discountMaxAmount"
                  v-validate="'required|min_value:0'"
                  :placeholder="$t('el.formCard.discountMaxAmount')"
                  :class="errors.has('discount_max_amount')?'border-danger':''"
                  :data-vv-as="$t('el.formCard.discountMaxAmount')"
                >
                  <span slot="append">VNĐ</span>
                </my-money>
                <span class="text-danger" v-if="errors.has('discount_max_amount')">{{ errors.first('discount_max_amount') }}</span>
              </el-form-item>
            </div>
            <div v-else-if="couponSettingMeta.discountType == 'fixed_amount'">
              <el-form-item :label="$t('el.formCard.value')">
                <my-money
                  fixed=0
                  data-vv-name="value"
                  v-model="couponSettingMeta.discountValue"
                  v-validate="'required|min_value:0'"
                  :placeholder="$t('el.formCard.value')"
                  :class="errors.has('value')?'border-danger':''"
                  :data-vv-as="$t('el.formCard.value')"
                >
                  <span slot="append">VNĐ</span>
                </my-money>
                <span class="text-danger" v-if="errors.has('value')">{{ errors.first('value') }}</span>
              </el-form-item>
            </div>
            <el-form-item :label="$t('el.formCard.minimumRequirement')">
              <my-money
                fixed=0
                v-validate="'required'"
                data-vv-name="orderMinRequired"
                v-model="couponSettingMeta.orderMinRequired"
                :placeholder="$t('el.formCard.minimumRequirement')"
                :class="errors.has('orderMinRequired')?'border-danger':''"
                :data-vv-as="$t('el.formCard.minimumRequirement')"
              >
                <span slot="append">VNĐ</span>
              </my-money>
              <span class="text-danger" v-if="errors.has('orderMinRequired')">{{ errors.first('orderMinRequired') }}</span>
            </el-form-item>
            <el-form-item :label="$t('el.formCard.expiredIn')">
              <my-money
                fixed=0
                v-validate="'required|min_value:1'"
                data-vv-name="expiredInDays"
                v-model="couponSettingMeta.expiredInDays"
                :placeholder="$t('el.formCard.expiredIn')"
                :class="errors.has('expiredInDays')?'border-danger':''"
                :data-vv-as="$t('el.formCard.expiredIn')"
              >
                <span slot="append">{{couponSettingMeta.expiredInDays > 1 ? $t('el.formCard.days') : $t('el.formCard.day')}}</span>
              </my-money>
              <span class="text-danger" v-if="errors.has('expiredInDays')">{{ errors.first('expiredInDays') }}</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { MessageBox, Dialog, Input, Form, FormItem, Notification, Button } from 'element-ui';
import MyMoney from 'src/components/UIComponents/Money.vue';
import MyTable from 'src/components/UIComponents/Table.vue';
import MyFilter from 'src/components/UIComponents/Filter.vue';
import MySelect from 'src/components/UIComponents/Select.vue';


export default {
  components: {
    MyMoney,
    MyTable,
    MyFilter,
    MySelect,
    ElForm: Form,
    ElInput: Input,
    ElDialog: Dialog,
    ElButton: Button,
    ElFormItem: FormItem,
  },
  computed: {
    couponSettingMeta() {
      return this.$store.getters.couponSettingMeta;
    },
  },
  data() {
    return {
      formCreateMeta: {
        metaKey: '',
        metaValue: '',
      },
      formUpdateMeta: {
        metaKey: '',
        metaValue: '',
      }
    };
  },
  mounted() {
    this.$store.dispatch('fetchCouponSettingMeta');
    this.$store.dispatch('setPageTitle', 'birthdayCouponSetting');
    this.$store.dispatch('setCurrentActions', [{
      label: 'update',
      type: 'primary',
      icon: '',
      callback: this.updateMeta,
    }]);
  },
  methods: {
    updateMeta() {
      this.$validator.validateAll().then((result) => {
        switch (this.couponSettingMeta.discountType) {
          case 'free_shipping':
            this.couponSettingMeta.discountValue = 0;
            this.couponSettingMeta.discountMaxAmount = 9999999;
            break;
          case 'fixed_amount':
            this.couponSettingMeta.discountMaxAmount = 9999999;
            break;
        }
        const data = { metaValue: this.couponSettingMeta };
        if (result) {
          this.$store.dispatch('updateCouponSettingMeta', data).then((res) => {
            Notification ({
              title: 'Success',
              message: 'Update succeeded',
              position: 'bottom-right',
              type: 'success',
            });
            // this.$store.dispatch('fetchCouponSettingMeta');
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
  },
  destroyed() {
    this.$store.dispatch('setCurrentActions', []);
  },
};
</script>
<style lang="scss">
  .el-table .td-actions{
    button.btn {
      margin-right: 5px;
    }
  }
  button.is-disabled {
    opacity: 0.5;
  }
</style>
