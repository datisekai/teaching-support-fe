<template>
  <div class="row">
    <el-tabs class="full-width" v-model="activeName">
      <el-tab-pane :label="$t('el.translate.customerInformation')" name="detail">
        <div class="row">
          <div class="col-8">
            <div class="card">
              <div class="card-header">
                <h6 class="title">{{$t('el.formCardTitle.customerInformation')}}</h6>
              </div>
              <div class="card-body form-card">
                <div class="row">
                  <div class="col-sm-12 p-0">
                    <label>{{$t('el.formCard.fullname')}}:</label>
                    <el-input
                      v-model="form.fullname"
                      v-validate="'required'"
                      :placeholder="$t('el.formCard.fullname')"
                    ></el-input>
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-12 p-0">
                    <label>{{$t('el.formCard.email')}}: </label>
                    <el-input 
                      v-model="form.email"
                      v-validate="'email'"
                      :placeholder="$t('el.formCard.email')"
                    ></el-input>
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-12 p-0">
                    <label>{{$t('el.formCard.phone')}}: </label>
                    <el-input 
                      v-model="form.phone"
                      :placeholder="$t('el.formCard.phone')"
                    ></el-input>
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-12 p-0">
                    <label>{{$t('el.formCard.gender')}}: {{form.gender}}</label>
                    <my-select
                      class="full-width"
                      v-model="form.gender"
                      :placeholder="$t('el.formCard.gender')"
                      :attribute="{options: $util.getOptions('gender')}"
                    >
                    </my-select>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-12 card p-0">
              <div class="card-body row p-0">
                <div class="col-sm-12">
                  <my-table :columnDefs="columnDefsCoupon" v-bind:data-rows="customerCoupons"/>
                </div>
              </div>
            </div>
          </div>
          <div class="col-4">
            <div class="card">
              <div class="card-header">
                <h6 class="title">{{$t('el.formCardTitle.addresses')}}</h6>
              </div>
              <div v-if="customerAddresses.length" class="card-body form-card">
                <div v-for="address of customerAddresses" :key="address.id" class="row">
                  <div class="col-sm-12 p-0">
                    <label>{{$t('el.formCard.fullname')}}:</label>
                    <span>{{address.fullname || 'N/A'}}</span>
                  </div>
                  <div class="col-sm-12 p-0">
                    <label>{{$t('el.formCard.phone')}}:</label>
                    <span>{{address.phone || 'N/A'}}</span>
                  </div>
                  <div class="col-sm-12 p-0">
                    <label>{{$t('el.formCard.address')}}:</label>
                    <span>{{address.address1 || 'N/A'}}</span>
                  </div>
                  <hr v-if="customerAddresses.length > 1" />
                </div>
              </div>
              <div v-else>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('el.translate.customerOrders')" name="orders">
        <div class="col-md-12 card p-0">
          <div class="card-body row p-0">
            <div class="col-sm-12">
              <my-table :columnDefs="columnDefsOrder" v-bind:data-rows="customerOrders" :actions="actionsOrder"/>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Vue from 'vue';
import { Button, Tabs, TabPane, Input, Notification } from 'element-ui';
import MyTable from 'src/components/UIComponents/Table.vue';
import MySelect from 'src/components/UIComponents/Select.vue';
import MyFilter from 'src/components/UIComponents/Filter.vue';
import MyRegion from 'src/components/UIComponents/Region.vue';
import dtHelper from 'src/helpers/datatable';
import { mapState } from 'vuex';
import ordersSchemas from './customer-order-schemas';
import couponsSchemas from './customer-coupon-schemas';

export default {
  components: {
    ElTabs: Tabs,
    ElInput: Input,
    ELButton: Button,
    ElTabPane: TabPane,
    MyTable,
    MyFilter,
    MySelect,
  },
  data() {
    return {
      activeName: 'detail',
      form: {
        gender: '',
        avatar: '',
        email: '',
        fullname: '',
      },
      customerAddresses: [],
      customerCoupons: [],
      columnDefsOrder: dtHelper.buildColumDefs(ordersSchemas),
      columnDefsCoupon: dtHelper.buildColumDefs(couponsSchemas),
      actionsOrder: [
        {
          type: 'primary',
          title: 'sync',
          icon: 'fa fa-external-link',
          callback: this.viewOrderOnStore,
        }
      ],
      actionsCoupon: [
        {
          type: 'primary',
          icon: 'nc-icon nc-ruler-pencil',
          callback: this.couponDetail,
        },
      ],
      storeUrl: '',
    };
  },
  computed: mapState(['customerDetail', 'customerOrders']),
  mounted() {
    const id = this.$route.params.id;
    this.$store.dispatch('fetchCustomerDetail', id);
    this.$store.dispatch('fetchCustomerOrders', id);
    this.$store.dispatch('setPageTitle', 'customerUpdate');
    this.$store.dispatch(`fetchMetaStoreUrl`).then(metaData => this.storeUrl = metaData.metaValue);
    this.$store.dispatch('setCurrentActions', [{
      label: 'update',
      type: 'primary',
      icon: '',
      callback: this.save,
    }]);
  },
  methods: {
    orderDetail(index, row) {
      this.$router.push({name: 'EditCustomer', params: {id: row.id}});
    },
    couponDetail(index, row) {
      this.$router.push({name: 'EditCoupon', params: {id: row.id}});
    },
    save() {
      // this.form.region = this.form.dataRegion.region;
      // this.form.subregion = this.form.dataRegion.subRegion;
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$store.dispatch('updateCustomer', this.form).then((res) => {
            Notification({
              title: 'Success',
              message: 'Update succeeded',
              position: 'bottom-right',
              type: 'success',
            });
          }, (error) => {
            Notification({
              title: 'Error',
              message: error.message,
              position: 'bottom-right',
              type: 'error',
            });
          });
        }
      });
    },
    viewOrderOnStore(index, row) {
      if (this.storeUrl) {
        return window.open(this.storeUrl + `/admin/order/#/detail/${row.id}`);
      }

      Notification.error(`Không tìm thấy store url meta`);
    }
  },
  watch: {
    customerDetail(newVal, oldValue) {
      if (newVal) {
        const profile = newVal.profile || {}
        this.form.id = newVal.id;
        this.form.gender = profile.gender;
        this.form.avatar = profile.avatar;
        this.form.email = newVal.email || profile.email;
        this.form.fullname = newVal.fullname || profile.fullname;
        this.form.phone = newVal.phone;

        this.customerAddresses = newVal.addresses;
        this.customerCoupons = newVal.coupons.map(r => {
          let value = '';
          switch (r.discountType) {
            case 'percentage':
              value = this.$util.formatMoney(r.discountValue) + ' %';
              break;
            case 'fixed_amount':
              value = this.$util.formatMoney(r.discountValue) + ' VNĐ';
              break;
            case 'free_shipping':
            default:
              value = 'N/A';
              break;
          }
          r.value = value;
          const isAvailable = r.isActive && (Date.now() <= new Date(r.expiredDate).getTime());
          r.statusCusCoupon = isAvailable ? 'available' : 'unavailable';
          return r;
        });
      }
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
</style>
