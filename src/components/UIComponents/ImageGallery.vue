<template lang="html">
  <div class="image-uploader" :class="multiple?'full-width':''">
    <div class="list-image row" v-if="multiple">
      <div v-if="!editPhoto" class="col-3" style="padding: 0 5px;">
        <div tabindex="0" class="el-upload el-upload--text box-select-image">
          <label>
            <i class="el-icon-plus image-uploader-icon"></i>
            <input type="file" multiple accept="image/*" class="el-upload__input" @click.prevent="showXPL">
          </label>
        </div>
      </div>
      <div :class="editPhoto ? 'col-12' : 'col-9'">
        <div class="row item-image" v-if="value" v-for="item of value">
          <div class="col-sm-4">
            <img v-if="editPhoto" :src="`${host}/uploads/` + item.image">
            <img v-else :src="`${host}/uploads/` + item.name">
          </div>
          <div class="col-sm-8">
            <el-input
              v-if="hasTitle"
              v-model="item.title"
              class="image-title"
              placeholder="Tiêu đề">
            </el-input>
            <select-link
              :link="item.link"
              :linkType="item.link_type"
              @selectLink= "val=>updateLink(item, val)"
              @selectLinkType= "val=>updateLinkType(item, val)">
            </select-link>
            <el-button v-if="!editPhoto" style="margin-top: 10px;" size="medium" type="danger" @click="removeItem(item)">Xóa hình ảnh</el-button>
            <el-switch
              style="margin-top: 10px;"
              v-if="editPhoto"
              v-model="item.status"
              inactive-text="Hiển thị"
              active-value="active"
              inactive-value="inactive">
            </el-switch>
          </div>
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
  import { Dialog, Input, Button, Select, Switch } from 'element-ui';
  import MySelect from 'src/components/UIComponents/Select';
  import SelectLink from 'src/components/UIComponents/SelectLink.vue';
  import $ from 'jquery';

  export default {
    props: ['value', 'multiple', 'hasTitle', 'hasLink', 'editPhoto'],
    components: {
      xpl,
      ElDialog: Dialog,
      ElInput: Input,
      ElButton: Button,
      ElSwitch: Switch,
      MySelect,
      SelectLink

    },
    data() {
      return {
        image: '',
        dialogXplVisible: false,
        showRemoveImage: false,
        files: {}
      }
    },
    computed: {
      valueImage: {
        get(){
          return this.value;
        },
        set(value) {
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
      removeItem(item){
        this.value = this.value.filter(image => {
          return image.name != item.name
        })
        this.$emit('input', this.value);
      },
      remove() {
        this.value = '';
        this.$emit('input', this.value);
      },
      updateLink(item, val) {
        item.link = val;
      },
      updateLinkType(item, val) {
        item.link_type = val;
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
<style lang="scss">
  .dialog-image .el-dialog__headerbtn {
    top: 5px;
    right: 10px;
  }
  .dialog-image .el-dialog__header {
    padding-top: 0px !important;
    display: none !important;
  }
  .dialog-image .el-dialog__body {
    padding-top: 0px !important;
  }
  #xpl .el-dialog .el-dialog__body {
    padding-top: 0px !important;
  }

  .list-image {
    margin: 0px;
    flex-wrap: nowrap;
    overflow-y: auto;
  }

  .list-image .item-image {
    margin-bottom: 20px;
    img {
      max-width: 100%;
      max-height: 180px;
    }
    .image-title {
      margin-bottom: 10px;
    }
    .image-link {
      margin-bottom: 10px;
    }
  }

  label {
    cursor: pointer;
    margin-bottom: 0;
  }

  .image-detail {
    width: 300px;
  }

  .block-remove {
    position: absolute;
    z-index: 99;
    color: red;
    right: 6px;
    font-size: 20px;
  }

  .box-select-image, .box-select-image label, .box-select-image i, .el-upload--text, .el-upload--text .image-detail{
    width: 100%;
    max-width: 300px;
  }

</style>
