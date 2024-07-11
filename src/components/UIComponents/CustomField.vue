<template lang="html">
  <div class="card">
    <div class="card-header">
      <h6 class="title">Thuộc tính mở rộng</h6>
    </div>
    <div class="card-body form-card">
      <div class="row" v-for="attribute of group" :key="attribute.handle">
        <div class="col-sm-12 p-0">
          <label>
            {{attribute.title}} {{(attribute.input_type == 'image' || attribute.input_type == 'images') ? $util.getImageSize(attribute):'' }}
          </label>
        </div>
        <div class="col-sm-12 p-0">
          <el-input
            v-if="attribute.input_type === 'input'"
            type="text"
            :placeholder="attribute.title"
            class="full-width"
            v-model="value[attribute.handle]"
            :ref="'input-' + attribute.handle"
            @input="val => handleInput(attribute.handle, val)">
          </el-input>

          <el-switch
            v-if="attribute.input_type === 'checkbox'"
            v-model="value[attribute.handle]"
            @input="val => handleInput(attribute.handle, val)"
            active-value="1"
            inactive-value="0">
          </el-switch>

          <el-input
            v-if="attribute.input_type === 'textarea'"
            type="textarea"
            :rows="3"
            :placeholder="attribute.label"
            v-model="value[attribute.handle]"
            @input="val => handleInput(attribute.handle, val)">
          </el-input>

          <my-editor
            v-if="attribute.input_type === 'editor'"
            :key="attribute.prop"
            @input="val => handleInput(attribute.handle, val)"
            v-model="value[attribute.handle]"
            heigth=150
          ></my-editor>

          <div v-if="attribute.input_type === 'gallery'">
            <el-select
              placeholder="Chọn..."
              class="full-width"
              @input="val => handleInput(attribute.handle, val)"
              v-model="value[attribute.handle]"
              value-key="handle"
              clearable
            >
              <el-option
                v-if="attribute.options"
                v-for="item in attribute.options"
                :key="item.handle"
                :label="item.title"
                :value="item.handle"
              >
              </el-option>
            </el-select>
          </div>

          <el-select
            v-if="attribute.input_type === 'select'"
            placeholder="Chọn..."
            class="full-width"
            @input="val => handleInput(attribute.handle, val)"
            v-model="value[attribute.handle]"
            :value="value[attribute.handle]"
            clearable
          >
            <el-option
              v-if="attribute.options"
              v-for="item in attribute.options"
              :key="item.handle"
              :label="item.title"
              :value="item.handle"
            >
            </el-option>
          </el-select>

          <el-select
            v-if="attribute.input_type === 'select-multiple'"
            placeholder="Chọn..."
            multiple
            class="full-width"
            @input="val => handleInput(attribute.handle, val)"
            v-model="value[attribute.handle]"
            clearable
          >
            <el-option
              v-for="item in attribute.options"
              :key="item.id"
              :label="item.title"
              :value="item.handle">
            </el-option>
          </el-select>

          <div v-if="attribute.input_type === 'image'">
            <image-custom
              v-model="value[attribute.handle]"
              :value="value[attribute.prop]"
              @input="val => handleInput(attribute.handle, val)"
            ></image-custom>
          </div>

          <div v-if="attribute.input_type === 'images'">
            <image-custom
              multiple="true"
              v-model="value[attribute.handle]"
              @input="val => handleInput(attribute.handle, val)"
            ></image-custom>
          </div>

          <!-- number -->
          <div v-if="attribute.input_type === 'number'">
            <el-input
              type="number"
              :placeholder="attribute.label"
              class="full-width"
              v-model="value[attribute.handle]"
              @input="val => handleInput(attribute.prop, val)">
            </el-input>
          </div>

          <!-- money -->
          <div v-if="attribute.input_type === 'money'">
            <my-money
              :placeholder="attribute.label"
              fixed=0
              v-model="value[attribute.handle]"
              @input="val => handleInput(attribute.handle, val)"
            >
              <template slot="append">VNĐ</template>
            </my-money>
          </div>

          <!-- date -->
          <div v-if="attribute.input_type === 'date'">
            <el-date-picker
              class="full-width"
              type="date"
              :placeholder="attribute.label"
              v-model="value[attribute.handle]"
              @input="val => handleInput(attribute.handle, val)">
            </el-date-picker>
          </div>

          <!-- radio -->
          <div v-if="attribute.input_type === 'radio'">
            <el-radio
              v-model="value[attribute.handle]"
              @input="val => handleInput(attribute.handle, val)"
              v-for="(option, index) in attribute.options"
              :label="option.value"
              :key="option.value + index"
            >{{option.title}}
            </el-radio>
          </div>

          <!-- map -->
          <my-map
            v-if="attribute.input_type === 'maps'"
            v-model="value[attribute.handle]"
            @input="val => handleInput(attribute.handle, val)"
          ></my-map>

          <!--file-->
          <my-file
            v-if="attribute.input_type === 'file'"
            v-model="value[attribute.handle]"
            @input="val => handleInput(attribute.handle, val)"
          >
          </my-file>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Select, Option, Button, Tag, Input, Tabs, TabPane, Upload, DatePicker, Switch, Radio, MessageBox, Dialog} from 'element-ui'
  import Editor from '@tinymce/tinymce-vue'
  import SelectAjax from 'src/components/UIComponents/SelectAjax'
  import MySelect from 'src/components/UIComponents/Select'
  import MyMap from 'src/components/UIComponents/Map'
  import MyTag from 'src/components/UIComponents/Tag'
  import MyMoney from 'src/components/UIComponents/Money'
  import ImageCustom from 'src/components/UIComponents/ImageCustomField.vue'
  import MyFile from 'src/components/UIComponents/File.vue'
  import MyEditor from 'src/components/UIComponents/Editor'

  export default {
    inject: ['$validator'],
    props: ['group', 'hasTop', 'value'],
    data() {
      return {
        ajaxTypes: [
          'product', 'collection', 'article', 'blog', 'page', 'galleries', 'roles',
          'products', 'collections', 'articles', 'blogs', 'pages', 'gallery', 'role'
        ],
        imageUrl: '',
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
      ElDialog: Dialog,
      editor: Editor,
      SelectAjax,
      MySelect,
      MyMap,
      MyTag,
      MyMoney,
      MyFile,
      MyEditor,
      ImageCustom,
    },
    computed: {
      generateUrl() {
        return location.protocol + '//' + location.host;
      }
    },
    methods: {
      handleInput(field, val) {
        let oldValue = this.value[field];
        this.$emit('input', this.value);
        this.$emit('field-update', field, val, oldValue);
      }
    }
  }
</script>
