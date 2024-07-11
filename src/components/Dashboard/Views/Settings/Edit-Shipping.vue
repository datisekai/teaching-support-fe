<template>
  <div class="row">
    <div class="col-xs-12 col-sm-4">
      <div class="card">
        <div class="card-header">
          <h6 class="title">CHỌN TỈNH/THÀNH PHỐ</h6>
        </div>
        <div class="card-body form-card">
          <my-select
            class="full-width"
            placeholder="Chọn Tỉnh/Thành phố"
            v-model="region"
            :attribute="regionList"
          >
          </my-select>
        </div>
      </div>
    </div>
    <div class="col-xs-12 col-sm-8" v-if="region">
      <div class="row" style="margin-bottom: 10px">
        <el-button type="primary" icon="el-icon-plus" @click="dialogFeeVisible=true">Thêm phương thức</el-button>
      </div>
      <div class="row">
        <div class="card full-width" v-for="item of shippingDetail">
          <div class="card-header">
            <h6 class="title pull-left">{{item.title}}</h6>
            <div class="pull-right">
              <p-button class="margin-0" size="sm" icon @click="edit(item)" type="primary">
                <i class="nc-icon nc-ruler-pencil"></i>
              </p-button>
              <p-button class="margin-0" size="sm" icon @click="remove(item)" type="danger">
                <i class="nc-icon nc-simple-remove"></i>
              </p-button>
            </div>
          </div>
          <div class="clearfix"></div>
          <div class="card-body form-card">
            <p v-if="item.type=='all'">Áp dụng cho mọi đơn hàng</p>
            <div v-else>
              <p>Tính theo: Khoảng giá (VNĐ)</p>
              <p>Áp dụng cho đơn hàng có tổng giá trị từ {{$util.formatMoney(item.from)}}đ đến {{$util.formatMoney(item.to)}}đ</p>
            </div>
            <p>Chi phí: {{$util.formatMoney(item.price)}}đ</p>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="Thêm phương thức"
      :visible.sync="dialogFeeVisible"
      width="40%"
      top="5vh"
      @keyup.enter.native="save"
    >
      <el-form :model="formShipping">
        <el-form-item label="Tên phương thức vận chuyển:">
          <el-input
            placeholder="Tên phương thức vận chuyển"
            v-model="formShipping.title"
            :class="errors.has('title')?'border-danger':''"
            v-validate="'required'"
            data-vv-name="title"
            data-vv-as="Tên"
          ></el-input>
          <span class="text-danger" v-if="errors.has('title')">{{ errors.first('title') }}</span>
        </el-form-item>
        <el-form-item label="Tính theo tổng giá trị đơn hàng:"></el-form-item>
        <el-row :gutter="20">
          <el-col :span="7">
            <my-select
              class="full-width"
              placeholder="Chọn loại"
              :attribute="typeShipping"
              v-model="formShipping.type"
              :class="errors.has('type')?'border-danger':''"
              v-validate="'required'"
              data-vv-name="type"
              data-vv-as="Loại"
            >
            </my-select>
            <span class="text-danger" v-if="errors.has('type')">{{ errors.first('type') }}</span>
          </el-col>
          <el-col :span="7" :offset="2" v-if="formShipping.type == 'price'">
            <el-input
              placeholder="Từ"
              v-model="formShipping.from"
              :disabled="formShipping.type=='all'? true : false"
              :class="errors.has('from')?'border-danger':''"
              type="number"
              v-validate="'required|min_value:0'"
              data-vv-name="from"
              data-vv-as="Giá trị từ"
            ></el-input>
            <span class="text-danger" v-if="errors.has('from')">{{ errors.first('from') }}</span>
          </el-col>
          <el-col :span="7" :offset="1" v-if="formShipping.type == 'price'">
            <el-input
              placeholder="Đến"
              v-model="formShipping.to"
              :disabled="formShipping.type=='all'? true : false"
              :class="errors.has('to')?'border-danger':''"
              type="number"
              v-validate="'required|min_value:0'"
              data-vv-name="to"
              data-vv-as="Giá trị đến"
            ></el-input>
            <span class="text-danger" v-if="errors.has('to')">{{ errors.first('to') }}</span>
          </el-col>
        </el-row>
        <div class="clearfix"></div>
        <el-form-item label="Chi phí:">
          <el-input
            v-model="formShipping.price"
            type="number"
            placeholder="Chi phí"
            :class="errors.has('price')?'border-danger':''"
            v-validate="'required|min_value:0'"
            data-vv-name="price"
            data-vv-as="Chi phí"
          ></el-input>
          <span class="text-danger" v-if="errors.has('price')">{{ errors.first('price') }}</span>
        </el-form-item>
        <el-form-item label="Quận/Huyện:" v-if="subRegionList.length"></el-form-item>
        <el-row
          :gutter="20"
          v-for="item of subRegionList"
          :key="item.subregion_id"
          style="margin-bottom: 5px"
        >
          <el-col :span="11">
            <el-input
              disabled
              :placeholder="item.name"
            ></el-input>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-input
              placeholder="Nhập phí vận chuyển"
              v-model="item.price"
              :class="errors.has(item.name)?'border-danger':''"
              type="number"
              v-validate="'min_value:0'"
              :data-vv-name="item.name"
              data-vv-as="Giá"
            ></el-input>
            <span class="text-danger" v-if="errors.has(item.name)">{{ errors.first(item.name) }}</span>
          </el-col>
        </el-row>
        <div class="clearfix"></div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFeeVisible = false">Đóng</el-button>
        <el-button type="primary" @click="save">Thêm</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Chỉnh sửa phương thức"
      :visible.sync="dialogEditFeeVisible"
      width="40%"
      top="5vh"
      @keyup.enter.native="update"
    >
      <el-form :model="formEditShipping">
        <el-form-item label="Tên phương thức vận chuyển:">
          <el-input
            placeholder="Tên phương thức vận chuyển"
            v-model="formEditShipping.title"
            :class="errors.has('title')?'border-danger':''"
            v-validate="'required'"
            data-vv-name="title"
            data-vv-as="Tên"
          ></el-input>
          <span class="text-danger" v-if="errors.has('title')">{{ errors.first('title') }}</span>
        </el-form-item>
        <el-form-item label="Tính theo tổng giá trị đơn hàng:">

        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="7">
            <my-select
              class="full-width"
              placeholder="Chọn loại"
              :attribute="typeShipping"
              v-model="formEditShipping.type"
            >
            </my-select>
          </el-col>
          <el-col :span="7" :offset="2" v-if="formEditShipping.type == 'price'">
            <el-input
              placeholder="Từ"
              v-model="formEditShipping.from"
              :disabled="formEditShipping.type=='all'? true : false"
              :class="errors.has('from')?'border-danger':''"
              type="number"
              v-validate="'required|min_value:0'"
              data-vv-name="from"
              data-vv-as="Giá trị từ"
            ></el-input>
            <span class="text-danger" v-if="errors.has('from')">{{ errors.first('from') }}</span>
          </el-col>
          <el-col :span="7" :offset="1" v-if="formEditShipping.type == 'price'">
            <el-input
              placeholder="Đến"
              v-model="formEditShipping.to"
              :disabled="formEditShipping.type=='all'? true : false"
              :class="errors.has('to')?'border-danger':''"
              type="number"
              v-validate="'required|min_value:0'"
              data-vv-name="to"
              data-vv-as="Giá trị đến"
            ></el-input>
            <span class="text-danger" v-if="errors.has('to')">{{ errors.first('to') }}</span>
          </el-col>
        </el-row>
        <div class="clearfix"></div>
        <el-form-item label="Chi phí:">
          <el-input
            v-model="formEditShipping.price"
            placeholder="Chi phí"
            :class="errors.has('price')?'border-danger':''"
            v-validate="'required|min_value:0'"
            type="number"
            data-vv-name="price"
            data-vv-as="Chi phí"
          ></el-input>
          <span class="text-danger" v-if="errors.has('price')">{{ errors.first('price') }}</span>
        </el-form-item>
        <el-form-item label="Quận/Huyện:" v-if="subRegionList.length"></el-form-item>
        <el-row
          :gutter="20"
          v-for="item of subRegionList"
          :key="item.subregion_id"
          style="margin-bottom: 5px"
        >
          <el-col :span="11">
            <el-input
              disabled
              :placeholder="item.name"
            ></el-input>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-input
              placeholder="Nhập phí vận chuyển"
              v-model="item.price"
              :class="errors.has(item.name)?'border-danger':''"
              type="number"
              v-validate="'min_value:0'"
              :data-vv-name="item.name"
              data-vv-as="Giá"
            ></el-input>
            <span class="text-danger" v-if="errors.has(item.name)">{{ errors.first(item.name) }}</span>
          </el-col>
        </el-row>
        <div class="clearfix"></div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditFeeVisible = false">Đóng</el-button>
        <el-button type="primary" @click="update">Cập nhật</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  MessageBox, Message, Input, Button, Dialog, Form, FormItem, Select, Option, Col, Row,
} from 'element-ui';
import MySelect from 'src/components/UIComponents/Select';
import { mapState } from 'vuex';

export default {
  components: {
    ElInput: Input,
    ElButton: Button,
    ElDialog: Dialog,
    ElForm: Form,
    ElFormItem: FormItem,
    ElSelect: Select,
    ElOption: Option,
    ElCol: Col,
    ElRow: Row,
    Message,
    MessageBox,
    MySelect,
  },
  async beforeCreate() {
    await this.$store.dispatch('setPageTitle', 'Cập nhật phí vận chuyển');
    await this.$store.dispatch('fetchRegion');
  },
  computed: {
    ...mapState({
      shippingDetail: state => state.shippingDetail,
    }),
    regionList() {
      const data = this.$store.state.region;
      const arr = {};
      arr.options = [];
      arr.options.push({
        value: 100,
        title: 'Tất cả tỉnh thành',
      });
      for (const item of data) {
        arr.options.push({
          value: item.id,
          title: item.name,
        });
      }
      return arr;
    },
    subRegionList() {
      const data = this.$store.state.subRegion;
      const arr = [];
      for (const item of data) {
        arr.push({
          name: item.name,
          subregion_id: item.id,
          price: '',
        });
      }
      return arr;
    },
  },
  data() {
    return {
      dialogFeeVisible: false,
      dialogEditFeeVisible: false,
      formEditShipping: {},
      region: 0,
      formShipping: {},
      typeShipping: {
        options: [{
          value: 'all',
          title: 'Tất cả đơn hàng',
        }, {
          value: 'price',
          title: 'Khoảng giá (VNĐ)',
        },
        ],
      },
    };
  },
  mounted() {
    this.region = this.$route.params.id - 0;
    this.$store.dispatch('fetchListSubRegion', this.region);
    this.$store.dispatch('fetchShippingDetail', this.region);
  },
  methods: {
    cancel() {
      this.$router.push({ name: 'Shipping' });
    },
    edit(data) {
      const self = this;
      self.formEditShipping = {};
      this.$store.dispatch('fetchShippingEdit', data.id).then((result) => {
        if (result.data) {
          const data = result.data;
          const subregion = result.subregion;
          this.subRegionList.forEach((attr) => {
            subregion.forEach((item) => {
              if (attr.subregion_id == item.subregion_id) {
                attr.price = item.price;
              }
            });
          });
          self.formEditShipping = data;
        }
        self.dialogEditFeeVisible = true;
      });
    },
    remove(data) {
      const self = this;
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        this.$store.dispatch('removeShipping', data.id).then((res) => {
          Message({
            type: 'success',
            message: 'Đã xóa phương thức',
          });
          self.$store.dispatch('fetchShippingDetail', this.region);
        }).catch((err) => {
          Message({
            type: 'error',
            message: err.message,
          });
        });
      });
    },
    save() {
      const self = this;
      self.formShipping.region_id = this.region;
      const data = {
        data: self.formShipping,
        subRegion: self.subRegionList.filter(item => item.price),
      };
      this.$validator.validateAll().then((result) => {
        if (result) {
          self.$store.dispatch('storeShipping', data).then((result) => {
            Message({
              type: 'success',
              message: 'Tạo thành công',
            });
            self.dialogFeeVisible = false;
            self.$store.dispatch('fetchShippingDetail', self.region);
          }).catch((error) => {
            Message({
              type: 'error',
              message: error.message,
            });
          });
        }
      });
    },
    update() {
      const self = this;
      const data = {
        data: self.formEditShipping,
        subRegion: self.subRegionList.filter(item => item.price),
      };
      this.$validator.validateAll().then((result) => {
        if (result) {
          self.$store.dispatch('updateShipping', data).then((result) => {
            Message({
              type: 'success',
              message: 'Cập nhật thành công',
            });
            self.dialogEditFeeVisible = false;
            self.$store.dispatch('fetchShippingDetail', self.region);
          }).catch((error) => {
            Message({
              type: 'error',
              message: error.message,
            });
          });
        }
      });
    },
  },
  watch: {
    region(newValue, oldValue) {
      this.$store.dispatch('fetchListSubRegion', this.region);
      this.$store.dispatch('fetchShippingDetail', this.region);
    },
  },
};
</script>
<style lang="scss">
  .margin-0{
    margin-top: 0;
    margin-bottom: 0;
  }
</style>
