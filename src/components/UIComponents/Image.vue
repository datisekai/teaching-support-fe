<template lang="html">
  <div class="image-uploader" :class="multiple?'full-width':''">
    <div class="list-image row" v-if="multiple">
      <div class="col col-xs-3 col-sm-3" v-if="!disabled" style="padding: 0 5px;">
        <div tabindex="0" class="el-upload el-upload--text box-select-image" style="height: 100%;">
          <label>
            <i class="el-icon-plus image-uploader-icon"></i>
            <input type="file" multiple accept="image/*" class="el-upload__input" @click.prevent="showXPL">
          </label>
        </div>
      </div>
      <div class="col col-xs-3 col-sm-3 item-image" v-if="value" v-for="item of value" :style="{backgroundImage: `url(${host}/uploads/` + item.name + ')'}">
        <div>
          <span class="remove" @click="removeItem(item)">
            <i class="fa fa-times"></i>
          </span>
        </div>
        <div v-if="feautureImage" class="active-feauture-image" @click="chooseFeautureImage(item)" :class="item.name==feautureImage?'active':''">
          Hình đại diện
        </div>
      </div>
    </div>
    <div v-else tabindex="0" class="el-upload el-upload--text" @mouseover="showRemoveImage = true" @mouseleave="showRemoveImage = false">
      <div class="block-remove" v-if="valueImage && showRemoveImage">
        <span class="remove" @click="remove">
          <i class="fa fa-times"></i>
        </span>
      </div>
      <label class="image-detail">
        <img v-if="valueImage" :src="`${host}/uploads/` + valueImage">
        <i v-else class="el-icon-plus image-uploader-icon"></i>
        <input type="file" accept="image/*" class="el-upload__input" @click.prevent="showXPL">
      </label>
    </div>

    <el-dialog
      :visible.sync="dialogXplVisible"
      width="85%"
      top="10vh"
      class="dialog-image"
      id="xpl"
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
  import xpl from 'src/components/UIComponents/xpl/App';
  import { Dialog } from 'element-ui';
  import $ from 'jquery';

  export default {
    props: ['value', 'multiple', 'feautureImage', 'disabled', 'externalLink'],
    components: {
      xpl,
      ElDialog: Dialog
    },
    data() {
      return {
        image: '',
        dialogXplVisible: false,
        showRemoveImage: false,
        files: {},
      }
    },
    computed: {
      valueImage: {
        get(){
          return this.value;
        },
        set(value){
          this.$emit('update:value', value);
        }
      },
      mode(){
        let mode = {};
        if (this.multiple) return mode = {
          multiple: true
        }
        return mode;
      },
      host(){
        return process.env.VUE_APP_API_BASE_URL;
      }
    },
    methods: {
      showXPL(){
        this.dialogXplVisible = true;
        setTimeout(function() {
          $('.v-modal').css('z-index', 2000);
        }, 200);
      },
      close(){
        this.dialogXplVisible = false;
      },
      done(files){
        let self = this;
        if (self.multiple){
          if (!self.value) self.value = files;
          else{
            files.forEach(function (file, index) {
              if (!self.value.filter(item => item.name == file.name).length) self.value.unshift(file);
            })
          }
          this.$emit('input', self.value);
        } else{
          self.image = `${process.env.VUE_APP_API_BASE_URL}/uploads/${files[0].name}`;
          self.valueImage = files[0].name;
          self.$emit('input', files[0].name);
        }
        this.dialogXplVisible = false;
      },
      chooseFeautureImage(item){
        this.$emit('changeFeautureImage', item.name);
        this.feautureImage = item.name;
      },
      removeItem(item){
        this.value = this.value.filter(image => {
          return image.name != item.name
        })
        this.$emit('input', this.value);
      },
      remove() {
        this.value = '';
        this.$emit('input', this.value);
      }
    },
    watch: {
      value(newVal, oldVal) {
        let self = this;
        if (newVal) {
          if (self.multiple) {
            self.image = newVal;
            self.$emit('input', newVal);
          } else {
            self.image = `${process.env.VUE_APP_API_BASE_URL}/uploads/${newVal}`
            self.$emit('input', newVal);
          }
        }
      }
    },
    destroyed(){
      this.image = '';
      this.files = {};
    }
  }
</script>
<style scoped>
  .dialog-image .el-dialog__headerbtn{
    top: 5px;
    right: 10px;
  }
  .dialog-image .el-dialog__header{
    padding-top: 0px !important;
    display: none !important;
  }
  .dialog-image .el-dialog__body{
    padding-top: 0px !important;
  }
  #xpl .el-dialog .el-dialog__body{
    padding-top: 0px !important;
  }

  .list-image{
    margin: 0px;
    flex-wrap: nowrap;
    overflow-y: auto;
  }

  .list-image .item-image{
    border: 1px solid #fff;
    text-align: center;
    background-size: cover;
    border: 1px dashed #ccc;
    background-position: center center;
    background-repeat: no-repeat;
    margin-right: 3px;
  }

  .list-image .item-image .active-feauture-image{
    position: absolute;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    left: 0px;
    color: white;
    padding: 3px;
    cursor: pointer;
  }

  .list-image .item-image .remove{
    position: absolute;
    cursor: pointer;
    right: 5px;
    top: 0;
    color: #dc4a3d;
    z-index: 998;
  }

  label{
    cursor: pointer;
    margin-bottom: 0;
  }

  .image-detail{
    width: 300px;
  }

  .block-remove{
    position: absolute;
    z-index: 99;
    color: red;
    right: 6px;
    font-size: 20px;
  }
  .active-feauture-image{
    position: absolute;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    left: 0px;
    color: white;
    padding: 3px;
    cursor: pointer;
  }

  .active-feauture-image.active {
    background-color: #2196F3 !important;
  }

  .box-select-image, .box-select-image label, .box-select-image i, .el-upload--text, .el-upload--text .image-detail{
    width: 100%;
    max-width: 300px;
  }
</style>
