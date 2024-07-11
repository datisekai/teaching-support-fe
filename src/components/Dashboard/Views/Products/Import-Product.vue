<template>
  <div class="row">
    <div class="col-lg-6 col-md-6 col-sm-12">
      <div class="card">
        <div class="card-header">
          <h6 class="title">Sản phẩm</h6>
        </div>
        <div class="card-body form-card">
          <el-upload
            class="upload-demo"
            drag
            :action="host + '/admin/api/v4/import_simple_product'"
            :on-success="handleSuccessProduct"
            :on-progress="showLoading"
            accept=".xlsx, .xls, .csv"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
            <div class="el-upload__tip float-left" slot="tip">Chấp nhận files xlsx, xls, csv</div>
            <div class="el-upload__tip float-right" slot="tip">
              <a :href="host + '/static/nhap_san_pham.xlsx'" download>File mẫu</a>
            </div>
          </el-upload>
        </div>
      </div>
    </div>
    <div class="col-lg-6 col-md-6 col-sm-12">
      <div class="card">
        <div class="card-header">
          <h6 class="title">Hình ảnh</h6>
        </div>
        <div class="card-body form-card">
          <el-upload
            class="upload-demo"
            drag
            :action="host + '/admin/api/v4/uploadProductImage'"
            :on-success="handleSuccessImage"
            :on-progress="showLoading"
            accept=".zip"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
            <div class="el-upload__tip" slot="tip">Chấp nhận file zip</div>
          </el-upload>
        </div>
      </div>
    </div>
    <loading :active.sync="isLoading" :is-full-page="fullPage">
    </loading>
  </div>
</template>
<script>
import { Message, Button, Upload } from 'element-ui';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';


export default {
  components: {
    ElButton: Button,
    ElUpload: Upload,
    Loading
  },
  computed: {
  },
  data() {
    return {
      host: process.env.VUE_APP_API_BASE_URL,
      isLoading: false,
      fullPage: false
    };
  },
  mounted() {
    this.$store.dispatch('setPageTitle', 'Nhập sản phẩm');
  },
  methods: {
    showLoading(event, file, fileList) {
      this.isLoading = true;
      this.fullPage = true;
    },
    handleSuccessProduct(response, file, fileList) {
      this.isLoading = false;
      this.fullPage = false;
      if (response.success) {
        Message({
          message: 'Nhập sản phẩm thành công',
          type: 'success',
        });
      } else {
        Message({
          message: 'Có lỗi xảy ra, có lỗi xảy ra, xin vui lòng thử lại',
          type: 'error',
        });
      }
    },
    handleSuccessImage(response, file, fileList) {
      this.isLoading = false;
      this.fullPage = false;
      if (!response.code) {
        Message({
          message: 'Nhập hình ảnh thành công',
          type: 'success',
        });
      } else {
        Message({
          message: response.message,
          type: 'error',
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
  .el-upload{
    width: 100%;
  }
  .el-upload-list__item-status-label,
  .el-upload-list__item-name,
  .el-progress.el-progress--line {
    display: none !important;
  }
</style>
