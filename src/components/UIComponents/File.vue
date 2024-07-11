<template lang="html">
  <div>
    <el-button type="primary" @click="dialogXplVisible = true">Chọn file</el-button>
    <ul class="el-upload-list el-upload-list--text" v-if="file">
      <li tabindex="0" class="el-upload-list__item is-success">
        <a class="el-upload-list__item-name">
          <i class="el-icon-document"></i>
          {{file}}
        </a>
        <label class="el-upload-list__item-status-label">
          <i class="el-icon-upload-success el-icon-circle-check"></i>
        </label>
        <i class="el-icon-close" @click="remove"></i>
      </li>
    </ul>

    <el-dialog
      :visible.sync="dialogXplVisible"
      width="85%"
      top="10vh"
      class="dialog-image"
      id="xpl"
      :modalAppendToBody="false"
    >
      <xpl
        @eventClose="close"
        @eventDone="done"
        :mode="mode"
      ></xpl>
    </el-dialog>
  </div>
</template>
<script>
  import {Button, Upload, Dialog} from 'element-ui'
  import xpl from 'src/components/UIComponents/xpl/App'

  export default {
    props: ['value'],
    components: {
      ElUpload: Upload,
      ElButton: Button,
      ElDialog: Dialog,
      xpl
    },
    data() {
      return {
        dialogXplVisible: false
      };
    },
    computed: {
      file: {
        get() {
          if (this.value) return this.value;
          return '';
        },
        set(value){
          this.$emit('input', value);
        }
      },
      mode(){
        let mode = {};
        if (this.multiple) return mode = {
          multiple: false
        }
        return mode;
      },
    },
    methods: {
      close(){
        this.dialogXplVisible = false;
      },
      done(files){
        this.file = files[0].name;
        this.$emit('input', files[0].name);
        this.dialogXplVisible = false;
      },
      remove(){
        this.file = '';
      }
    }
  }
</script>
