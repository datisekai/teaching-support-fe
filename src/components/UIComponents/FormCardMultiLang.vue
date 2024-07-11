<template lang="html">
  <div class="card">
    <div class="card-header">
      <h6 class="title">{{group.title}}</h6>
    </div>
     <el-tabs v-model="activeTab" v-if="group['attributes_en'] && group['attributes_en'].length">
      <el-tab-pane :label='languageTitles["vi"]' name="vi">
        <div class="card-body form-card">
          <div class="row" v-for="attribute of group.attributes" :key="attribute.prop">
            <div class="col-sm-12 p-0">
              <label :class="attribute.validate?'required':''">
                {{attribute.label}} {{attribute.type == 'image' ? $util.getImageSize(attribute):'' }}
              </label>
            </div>
            <div class="col-sm-12 p-0">
              <!-- text -->
              <div v-if="attribute.type === 'text'">
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
                >
                  <template slot="prepend" v-if="attribute.prop==='handle' && windowWidth > 768">{{generateUrl}}/</template>
                  <template slot="append" v-if="attribute.prop==='handle'"><i @click="updateHandle(attribute.prop, 'vi')" class="el-icon-refresh" style="cursor: pointer;"></i></template>
                </el-input>
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
                ></my-editor>
                <span class="text-danger" v-if="errors.has(attribute.prop)">{{ errors.first(attribute.prop) }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane v-for="(lang,index) in languages"  v-if="group['attributes_' + lang] && group['attributes_' + lang].length" v-bind:key="lang" :label="languageTitles[lang]" :name="lang">
        <div class="card-body form-card">
          <div class="row" v-for="attribute of group['attributes_' + lang]" :key="attribute.prop">
            <div class="col-sm-12 p-0">{{attribute.label}}</div>
            <div class="col-sm-12 p-0">
              <!-- text -->
              <div v-if="attribute.type === 'text'">
                <el-input
                  type="text"
                  :placeholder="`${attribute.label} (${lang})`"
                  class="full-width"
                  v-model="value[attribute.prop]"
                  :ref="'input-' + attribute.prop"
                  @input="val => handleInput(attribute.prop, val)"
                >
                  <template slot="prepend" v-if="attribute.prop.indexOf('handle') > -1 && windowWidth > 768">{{generateUrl}}/</template>
                  <template slot="append" v-if="attribute.prop.indexOf('handle') > -1"><i @click="updateHandle(attribute.prop, lang)" class="el-icon-refresh" style="cursor: pointer;"></i></template>
                </el-input>
              </div>

              <!-- textarea -->
              <div v-if="attribute.type === 'textarea'">
                <el-input
                  type="textarea"
                  :rows="3"
                  :placeholder="`${attribute.label} (${lang})`"
                  v-model="value[attribute.prop]"
                  @input="val => handleInput(attribute.prop, val)"
                >
                </el-input>
              </div>

              <!-- editor -->
              <div v-if="attribute.type === 'editor'">
                <my-editor
                  :key="attribute.prop"
                  @input="val => handleInput(attribute.handle, val)"
                  v-model="value[attribute.prop]"
                ></my-editor>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="card-body form-card" v-else>
      <div class="row" v-for="attribute of group.attributes" :key="attribute.prop">
        <div class="col-sm-12 p-0">
          <label :class="attribute.validate?'required':''">
            {{attribute.label}} {{attribute.type == 'image' ? $util.getImageSize(attribute):'' }}
          </label>
        </div>
        <div class="col-sm-12 p-0">
          <!-- text -->
          <div v-if="attribute.type === 'text'">
            <el-input
              type="text"
              :placeholder="attribute.label"
              class="full-width"
              v-model="value[attribute.prop]"
              :ref="'input-' + attribute.prop"
              @input="val => handleInput(attribute.prop, val)"
            >
            </el-input>
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
            ></my-editor>
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
            ></my-image>
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
            >
            </my-select>
            <span class="text-danger" v-if="errors.has(attribute.prop)">{{ errors.first(attribute.prop) }}</span>
          </div>

        </div>
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
        windowWidth: 0,
        activeTab: 'vi',
        languageTitles: {
          'vi': 'Tiếng Việt',
          'en': 'Tiếng Anh',
          'jp': 'Tiếng Nhật'
        }
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
      ElTabs: Tabs,
      ElTabPane: TabPane,
      xpl,
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
      languages() {
        let data = this.$store.state.languages;
        return data;
      },
      generateUrl() {
        return location.protocol + '//' + location.host;
      }
    },
    mounted() {
      this.$nextTick(function() {
        window.addEventListener('resize', this.getWindowWidth);
        this.getWindowWidth();
      });
    },
    methods: {
      handleInput(field, val) {
        let oldValue = this.value[field];
        this.$emit('input', this.value);
        this.$emit('field-update', field, val, oldValue);
      },
      updateHandle(prop, lang = 'vi') {
        this.$emit('updateHandle', prop, lang);
      },
      getWindowWidth(event) {
        this.windowWidth = document.documentElement.clientWidth;
      }
    }
  }
</script>

<style lang="scss">
  .el-tabs__nav {
    float: right;
  }
</style>