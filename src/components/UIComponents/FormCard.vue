<template lang="html">
  <div class="card">
    <div class="card-header">
      <h6 class="title">{{$t(`el.formCardTitle.${group.title}`)}}</h6>
    </div>
    <div class="card-body form-card">
      <div class="row" v-for="attribute of group.attributes" :key="attribute.prop">
        <div class="col-sm-12 p-0">
          <label :class="attribute.validate?'required':''">
            {{$t(`el.formCard.${attribute.label}`)}} {{attribute.type == 'image' ? $util.getImageSize(attribute):'' }}
          </label>
        </div>
        <div class="col-sm-12 p-0">
          <!-- text -->
          <div v-if="attribute.type === 'text'">
            <el-input
              type="text"
              class="full-width"
              autocomplete="off"
              v-model="value[attribute.prop]"
              v-validate="attribute.validate?attribute.validate:''"
              :data-vv-name="attribute.prop"
              :data-vv-as="attribute.label"
              :disabled="attribute.disabled"
              :placeholder="attribute.label"
              :ref="'input-' + attribute.prop"
              :class="errors.has(attribute.prop)?'border-danger':''"
              @input="val => handleInput(attribute.prop, val)"
            >
            </el-input>
            <span class="text-danger" v-if="errors.has(attribute.prop)">{{ errors.first(attribute.prop) }}</span>
          </div>
          <div v-if="attribute.type === 'handle'">
            <el-input
              type="text"
              :placeholder="attribute.label"
              class="full-width"
              v-model="value[attribute.prop]"
              :ref="'input-' + attribute.prop"
              @input="val => handleInput(attribute.prop, val)"
              :class="errors.has(attribute.prop)?'border-danger':''"
              v-validate="attribute.validate?attribute.validate:''"
              :data-vv-name="attribute.prop"
              :data-vv-as="attribute.label"
              :disabled="attribute.disabled"
            >
              <span slot="prepend" v-if="windowWidth > 768">{{generateUrl}}/</span>
              <span slot="append"><i @click="updateHandle" class="el-icon-refresh" style="cursor: pointer;"></i></span>
            </el-input>
            <span class="text-danger" v-if="errors.has(attribute.prop)">{{ errors.first(attribute.prop) }}</span>
          </div>
          <div v-if="attribute.type === 'password'">
            <el-input
              type="password"
              class="full-width"
              autocomplete="off"
              v-model="value[attribute.prop]"
              v-validate="attribute.validate?attribute.validate:''"
              :placeholder="attribute.label"
              :disabled="attribute.disabled"
              :data-vv-as="attribute.label"
              :data-vv-name="attribute.prop"
              :ref="'input-' + attribute.prop"
              :class="errors.has(attribute.prop)?'border-danger':''"
              @input="val => handleInput(attribute.prop, val)"
            >
            </el-input>
            <span class="text-danger" v-if="errors.has(attribute.prop)">{{ errors.first(attribute.prop) }}</span>
          </div>
          <!-- number -->
          <div v-if="attribute.type === 'number'">
            <el-input
              type="number"
              :placeholder="attribute.label"
              class="full-width"
              :class="errors.has(attribute.prop)?'border-danger':''"
              v-model="value[attribute.prop]"
              @input="val => handleInput(attribute.prop, val)"
              v-validate="attribute.validate?attribute.validate:''"
              :data-vv-name="attribute.prop"
              :data-vv-as="attribute.label"
              :disabled="attribute.disabled"
            ></el-input>
            <span class="text-danger" v-if="errors.has(attribute.prop)">{{ errors.first(attribute.prop) }}</span>
          </div>

          <!-- money -->
          <div v-if="attribute.type === 'money'">
            <my-money
              :placeholder="attribute.label"
              fixed=0
              v-model="value[attribute.prop]"
              @input="val => handleInput(attribute.prop, val)"
              :class="errors.has(attribute.prop)?'border-danger':''"
              v-validate="attribute.validate?attribute.validate:''"
              :data-vv-name="attribute.prop"
              :data-vv-as="attribute.label"
              :disabled="attribute.disabled"
            >
              <template slot="append">VNĐ</template>
            </my-money>
            <span class="text-danger" v-if="errors.has(attribute.prop)">{{ errors.first(attribute.prop) }}</span>
          </div>

          <!-- date -->
          <div v-if="attribute.type === 'date'">
            <el-date-picker
              class="full-width"
              type="date"
              :placeholder="attribute.label"
              v-model="value[attribute.prop]"
              @input="val => handleInput(attribute.prop, val)"
              v-validate="attribute.validate?attribute.validate:''"
              :data-vv-name="attribute.prop"
              :data-vv-as="attribute.label"
              :disabled="attribute.disabled"
            >
            </el-date-picker>
            <span class="text-danger" v-if="errors.has(attribute.prop)">{{ errors.first(attribute.prop) }}</span>
          </div>

          <div v-if="attribute.type === 'datetime'">
            <el-date-picker
              class="full-width"
              type="datetime"
              :placeholder="attribute.label"
              v-model="value[attribute.prop]"
              @input="val => handleInput(attribute.prop, val)"
              v-validate="attribute.validate?attribute.validate:''"
              :picker-options="attribute.options ? attribute.options : {}"
              :data-vv-name="attribute.prop"
              :data-vv-as="attribute.label"
              :disabled="attribute.disabled"
            >
            </el-date-picker>
            <span class="text-danger" v-if="errors.has(attribute.prop)">{{ errors.first(attribute.prop) }}</span>
          </div>

          <!-- checkbox-->
          <div v-if="attribute.type === 'checkbox'">
            <el-switch
              v-model="value[attribute.prop]"
              @input="val => handleInput(attribute.prop, val)"
              :active-value="true"
              :inactive-value="false"
              :disabled="attribute.disabled"
            >
            </el-switch>
          </div>

          <!-- radio -->
          <div v-if="attribute.type === 'radio'">
            <el-radio
              v-model="value[attribute.prop]"
              @input="val => handleInput(attribute.prop, val)"
              v-for="(option, i) in attribute.options"
              :label="option.value"
              v-validate="attribute.validate?attribute.validate:''"
              :data-vv-name="attribute.prop"
              :data-vv-as="attribute.label"
              :key="option.prop + i"
              :disabled="attribute.disabled"
            >{{option.title}}</el-radio>
            <span class="text-danger" v-if="errors.has(attribute.prop)">{{ errors.first(attribute.prop) }}</span>
          </div>

          <!-- select -->
          <div v-if="attribute.type === 'select'">
            <my-select
              class="full-width"
              v-bind:attribute.sync="attribute"
              :placeholder="attribute.label"
              v-model="value[attribute.prop]"
              @input="val => handleInput(attribute.prop, val)"
              :class="errors.has(attribute.prop)?'border-danger':''"
              v-validate="attribute.validate?attribute.validate:''"
              :data-vv-name="attribute.prop"
              :data-vv-as="attribute.label"
              :disabled="attribute.disabled"
            >
            </my-select>
            <span class="text-danger" v-if="errors.has(attribute.prop)">{{ errors.first(attribute.prop) }}</span>
          </div>

          <!-- textarea -->
          <div v-if="attribute.type === 'textarea'">
            <el-input
              type="textarea"
              :rows="3"
              :placeholder="attribute.label"
              v-model="value[attribute.prop]"
              @input="val => handleInput(attribute.prop, val)"
              :class="errors.has(attribute.prop)?'border-danger':''"
              v-validate="attribute.validate?attribute.validate:''"
              :data-vv-name="attribute.prop"
              :data-vv-as="attribute.label"
              :disabled="attribute.disabled"
            >
            </el-input>
            <span class="text-danger" v-if="errors.has(attribute.prop)">{{ errors.first(attribute.prop) }}</span>
          </div>

          <!-- editor -->
          <div v-if="attribute.type === 'editor'">
            <my-editor
              :key="attribute.prop"
              @input="val => handleInput(attribute.handle, val)"
              v-model="value[attribute.prop]"
              :class="errors.has(attribute.prop)?'border-danger':''"
              v-validate="attribute.validate?attribute.validate:''"
              :data-vv-name="attribute.prop"
              :data-vv-as="attribute.label"
              :disabled="attribute.disabled"
            ></my-editor>
            <span class="text-danger" v-if="errors.has(attribute.prop)">{{ errors.first(attribute.prop) }}</span>
          </div>

          <!-- image-upload-single -->

          <div v-if="attribute.type === 'image-single'">
            <image-upload-single
              v-model="value[attribute.prop]"
              :value="value[attribute.prop]"
              @input="val => handleInput(attribute.prop, val)"
              v-validate="attribute.validate?attribute.validate:''"
              :data-vv-name="attribute.prop"
              :data-vv-as="attribute.label"
              :disabled="attribute.disabled"
            ></image-upload-single>
            <span class="text-danger" v-if="errors.has(attribute.prop)">{{ errors.first(attribute.prop) }}</span>
          </div>

          <!-- image -->
          <div v-if="attribute.type === 'image'">
            <my-image
              v-model="value[attribute.prop]"
              :value="value[attribute.prop]"
              @input="val => handleInput(attribute.prop, val)"
              v-validate="attribute.validate?attribute.validate:''"
              :data-vv-name="attribute.prop"
              :data-vv-as="attribute.label"
              :disabled="attribute.disabled"
            ></my-image>
            <span class="text-danger" v-if="errors.has(attribute.prop)">{{ errors.first(attribute.prop) }}</span>
          </div>

          <!-- source -->
          <div v-if="$_.includes(ajaxTypes, attribute.type)">
            <select-ajax
              v-bind:attribute.sync="attribute"
              v-model="value[attribute.prop]"
              @input="val => handleInput(attribute.prop, val)"
              v-validate="attribute.validate?attribute.validate:''"
              :data-vv-name="attribute.prop"
              :data-vv-as="attribute.label"
              :disabled="attribute.disabled"
            >
            </select-ajax>
            <span class="text-danger" v-if="errors.has(attribute.prop)">{{ errors.first(attribute.prop) }}</span>
          </div>

          <!-- map -->
          <my-map
            v-if="attribute.type=='maps'"
            v-model="value[attribute.prop]"
            :disabled="attribute.disabled"
          >
          </my-map>

          <!-- tag -->
          <div v-if="attribute.type === 'tag'">
            <my-tag
              v-model="value[attribute.prop]"
              @input="val => handleInput(attribute.prop, val)"
              v-validate="attribute.validate?attribute.validate:''"
              :data-vv-name="attribute.prop"
              :data-vv-as="attribute.label"
              :disabled="attribute.disabled"
            ></my-tag>
            <span class="text-danger" v-if="errors.has(attribute.prop)">{{ errors.first(attribute.prop) }}</span>
          </div>

          <!--file-->
          <my-file
            v-if="attribute.type === 'file'"
            v-model="value[attribute.handle]"
            @input="val => handleInput(attribute.handle, val)"
            :disabled="attribute.disabled"
          >
          </my-file>
        </div>
      </div>

      <div v-if="$slots.default">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
  import {Select, Option, Button, Tag, Input, Tabs, TabPane, Upload, DatePicker, Switch, Radio, Dialog} from 'element-ui'
  import Editor from '@tinymce/tinymce-vue'
  import SelectAjax from 'src/components/UIComponents/SelectAjax'
  import MySelect from 'src/components/UIComponents/Select'
  import MyMap from 'src/components/UIComponents/Map'
  import MyTag from 'src/components/UIComponents/Tag'
  import MyMoney from 'src/components/UIComponents/Money'
  import MyImage from 'src/components/UIComponents/Image.vue'
  import MyFile from 'src/components/UIComponents/File.vue'
  import xpl from 'src/components/UIComponents/xpl/App'
  import MyEditor from 'src/components/UIComponents/Editor'
  import ImageUploadSingle from 'src/components/UIComponents/ImageUploadSingle'

  export default {
    inject: ['$validator'],
    props: ['group', 'hasTop', 'value'],
    data() {
      return {
        ajaxTypes: [
          'product', 'collection', 'page', 'categories',
          'products', 'collections', 'pages', 'category'
        ],
        imageUrl: '',
        windowWidth: 0,
      }
    },
    components: {
      ElSelect: Select,
      ElOption: Option,
      ElButton: Button,
      ElTag: Tag,
      ElInput: Input,
      ElTabs: Tabs,
      ElTabPane: TabPane,
      ElUpload: Upload,
      ElDatePicker: DatePicker,
      ElSwitch: Switch,
      ElRadio: Radio,
      editor: Editor,
      ElDialog: Dialog,
      xpl,
      ImageUploadSingle,
      SelectAjax,
      MySelect,
      MyMap,
      MyTag,
      MyMoney,
      MyImage,
      MyFile,
      MyEditor,
    },
    computed: {
      generateUrl() {
        return location.protocol + '//' + location.host;
      }
    },
    mounted() {
      this.$nextTick(function() {
        window.addEventListener('resize', this.getWindowWidth);

        this.getWindowWidth();
      })

    },
    methods: {
      handleInput(field, val) {
        let oldValue = this.value[field];
        this.$emit('input', this.value);
        this.$emit('field-update', field, val, oldValue);
      },
      updateHandle(){
        this.$emit('updateHandle');
      },
      getWindowWidth(event) {
        this.windowWidth = document.documentElement.clientWidth;
      }
    }
  }
</script>
