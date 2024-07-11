<template>
  <div class="row">
    <div class="card" style="width: 100%">
      <div class="card-body">
        <codemirror
          v-model="code"
          :options="cmOption"
        ></codemirror>
      </div>
    </div>
    <el-dialog title="Phục hồi phiên bản" :visible.sync="dialogFormRestoreVisible" width="30%" @keyup.enter.native="restore">
      <el-form :model="formRestore">
        <el-form-item label="Phiên bản:">
          <my-select
            :attribute="versionCSS"
            placeholder="Chọn phiên bản"
            v-model="formRestore.version"
          ></my-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormRestoreVisible = false">Đóng</el-button>
        <el-button type="primary" @click="restore">Phục hồi</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  Message, Button, Form, FormItem, Dialog,
} from 'element-ui';
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/paraiso-light.css';
import 'codemirror/mode/css/css.js';
import 'codemirror/addon/selection/active-line.js';
import MySelect from 'src/components/UIComponents/Select';
import { mapState } from 'vuex';

export default {
  components: {
    codemirror,
    ElButton: Button,
    ElFormItem: FormItem,
    ElDialog: Dialog,
    ElForm: Form,
    Message,
    MySelect,
  },
  data() {
    return {
      code: '',
      dialogFormRestoreVisible: false,
      formRestore: {},
      listVersion: [],
      cmOption: {
        tabSize: 2,
        styleActiveLine: true,
        lineNumbers: true,
        viewportMargin: 50,
        line: true,
        mode: 'text/css',
        theme: 'paraiso-light',
      },
    };
  },
  computed: {
    ...mapState({
      customCSS: state => state.customCSS,
      versionCSS: state => state.versionCSS,
    }),
  },
  mounted() {
    this.$store.dispatch('fetchCSS');
    this.$store.dispatch('fetchVersionCSS');

    this.$store.dispatch('setPageTitle', 'Tùy biến CSS');
    this.$store.dispatch('setCurrentActions', [{
      label: 'Cập nhật',
      type: 'primary',
      icon: '',
      callback: this.save,
    }]);
  },
  methods: {
    showRestore() {
      this.dialogFormRestoreVisible = true;
    },
    restore() {
      const self = this;
      this.$store.dispatch('loadCSSData', self.formRestore.version).then((result) => {
        self.dialogFormRestoreVisible = false;
      }, (error) => {
        Message({
          message: 'Có lỗi xảy ra',
          type: 'error',
        });
      });
    },
    save() {
      this.$store.dispatch('updateCSS', this.code).then((res) => {
        Message({
          message: 'Cập nhật thành công',
          type: 'success',
        });
      }, (res) => {
        Message({
          message: res.message,
          type: 'error',
        });
      });
    },
  },
  watch: {
    customCSS(newValue, oldValue) {
      this.code = newValue;
    },
  },
  destroyed() {
    this.$store.dispatch('setCurrentActions', []);
    this.$store.state.customCSS = [];
  },
};
</script>
<style lang="scss">
  .CodeMirror {
    height: 500px;
  }
</style>
