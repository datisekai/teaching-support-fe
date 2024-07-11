<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <div class="card">
        <div class="card-body form-card">
          <el-upload
            class="upload-demo"
            drag
            :action="host + '/admin/api/import_order'"
            :on-success="handleSuccess"
            accept=".xlsx, .xls, .csv"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
            <div class="el-upload__tip" slot="tip">Chấp nhận files xlsx, xls, csv</div>
            <div class="el-upload__tip" slot="tip">
              <a :href="host + '/static/nhap_don_hang.xlsx'" download>File mẫu</a>
            </div>
          </el-upload>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Message, Button, Upload } from 'element-ui';

export default {
  components: {
    ElButton: Button,
    ElUpload: Upload,
  },
  computed: {
  },
  data() {
    return {
      host: process.env.VUE_APP_API_BASE_URL,
    };
  },
  mounted() {
    this.$store.dispatch('setPageTitle', 'Nhập đơn hàng');
  },
  methods: {
    handleSuccess(response, file, fileList) {
      if (response.success) {
        Message({
          message: 'Nhập đơn hàng thành công',
          type: 'success',
        });
        this.$router.push({ name: 'AllOrders' });
      } else {
        Message({
          message: 'Có lỗi xảy ra',
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
</style>
