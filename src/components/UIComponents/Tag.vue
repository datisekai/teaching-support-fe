<template lang="html">
  <div>
    <el-tag
      :key="tag"
      v-for="tag in dynamicTags"
      closable
      :disable-transitions="false"
      type="info"
      @close="handleClose(tag)"
    >
      {{tag}}
    </el-tag>
    <el-input
      class="input-new-tag"
      v-model="inputValue"
      ref="saveTagInput"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
      @input="val => this.$emit('input', dynamicTags)"
      placeholder="Thêm tag"
      size="medium"
    >
    </el-input>
  </div>
</template>

<script>
  import {Tag, Input, Button} from 'element-ui'

  export default {
    props: ['value'],
    components: {
      ElTag: Tag,
      ElInput: Input,
      ElButton: Button
    },
    data() {
      return {
        dynamicTags: [],
        inputVisible: false,
        inputValue: ''
      };
    },
    mounted() {
      this.dynamicTags = this.value || [];
    },
    watch: {
      value(newVal, oldVal) {
        this.dynamicTags = newVal || [];
      }
    },
    methods: {
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          if (this.dynamicTags.indexOf(inputValue) == -1) {
            this.dynamicTags.push(inputValue);
          }
        }
        this.inputVisible = false;
        this.inputValue = '';
      }
    }
  }
</script>

<style lang="css" scoped>
  .el-tag {
    margin: 0 10px 0 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 0px;
    vertical-align: bottom;
  }
</style>
