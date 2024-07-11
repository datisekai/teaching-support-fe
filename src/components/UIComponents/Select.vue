<template lang="html">
  <el-select
    class="full-width"
    v-model="selectValues"
    :multiple="isMultiple"
    :filterable="isFilterable"
    :placeholder="placeholder"
    @input="val => { this.$emit('input', val); this.$emit('change', val) }"
    :disabled="disabled == true"
    clearable
  >
    <el-option
      v-for="item in attribute.options"
      :key="item.value"
      :label="$t(`el.selectOptions.${item.title}`)"
      :value="item.value"
      >
    </el-option>
  </el-select>
</template>

<script>
  import {Select, Option} from 'element-ui'

  export default {
    props: ['attribute', 'value', 'placeholder', 'disabled'],
    components: {
      ElSelect: Select,
      ElOption: Option
    },
    computed: {
      isMultiple() {
        return  this.attribute.multiple === undefined ? this.$util.isMultiple(this.attribute.type) : this.attribute.multiple;
      },
      isFilterable() {
        return this.attribute.filterable ? true : false;
      },
      selectValues: {
        get() {
          return this.value;
        },
        set(value){}
      }
    },
  }
</script>

<style lang="css">
  .el-select > .el-input {
    outline: 0;
  }
  .el-select-dropdown {
    margin-top: 4px !important;
  }
  .el-select .el-input:hover .el-input__icon, .el-select .el-input:hover input{
    color: #606266 !important;
  }
</style>
