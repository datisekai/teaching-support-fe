<template lang="html">
  <div class="image-uploader" :class="multiple?'full-width':''">
    <div class="list-image row">
      <div class="item-image" v-for="item of data" :style="{backgroundImage: `url(${host}${item.src})`}">
        <div v-if="!disabled">
          <span class="remove" @click="removeItem(item)">
            <i class="fa fa-times"></i>
          </span>
        </div>
        <div v-if="feautureImage && !disabled" class="active-feauture-image" @click="chooseFeautureImage(item)" :class="item.id==feautureImage?'active':''">
          Hình đại diện
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    props: ['data', 'multiple', 'feautureImage', 'externalLink', 'disabled'],
    data() {
      return {
        image: '',
        files: {},
      }
    },
    computed: {
      host(){
        return this.externalLink ? '' : process.env.VUE_APP_API_BASE_URL;
      }
    },
    methods: {
      chooseFeautureImage(item){
        this.$emit('changeFeautureImage', item.id);
        this.feautureImage = item.id;
      },
      removeItem(item){
        let new_value = this.data.filter(image => {
          return image.id != item.id
        })
        this.$emit('input', new_value);
      },
      remove() {
        this.data = '';
        this.$emit('input', this.data);
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
    background-size: contain;
    border: 1px dashed #ccc;
    background-position: center center;
    background-repeat: no-repeat;
    margin-right: 3px;
    height: 180px;
    width: 180px;
    position: relative;
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
    height: 180px;
    max-width: 300px;
  }
</style>
