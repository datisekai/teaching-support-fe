<template>
  <div class="row">
    <div class="card full-width">
      <div class="card-header">
        <h6 class="title">Thông tin khách hàng</h6>
      </div>
      <div class="card-body form-card">
        <div class="row">
          <div class="col-sm-12 p-0">
            <label>Họ tên: </label>
          </div>
          <div class="col-sm-12 p-0">
            <el-input
              v-model="form.name"
              :class="errors.has('name')?'border-danger':''"
              v-validate="'required'"
              data-vv-name="name"
              data-vv-as="Tên"
            ></el-input>
            <span class="text-danger" v-if="errors.has('name')">{{ errors.first('name') }}</span>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 p-0">
            <label>Email: </label>
          </div>
          <div class="col-sm-12 p-0">
            <el-input
              v-model="form.email"
              :class="errors.has('email')?'border-danger':''"
              v-validate="'required|email'"
              data-vv-name="email"
              data-vv-as="Email"
            ></el-input>
            <span class="text-danger" v-if="errors.has('email')">{{ errors.first('email') }}</span>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 p-0">
            <label>Số điện thoại: </label>
          </div>
          <div class="col-sm-12 p-0">
            <el-input v-model="form.phone"></el-input>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 p-0">
            <label>Địa chỉ: </label>
          </div>
          <div class="col-sm-12 p-0">
            <el-input v-model="form.address"></el-input>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 p-0">
            <label>Tỉnh/Thành phố: </label>
          </div>
          <div class="col-sm-12 p-0">
            <my-region
              v-model="form.dataRegion"
              :regionID="form.region"
              :subRegionID="form.subregion"
            ></my-region>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  Select, Option, Button, Tabs, TabPane, Input, Message,
} from 'element-ui';
import MyRegion from 'src/components/UIComponents/Region.vue';

export default {
  components: {
    ElSelect: Select,
    ElOption: Option,
    ELButton: Button,
    ElTabs: Tabs,
    ElTabPane: TabPane,
    ElInput: Input,
    MyRegion,
    Message,
  },
  data() {
    return {
      form: {
        region: '',
        subregion: '',
      },
    };
  },
  mounted() {
    this.$store.dispatch('setPageTitle', 'Tạo khách khách hàng');
    this.$store.dispatch('setCurrentActions', [{
      label: 'Tạo mới',
      type: 'primary',
      icon: '',
      callback: this.save,
    }]);
  },
  methods: {
    save() {
      const self = this;
      this.$validator.validateAll().then((result) => {
        if (result) {
          self.form.region = self.form.dataRegion.region;
          self.form.subregion = self.form.dataRegion.subRegion;
          self.form.company = '';
          self.$store.dispatch('storeCustomer', self.form).then((res) => {
            Message({
              message: 'Tạo thành công',
              type: 'success',
            });
            self.$store.dispatch('fetchCustomers');
            self.$router.push({ name: 'AllCustomers' });
          }, (res) => {
            Message({
              message: res.message,
              type: 'error',
            });
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
</style>
