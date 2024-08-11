<template lang="html">
  <div class="row">    
    <form class="offset-xl-2 col-xl-8 col-md-12" data-vv-scope="form">
      <div class="card">
        <div class="card-header">
          <h6 class="title">{{$t('el.formCardTitle.flashSale')}}</h6>
        </div>
        <div class="card-body form-card">
          <p>
            <strong>Lưu ý:</strong> <i> mỗi sản phẩm chỉ được nằm trong một chương trình flashsale, và thời gian giữa các flashsale không được chồng chéo lên nhau.</i>
          </p>
          <div class="row">
            <div class="col-sm-12 p-0">
              <label class="required">{{$t('el.formCard.title')}}</label>
              <el-input
                type="text"
                class="full-width"
                data-vv-name="form.title"
                v-model="form.title"
                v-validate="'required'"
                :placeholder="$t('el.formCard.title')"
                :class="errors.has('form.title')?'border-danger':''"
                :data-vv-as="$t('el.formCard.title')"
              >
              </el-input>
              <span class="text-danger" v-if="errors.has('form.title')">{{ errors.first('form.title') }}</span>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12 p-0">
              <label>{{$t('el.formCard.image')}}</label>
              <my-image-upload-single v-model="form.image"></my-image-upload-single>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12 p-0">
              <label>{{$t('el.formCard.description')}}</label>
              <my-editor
                v-model="form.description"
              ></my-editor>
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
              <label class="required">{{$t('el.formCard.activeDates')}}</label>
              <el-date-picker
                unlink-panels
                align="left"
                class="full-width"
                type="datetimerange"
                data-vv-name="form.start_end"
                value-format="yyyy/MM/dd H:m:s"
                v-model="form.startEnd"
                v-validate="'required|earlier'"
                :picker-options="pickerOptions"
                :range-separator="$t('el.datepicker.to')"
                :start-placeholder="$t('el.datepicker.startDate')"
                :end-placeholder="$t('el.datepicker.endDate')"
                :data-vv-as="$t('el.formCard.activeDates')"
                :class="errors.has('form.start_end')?'border-danger':''"
              >
              </el-date-picker>
              <span class="text-danger" v-if="errors.has('form.start_end')">{{ errors.first('form.start_end') }}</span>
            </div>
          </div>
          <div class="row">
            <el-switch v-model="form.isActive" :active-value='true' :inactive-value='false' :active-text="$t('el.formCard.isActive')">
            </el-switch>
          </div>
        </div>
      </div>
    </form>
    <form class="offset-xl-2 col-xl-8 col-md-12" data-vv-scope="formProduct">
      <div class="card">
        <div class="card-header">
          <h6 class="title">{{$t('el.formCardTitle.applyFor')}}
            <el-button class="pull-right" type="primary" @click="addProduct" :disabled="!canAddProduct">{{$t('el.button.add')}}</el-button>
          </h6>
        </div>
        <div class="card-body">
          <div class="row mb-4">
            <div class="col-sm-12">
              <label>{{$t('el.formCard.product')}}</label>
              <select-ajax
                key="products"
                v-model="formProduct.product"
                :attribute="{type: 'products', field: 'name', key: 'id', valueKey: null, extraQuery: {hasFlashsale: 'false'}}"
              >
              </select-ajax>
            </div>
          </div>
          <div class="row mb-4">
            <div class="col-sm-6">
              <label>{{$t('el.formCard.price')}}</label>
              <br/>
              <div class="el-input__inner border-0 px-0">
                <span>{{this.formProduct.rangePrice}}</span>
              </div>
            </div>
            <div class="col-sm-6">
              <label class="required">{{$t('el.formCard.salePrice')}}</label>
              <my-money
                fixed=0
                data-vv-name="formProduct.salePrice"
                v-model="formProduct.salePrice"
                v-validate="`required|min_value:0|max_value:${formProduct.maxPrice}`"
                :disabled="!formProduct.productId"
                :placeholder="$t('el.formCard.salePrice')"
                :class="errors.has('formProduct.salePrice')?'border-danger':''"
                :data-vv-as="$t('el.formCard.salePrice')"
              >
                <span slot="append">VNĐ</span>
              </my-money>
              <span class="text-danger" v-if="errors.has('formProduct.salePrice')">{{ errors.first('formProduct.salePrice') }}</span>
            </div>
            <!-- <div class="col-sm-6">
              <label class="required">{{$t('el.formCard.usageLimitQty')}}</label>
              <el-input
                type="text"
                class="full-width"
                data-vv-name="formProduct.usageLimitQty"
                v-model="formProduct.usageLimitQty"
                v-validate="'required|min_value:1'"
                :disabled="!formProduct.productId"
                :placeholder="$t('el.formCard.usageLimitQty')"
                :class="errors.has('formProduct.usageLimitQty')?'border-danger':''"
                :data-vv-as="$t('el.formCard.usageLimitQty')"
              >
              </el-input>
              <span class="text-danger" v-if="errors.has('formProduct.usageLimitQty')">{{ errors.first('formProduct.usageLimitQty') }}</span>
            </div>           -->
          </div>
          <hr />
          <div class="row" style="margin: 0 -15px; !important">
            <div class="col-sm-12 p-0">
              <my-table
                ref="table"
                :columnDefs="columnDefs"
                v-bind:data-rows="products"
                :actions="actions"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  
    </form>
    <div class="container-fluid">
      <div class="page-action">
        <el-button @click="cancel">{{$t('el.button.cancel')}}</el-button>
        <el-button type="primary" @click="save">{{$t('el.button.create')}}</el-button>
      </div>
    </div>
    <el-dialog
      :title="$t('el.pageTitle.productUpdate')"
      :visible.sync="dialogFormUpdateVisible"
      width="765px"
      @keyup.enter.native="updateProduct"
      @closed="closeUpdateProduct"
    >
      <el-form :model="formUpdateProduct" label-width="140px" data-vv-scope="formUpdateProduct">
        <el-form-item :label="$t('el.formCard.product')">
          <el-input
            v-model="formUpdateProduct.name"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('el.formCard.price')">
          <div class="el-input__inner border-0 px-0">
            <span>{{this.formUpdateProduct.rangePrice}}</span>
          </div>
        </el-form-item>
        <el-form-item :label="$t('el.formCard.salePrice')">
          <my-money
            fixed=0
            data-vv-name="salePrice"
            v-model="formUpdateProduct.salePrice"
            v-validate="`required|min_value:0|max_value:${formUpdateProduct.maxPrice}`"
            :placeholder="$t('el.formCard.salePrice')"
            :class="errors.has('formUpdateProduct.salePrice')?'border-danger':''"
            :data-vv-as="$t('el.formCard.salePrice')"
          >
            <span slot="append">VNĐ</span>
          </my-money>
          <span class="text-danger" v-if="errors.has('formUpdateProduct.salePrice')">{{ errors.first('formUpdateProduct.salePrice') }}</span>
        </el-form-item>
        <!-- <el-form-item :label="$t('el.formCard.usageLimitQty')">
          <el-input
            type="text"
            class="full-width"
            data-vv-name="usageLimitQty"
            v-model="formUpdateProduct.usageLimitQty"
            v-validate="'required|min_value:1'"
            :placeholder="$t('el.formCard.usageLimitQty')"
            :class="errors.has('usageLimitQty')?'border-danger':''"
            :data-vv-as="$t('el.formCard.usageLimitQty')"
          >
          </el-input>
          <span class="text-danger" v-if="errors.has('formUpdateProduct.usageLimitQty')">{{ errors.first('formUpdateProduct.usageLimitQty') }}</span>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormUpdateVisible = false">{{$t('el.button.cancel')}}</el-button>
        <el-button :loading="saveLoading" type="primary" @click="updateProduct">{{$t('el.button.update')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  Button, Input, DatePicker, Switch, MessageBox, Dialog, Form, FormItem, Col, Notification
} from 'element-ui';
import MyMoney from 'src/components/UIComponents/Money';
import MyEditor from 'src/components/UIComponents/Editor';
import MySelect from 'src/components/UIComponents/Select';
import FormCard from 'src/components/UIComponents/FormCard';
import MyTable from 'src/components/UIComponents/Table.vue';
import SelectAjax from 'src/components/UIComponents/SelectAjax';
import MyImageUploadSingle from 'src/components/UIComponents/ImageUploadSingle';
import dtHelper from 'src/helpers/datatable';
import productSchemas from './product-schemas';
import notiScheduleFormGroup from './notification-schedule-form';

export default {
  components: {
    ElForm: Form,
    ElInput: Input,
    ElDialog: Dialog,
    ElButton: Button,
    ElSwitch: Switch,
    ElFormItem: FormItem,
    ElDatePicker: DatePicker,
    FormCard,
    MyMoney,
    MyTable,
    MyEditor,
    MySelect,
    SelectAjax,
    MyImageUploadSingle
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
    })    
  },
  data() {
    const initFiledArrays = ['image', 'title', 'regularPrice', 'salePrice', 'dateOnSaleFrom', 'dateOnSaleTo'];
    return {
      columnDefs: dtHelper.buildInitFields(productSchemas, initFiledArrays),
      dialogFormUpdateVisible: false,
      saveLoading: false,
      form: {
        isActive: true,
        startEnd: '',
      },
      formProduct: {
        productId: '',
        rangePrice: 0,
        regularPrice: 0,
        salePrice: 0,
        salePercent: 0,
        usageLimitQty: 999999,
      },
      formUpdateProduct: {
        productId: '',
        rangePrice: 0,
        regularPrice: 0,
        salePrice: 0,
        salePercent: 0,
        usageLimitQty: 999999,
      },
      products: [],
      actions: [
        {
          type: 'primary',
          icon: 'fa-solid fa-pen-to-square',
          title: 'edit',
          callback: this.showUpdateProductForm,
        },
        {
          type: 'danger',
          icon: 'fa-solid fa-xmark',
          title: 'delete',
          callback: this.removeProduct,
        },
      ],
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
      }
    };
  },
  mounted() {
    this.$store.dispatch('setPageTitle', 'flashsaleCreate');
    this.$store.dispatch('setCurrentActions', [{
      label: 'create',
      type: 'primary',
      icon: '',
      callback: this.save,
    }]);
  },
  computed: {
    canAddProduct() {
      return this.formProduct.productId && this.formProduct.salePrice && this.formProduct.usageLimitQty
    }
  },
  methods: {
    cancel() {
      this.$router.push({ name: 'AllCampaigns' });
    },
    addProduct() {
      this.$validator.validateAll('formProduct').then((result) => {
        if (result) {
          const images = this.formProduct.product.images;
          const product = {
            ...this.formProduct,
            id: this.formProduct.productId,
            image: images.length && images[0].medium,
          }
          const index = this.products.findIndex(p => {
            return p.id == product.id;
          });
          if (index != -1) {
            this.products.splice(index, 1);
          }
          this.products.unshift(product);
          this.resetFormProduct();
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
    removeProduct(index, row) {
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        this.products.splice(index, 1);
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
    updateProduct() {
      const form = this.formUpdateProduct;
      const product = this.products.find(p => p.id == form.productId);
      if (product) {
        product.salePrice = form.salePrice;
        product.usageLimitQty = form.usageLimitQty;
      }
      this.closeUpdateProduct(); 
    },
    async save() {
      this.$validator.validateAll('form').then((result) => {
        if (result) {
          if (!this.products || !this.products.length) {
            return Notification ({
              title: 'Warning',
              message: 'Vui lòng chọn ít nhất một sản phẩm',
              position: 'bottom-right',
              type: 'warning'
            });
          }
          const start_end = this.form.startEnd;
          const data = {
            ...this.form,
            startDate: new Date(start_end[0]).getTime(),
            expiredDate: new Date(start_end[1]).getTime(),
            image: this.form.image,
            products: this.products.map(p => {
              return {
                id: p.id,
                salePrice: p.salePrice,
                usageLimitQty: p.usageLimitQty,
              }
             })
          }
          this.$store.dispatch('storeFlashsale', data)
          .then((res) => {
            Notification ({
              title: 'Success',
              message: 'Create succeeded',
              position: 'bottom-right',
              type: 'success',
            });
            setTimeout(() => {
              this.$router.push('/flashsale/' + res.id);
            }, 1000);
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
    resetFormProduct() {
      this.formProduct.productId = '';
      this.formProduct.product = '';
      this.formProduct.variants = [];
      this.formProduct.name = '';
      this.formProduct.maxPrice = 0;
      this.formProduct.regularPrice = 0;
      this.formProduct.salePrice = 0;
      this.formProduct.image = '';
      this.formProduct.usageLimitQty = 1;
    },
    showUpdateProductForm(index, row) {
      this.formUpdateProduct  = {
        productId: row.id,
        name: row.name,
        rangePrice: row.rangePrice,
        salePrice: row.salePrice,
        usageLimitQty: row.usageLimitQty,
        ...this.mapProductToForm(row),
      };
      this.dialogFormUpdateVisible = true;
    },
    mapProductToForm(product) {
      const minMaxPrice = product.variants.reduce((minMax, v) => {
        minMax[0] = Math.min(minMax[0], v.regularPrice);
        minMax[1] = Math.max(minMax[1], v.regularPrice);
        return minMax;
      }, [Infinity, -Infinity]);
      const rangePrice = minMaxPrice[0] !== minMaxPrice[1] 
        ? minMaxPrice.map(price => this.$util.formatMoney(price) + ' đ').join(' - ')
        : this.$util.formatMoney(minMaxPrice[0]) + ' đ';
      const maxPrice = Math.max(...minMaxPrice);
      return {rangePrice, maxPrice};
    },
    closeUpdateProduct() {
      this.dialogFormUpdateVisible = false;
      this.formUpdateProduct  = {
        productId: '',
        name: '',
        rangePrice: '',
        salePrice: 0,
        maxPrice: 0,
        image: '',
        usageLimitQty: 1,
      };
    },
  },
  watch: {
    'formProduct.product': function (newVal, oldVal) {
      if (newVal) {
        const product = newVal;
        this.formProduct.productId = product.id;
        this.formProduct.name = product.name;
        this.formProduct.variants = product.variants;
        this.formProduct.image = product.images.length && product.images[0] || '';
        const minMaxPrice = product.variants.reduce((minMax, v) => {
          minMax[0] = Math.min(minMax[0], v.regularPrice);
          minMax[1] = Math.max(minMax[1], v.regularPrice);
          return minMax;
        }, [Infinity, -Infinity]);
        this.formProduct.rangePrice = minMaxPrice[0] !== minMaxPrice[1] 
          ? minMaxPrice.map(price => this.$util.formatMoney(price) + ' đ').join(' - ')
          : this.$util.formatMoney(minMaxPrice[0]) + ' đ';
        this.formProduct.maxPrice = Math.max(...minMaxPrice);
      } else {
        this.resetFormProduct();
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
  button.is-disabled {
    opacity: 0.5;
  }
</style>