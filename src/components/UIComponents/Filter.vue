<template lang="html">
  <div class="filter-group">
    <div class="col-sm-12" v-if="available_filters.length">
      <el-tag 
        v-for="tag in available_filters"
        :hidden="!tag.show"
        :key="tag.key"
        :type="'filter'"
        :disable-transitions="false"
        >
          <b>{{tag.name}}</b>
          {{tag.ope}}
          <span class="value">{{(Number.isFinite(tag.value) || tag.value == null) ? tag.value : `"${tag.value}"`}}</span>
          <i class="el-tag__close el-icon-plus" @click="addAvailableFilter(tag)"></i>
      </el-tag>
    </div>
    <div class="col-12">
      <div class="row d-none d-sm-none d-md-none d-lg-flex">
        <div class="col-lg-3 col-md-6 col-sm-6 filter-col">
          <el-select
            class="full-width"
            v-model="currentFilter"
            default-first-option
          >
            <el-option
              v-for="(item, index) of rules"
              :key="item.value"
              :label="$t(`el.tableHeader.${item.name}`)"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
        <div class="col-lg-3 col-md-6 col-sm-6 filter-col">
          <el-select
            class="full-width"
            v-if="currentFilter"
            v-model="currentOpe"
            default-first-option
          >
            <el-option
              v-for="op of currentFilter.ops"
              :key="op.value"
              :label="$t(op.name)"
              :value="op"
              >
            </el-option>
          </el-select>
        </div>
        <div class="col-lg-3 col-md-6 col-sm-6 filter-col">
          <el-select
            v-if="currentFilter.type === 'select'"
            class="full-width"
            v-model="selectedOption"
            @keyup.enter.native="handleAddFilter"
            default-first-option
          >
            <el-option
              v-for="fv of filterValues"
              :key="fv.value"
              :label="$t(`el.selectOptions.${fv.title}`)"
              :value="fv"
              >
            </el-option>
          </el-select>
          <el-date-picker
            v-else-if="currentFilter.type === 'date'"
            class="full-width"
            type="date"
            align="left"
            placeholder="Date"
            v-model="inputValue"
          >
          </el-date-picker>
          <el-input
            v-else
            class="full-width"
            :type="currentFilter.type == 'number' ? 'number' : 'text'"
            v-model="inputValue"
            @keyup.enter.native="handleAddFilter"
            ref="saveTagInput"
            :placeholder="$t('el.filter.placeholder')"
          ></el-input>
        </div>
        <div class="col-lg-3 col-md-6 col-sm-6 filter-col">
          <p-button class="full-width" @click="handleAddFilter">
            <i class="fa fa-plus"></i>
              {{$t('el.button.addFilter')}}
          </p-button>
        </div>
      </div>
      <div class="d-flex d-sm-flex d-md-flex d-lg-none d-xl-none m-t-4">
        <el-button class="full-width" type="primary" @click="modal.display=true">
          <i class="fa fa-plus"></i>
          {{$t('el.button.filter')}}
        </el-button>
      </div>
    </div>
    <div class="col-12" v-if="tags.length > 0">
      <el-tag
        v-for="tag in tags"
        :key="tag.name + tag.ope + tag.value"
        closable @close="handleClose(tag)"
        :type="'filter'">
          <b>{{$t(`el.tableHeader.${tag.name}`)}}</b>
          {{$t(tag.ope)}}
          <!-- <span class="value">{{tag.type == 'number' ? $util.formatMoney(tag.value) : `"${tag.value}"`}}</span> -->
          <span class="value">{{renderTag(tag.type, tag.value)}}</span>
      </el-tag>
    </div>
    <modal :show.sync="modal.display" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up m-0">{{$t('el.button.filter')}}</h4>
      <div class="row">
        <div class="col-sm-12 m-b-5">
          <el-select
            class="full-width"
            v-model="currentFilter"
            default-first-option
          >
            <el-option
              v-for="(item, index) of rules"
              :key="item.value"
              :label="$t(`el.tableHeader.${item.name}`)"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
        <div class="col-sm-12 m-b-5">
          <el-select
            class="full-width"
            v-if="currentFilter"
            v-model="currentOpe"
            default-first-option
          >
            <el-option
              v-for="op of currentFilter.ops"
              :key="op.value"
              :label="$t(op.name)"
              :value="op"
            >
            </el-option>
          </el-select>
        </div>
        <div class="col-sm-12 m-b-5">
          <el-select
            class="full-width"
            v-if="currentFilter.type === 'select'"
            v-model="selectedOption"
            @keyup.enter.native="handleAddFilter"
            default-first-option
          >
            <el-option
              v-for="fv of filterValues"
              :key="fv.value"
              :label="fv.title"
              :value="fv"
            >
            </el-option>
          </el-select>

          <el-input
            class="full-width"
            v-if="currentFilter.type !== 'select'"
            :type="currentFilter.type == 'number' ? 'number' : 'text'"
            v-model="inputValue"
            @keyup.enter.native="handleAddFilter"
            ref="saveTagInput"
            :placeholder="$t('el.filter.placeholder')"
          ></el-input>
        </div>
      </div>
      <div class="text-right">
        <p-button @click.native="modal.display = false">{{$t('el.button.cancel')}}</p-button>
        <p-button type="primary" @click="handleAddFilter">{{$t('el.button.apply')}}</p-button>
      </div>
    </modal>
  </div>
</template>

<script>
  import {Select, Option, Button, Tag, Input, Message} from 'element-ui'
  import Modal from './Modal'

  export default {
    components: {
      ElSelect: Select,
      ElOption:Option,
      ElButton:Button,
      ElTag:Tag,
      ElInput:Input,
      Modal
    },
    props: {
      rules: {
        type: Array,
        default: () => {
          return [];
        }
      },
      availableFilters: {
        type: Array,
        default: () => {
          return [];
        }
      }
    },
    data() {
      return {
        currentOpe: {},
        selectedOption: {},
        currentFilter: {},
        filterValues: [],
        available_filters: [],
        tags: [],
        inputValue: '',
        output: [],
        modal: {
          display: false
        }
      };
    },
    computed: {
      currentValue() {
        if (this.currentFilter.type === 'select') {
          return this.selectedOption.value
        }
        return this.inputValue
      },
      currentLabel() {
        if (this.currentFilter.type === 'select') {
          return this.selectedOption.title
        }
        return this.inputValue
      }
    },
    watch: {
      currentFilter(newVal, oldVal) {
        if (newVal.type === 'select') {
          this.filterValues = newVal.values;
          this.selectedOption = newVal.values[0];
        } else {
          this.filterValues = [];
        }
        this.currentOpe = newVal.ops[0];
      },
      currentOpe(newVal, oldVal) {
        if (newVal.value == 'empty') {
          let tag = {
            name: this.currentFilter.name,
            ope: this.currentOpe.name,
            value: null,
            type: 'empty'
          }
          tag.key = tag.name + tag.ope + tag.value;
          this.addTag(tag);
          let filter = {
            filter: this.currentFilter.value,
            ope: this.currentOpe.value,
            value: 'N/A',
            type: this.currentFilter.type
          }
          this.addFilter(filter);
          this.currentOpe = this.currentFilter.ops[0];
        } 
      }
    },
    methods: {
      handleClose(tag) {
        tag.show = true
        let index = this.tags.indexOf(tag);
        this.tags.splice(index, 1);
        this.output.splice(index, 1);
        this.$emit('filter-change', this.output);
      },
      addAvailableFilter(tag) {
        this.addTag(tag);
        let filter = {
          filter: tag.prop,
          ope: tag.opeValue,
          value: tag.value,
          type: tag.type
        }
        this.addFilter(filter);
      },
      handleAddFilter() {
        let tag = {
          prop: this.currentFilter.value,
          name: this.currentFilter.name,
          ope: this.currentOpe.name,
          value: this.currentLabel,
          type: this.currentFilter.type
        }
        tag.key = tag.name + tag.ope + tag.value;
        this.addTag(tag);
        let filter = {
          filter: this.currentFilter.value,
          ope: this.currentOpe.value,
          value: this.currentValue,
          type: this.currentFilter.type
        }
        this.addFilter(filter);
      },
      addTag(tag) {
        this.available_filters.forEach(f => {
          if (f.prop == tag.prop) {
            f.show = true
          }
        })
        tag.show = false
        this.tags = this.tags.filter((x) => {
          return x.prop != tag.prop;
        });
        this.tags.push(tag);
      },
      addFilter(filter) {
        this.output = this.output.filter((x) => {
          return x.filter != filter.filter;
        });
        this.output.push(filter);
        this.$emit('filter-change', this.output);
        this.selectedOption = '';
        this.inputValue = '';
      },
      renderTag(type, value) {
        if (value == null || value == 'empty') {
          return '';
        }
        switch (type) {
          case 'empty':
            return '';
          case 'number':
            return this.$util.formatNumber(value);
          case 'money':
            return this.$util.formatMoney(value);
          case 'date': 
            return this.$util.formatDateTime(value);
          case 'select':
            return '"'+this.$t(`el.selectOptions.${value}`)+'"';
          case 'text':
          default:
            return `"${value}"`
        }
      }
    },
    mounted(){
      this.currentFilter = this.rules[0];
      this.available_filters = this.availableFilters.map(f => {
        return {
          ...f,
          show: true
        }
      })
    }
  }
</script>


<style lang="css">

  .filter-col {
    padding: 6px;
  }

  .filter-group {
    padding-top: 15px;
  }

  .filter-col:first-of-type{
    padding-left: 15px
  }

  .filter-col:last-of-type{
    padding-right: 15px
  }

  .el-tag--filter {
    background-color: #f8f9fa !important;
    color: #000 !important;
    margin: 0;
    margin-top: 10px;
  }
  .el-tag--filter .value {
    color: #007bff !important;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag input {
    height: 40px;
    line-height: 40px;
  }
  button.full-width{
    margin: 2px;
  }
  .el-select .el-input:hover .el-input__icon, .el-select .el-input:hover input{
    color: #606266 !important;
  }
  .el-input__inner:hover::placeholder {
    color: #c0c4cc !important;
  }
  .m-b-5{
    margin-bottom: 5px;
  }
  .m-t-4{
    margin-top: 4px;
  }
  .el-tag--filter {
    background-color: #f8f9fa !important;
    color: #000 !important;
    margin: 0px;
  }
  .el-tag--filter .value {
    color: #007bff !important;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag input {
    height: 40px;
    line-height: 40px;
  }
  button.full-width{
    margin: 2px;
  }
  .el-select .el-input:hover .el-input__icon, .el-select .el-input:hover input{
    color: #ccc !important;
  }
  .el-input__inner:hover::placeholder {
    color: #c0c4cc !important;
  }
  .el-tag .el-icon-plus {
    border-radius: 50%;
    text-align: center;
    position: relative;
    cursor: pointer;
    font-size: 12px;
    height: 16px;
    width: 16px;
    line-height: 16px;
    vertical-align: middle;
    top: -1px;
    right: -5px;
    color: #409EFF;
  }
  .el-tag .el-icon-plus:hover {
    background-color: #409EFF;
    color: #fff;
  }
</style>
