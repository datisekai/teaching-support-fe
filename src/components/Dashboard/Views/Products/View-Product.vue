<template lang="html">
  <div class="row">
    <div class="col-lg-8 col-md-8 col-sm-12">
      <div v-for="(group, index) of centerGroups" :key="index">
        <form-card-multi-lang
          v-if="languages && languages.length"
          :group="group"
          v-model="form"
          @updateHandle="updateHandle"
        ></form-card-multi-lang>
        <form-card
          v-else
          :group="group"
          v-model="form"
          @updateHandle="updateHandle"
        ></form-card>
        <div class="card" v-if="index == 0">
          <div class="card-header">
            <h6 class="title">Hình ảnh</h6>
          </div>
          <div class="card-body form-card">
            <div class="row">
              <image-upload-multi v-model="form.images"></image-upload-multi>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <h6 class="title">Thuộc tính sản phẩm</h6>
          </div>
          <div class="card-body form-card">
            <div
              class="row"
              v-for="(attribute, index) of form.attributes"
              :key="index"
            >
              <div class="col-sm-12 p-0">
                <label>Thuộc tính {{ index + 1 }}</label>
              </div>
              <div class="col-sm-4 p-0">
                <my-select
                  :attribute="{
                    options: pickableProductAttributes,
                    multiple: false
                  }"
                  placeholder="Chọn thuộc tính"
                  v-model="attribute.name"
                  :disabled="attribute.disabled"
                  @change="() => resetSelect(index)"
                >
                </my-select>
              </div>
              <div class="col-sm-7 pl-4">
                <my-select
                  :attribute="productAttributeOptions(attribute)"
                  placeholder="Chọn tùy chọn thuộc tính"
                  v-model="attribute.values"
                  :disabled="attribute.disabled"
                >
                </my-select>
              </div>
              <div v-if="!attribute.disabled">
                <el-button
                  :style="{ height: '100%' }"
                  size="small"
                  type="primary"
                  icon="el-icon-refresh-left"
                  @click="() => resetSelect(index, true)"
                ></el-button>
              </div>
            </div>
          </div>
          <hr />
          <div class="card-header">
            <h6 class="title">Biến thể</h6>
          </div>
          <my-table
            ref="table"
            :columnDefs="columnDefs"
            :actions="actions"
            v-bind:data-rows="dataTable"
          />
        </div>
      </div>
      <custom-field
        v-if="customField.length > 0"
        :group="customField"
        :value="custom_field"
        v-model="custom_field"
      ></custom-field>
    </div>
    <div class="col-lg-4 col-md-4 col-sm-12">
      <div v-for="(group, index) of sideGroups" :key="index">
        <form-card hasTop="true" :group="group" v-model="form"> </form-card>
      </div>
    </div>
    <el-dialog
      :title="`Biến thể - ${priceForm.name}`"
      :visible.sync="dialogModalVariant"
      class="dialogModalVariant"
    >
      <my-money
        placeholder="Giá"
        fixed="0"
        v-model="priceForm.regularPrice"
        :class="errors.has('price') ? 'border-danger' : ''"
        v-validate="'required'"
        data-vv-name="price"
        data-vv-as="Giá"
      >
        <span slot="append">VNĐ</span>
      </my-money>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogModalVariant = false">Hủy</el-button>
        <el-button type="primary" @click="updatePriceVariant"
          >Cập nhật</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FormCard from "src/components/UIComponents/FormCard.vue";
import FormCardMultiLang from "src/components/UIComponents/FormCardMultiLang.vue";
import CustomField from "src/components/UIComponents/CustomField.vue";
import { Message, Input, Button, Switch, DatePicker, Dialog } from "element-ui";
import MyTable from "src/components/UIComponents/Table.vue";
import MySelect from "src/components/UIComponents/Select";
import MyImage from "src/components/UIComponents/Image";
import MyMoney from "src/components/UIComponents/Money";
import dataFrom from "./product-form";
import dtHelper from "src/helpers/datatable";
import ImageUploadMulti from "src/components/UIComponents/ImageUploadMulti";
import variantSchema from "./variant-schema";

const _form = {};
const _custom_field = {};
let firstGroups;
let secondGroups;

export default {
  components: {
    FormCard,
    FormCardMultiLang,
    ElInput: Input,
    ElSwitch: Switch,
    ElButton: Button,
    ElDatePicker: DatePicker,
    ElDialog: Dialog,
    ImageUploadMulti,
    MySelect,
    MyTable,
    MyMoney,
    MyImage,
    Message,
    CustomField
  },
  beforeCreate() {
    firstGroups = dataFrom[0].groups;
    secondGroups = dataFrom[1].groups;
    firstGroups.forEach(group => {
      if (group.languages && group.languages.length) {
        group.languages.forEach(lang => {
          group["attributes_" + lang] = [];
          let arr = [];
          group.attributes.forEach(attr => {
            arr.push({
              prop: attr.prop + "_" + lang,
              label: attr.label,
              type: attr.type
            });
          });
          group["attributes_" + lang] = arr;
          group["attributes_" + lang].forEach(attr => {
            _form[attr.prop] = "";
            attr.value = _form[attr.prop];
          });
        });
      }

      group.attributes.forEach(attr => {
        if (attr.multiple && _form[attr.prop]) {
          _form[attr.prop] = [];
        } else {
          _form[attr.prop] = "";
        }
        attr.value = _form[attr.prop];
      });
    });

    secondGroups.forEach(group => {
      group.attributes.forEach(attr => {
        if (attr.multiple && _form[attr.prop]) {
          _form[attr.prop] = [];
        } else {
          _form[attr.prop] = "";
        }
        attr.value = _form[attr.prop];
      });
    });
    _form.template = "";
    _form.images = [];
    _form.attributes = [
      {
        name: null,
        position: 1,
        values: []
      },
      {
        name: null,
        position: 2,
        values: []
      },
      {
        name: null,
        position: 3,
        values: []
      }
    ];
  },
  data() {
    const initFiledArrays = ["name", "regularPrice"];
    const columnDefs = dtHelper.buildInitFields(variantSchema, initFiledArrays);
    return {
      columnDefs,
      centerGroups: firstGroups,
      sideGroups: secondGroups,
      form: _form,
      variants: {},
      custom_field: _custom_field,
      show_fields: [],
      dataTable: [],
      dialogModalVariant: false,
      selectedAttribute: [],
      actions: [
        {
          type: "primary",
          title: "edit",
          icon: "fa-solid fa-pen-to-square",
          callback: this.showModalVariant
        }
      ],
      priceForm: {
        id: 0,
        name: "",
        regularPrice: 0,
        comparePrice: 0
      }
    };
  },

  computed: {
    categories() {
      return this.$store.state.categories;
    },
    languages() {
      return this.$store.state.languages;
    },
    productAttributes() {
      return this.$store.state.attributes.map(attribute => {
        attribute.multiple = true;
        attribute.title = attribute.name;
        attribute.value = attribute.name;
        attribute.options.forEach(item => {
          item.title = item.name;
          item.value = item.name;
        });
        return attribute;
      });
    },
    pickableProductAttributes() {
      return this.productAttributes.filter(
        v => !this.selectedAttribute.includes(v.name)
      );
    },
    customField: {
      get() {
        return this.$util.filterByHandle(
          this.$store.state.classCustomField,
          this.show_fields
        );
      },
      set(value) {}
    },
    listView() {
      const listTheme = this.$store.state.listThemeView;
      if (listTheme.length) {
        listTheme.unshift({
          title: "Mặc định",
          value: ""
        });
        return {
          options: listTheme
        };
      }
      return "";
    }
  },

  mounted() {
    const actions = [
      {
        label: "Quay lại",
        type: "info",
        icon: "",
        callback: this.cancel
      },
      {
        label: "Lưu lại",
        type: "primary",
        icon: "",
        callback: this.save
      }
    ];
    this.$store.dispatch("setPageTitle", "Cập nhật sản phẩm");
    this.$store.dispatch("fetchAttributes");
    this.$store.dispatch("fetchCategories");
    this.$store.dispatch("fetchProductDetail", this.$route.params.id);
    this.$store.dispatch("setCurrentActions", actions);
    this.form.status = "publish";
    this.form.stockStatus = "instock";
  },

  methods: {
    resetSelect(index, isClick) {
      this.$set(
        this.form.attributes,
        index,
        Object.assign({}, this.form.attributes[index], { values: null })
      );
      if (isClick) {
        this.$nextTick(() => {
          this.$set(
            this.form.attributes,
            index,
            Object.assign({}, this.form.attributes[index], { name: null })
          );
        });
      }
    },
    productAttributeOptions(attribute) {
      const attr = this.productAttributes.find(a => a.name === attribute.name);
      return {
        options: (attr && attr.options) || [],
        multiple: !!attribute.disabled
      };
    },
    updatePriceVariant() {
      this.$set(this.dataTable, this.priceForm.id, this.priceForm);
      this.priceForm = {
        id: 0,
        name: "",
        comparePrice: 0,
        regularPrice: 0
      };
      this.dialogModalVariant = false;
    },
    showModalVariant(index, row) {
      this.priceForm = Object.assign({}, row);
      this.priceForm.id = index;
      this.dialogModalVariant = true;
    },
    cartesian(...args) {
      const arr = args.filter(a => a.length !== 0);
      if (arr.length) {
        return arr.reduce((a, b) =>
          a.reduce((r, v) => r.concat(b.map(w => [].concat(v, w))), [])
        );
      }
      return [];
    },
    cancel() {
      this.$router.push({ name: "AllProducts" });
    },
    updateHandle() {
      this.form.handle = this.form.title;
      const data = {
        handle: this.$util.createHandle(this.form.title),
        lang: "vi"
      };
      this.$store.dispatch("checkHandle", data).then(result => {
        this.form.handle = result;
      });
    },
    async save() {
      const valid = await this.$validator.validateAll();
      if (!valid) return;
      this.form.variants.forEach((v, index) => {
        v = Object.assign(v, this.dataTable[index]);
        delete v.updatedAt;
      });
      for (let variant of this.form.variants) {
        if (variant.list_image && variant.list_image.length) {
          variant.images = variant.list_image.map(item => item.name);
        }
      }
      for (const image of this.form.images) {
        if (!image.src) {
          image.src = image.origin;
        }
      }
      try {
        await this.$store.dispatch(
          "updateProduct",
          Object.assign({}, this.form, {
            attributes: this.form.attributes.filter(
              v => v.name && v.values && v.values.length
            )
          })
        );
        Message({
          message: "Cập nhật thành công",
          type: "success"
        });
      } catch (error) {
        Message({
          message: error.message,
          type: "error"
        });
      }
    }
  },
  watch: {
    "form.title": function(newVal) {
      this.form["seo.meta_title"] = newVal;
      const data = {
        handle: this.$util.createHandle(newVal),
        lang: "vi"
      };
      this.$store.dispatch("checkHandle", data).then(result => {
        this.form.handle = result;
      });
    },
    "form.title_en": function(newVal) {
      let data = {
        handle: this.$util.createHandle(newVal),
        lang: "en"
      };
      this.$store.dispatch("checkHandle", data).then(result => {
        this.form.handle_en = result;
      });
    },
    "form.title_jp": function(newVal) {
      let data = {
        handle: this.$util.createHandle(newVal),
        lang: "jp"
      };
      this.$store.dispatch("checkHandle", data).then(result => {
        this.form.handle_jp = result;
      });
    },
    "form.description": function(newVal) {
      this.form["seo.meta_description"] = newVal;
    },
    "form.regularPrice": {
      handler(nVal) {
        this.dataTable.forEach(v => {
          v.regularPrice = nVal;
        });
      }
    },
    "form.attributes": {
      deep: true,
      handler(nVal) {
        this.selectedAttribute = nVal.map(v => v.name).filter(v => !!v);
        const ops = nVal.map(v => {
          if (Array.isArray(v.values)) {
            return v.values.map(i => ({ position: v.position, value: i }));
          }
          return [{ position: v.position, value: v.values }];
        });
        this.dataTable = this.cartesian(...ops).map((v, index) => {
          let row = {};
          if (Array.isArray(v)) {
            row.name = v
              .map(i => i.value)
              .filter(v => !!v)
              .join(" / ");
            v.forEach(i => {
              row[`option${i.position}`] = i.value;
            });
          } else {
            row.name = v.value;
            row[`option${v.position}`] = v.value;
          }
          row.regularPrice =
            this.form.variants && this.form.variants[index]
              ? this.form.variants[index].regularPrice
              : 0;
          return row;
        });
      }
    },
    categories: {
      handler(nVal) {
        const index = this.sideGroups.findIndex(g => {
          const props = g.attributes.map(a => a.prop);
          return props.includes("categories");
        });
        if (index !== -1) {
          const group = this.sideGroups[index];
          group.attributes.forEach(a => {
            if (a.prop === "categories") {
              a.options = nVal.map(o => ({ title: o.name, value: o.id }));
            }
          });
          this.sideGroups = Object.assign({}, this.sideGroups);
        }
      }
    },
    "$store.state.productDetail": {
      handler(nVal) {
        nVal.attributes = this.form.attributes.map((attribute, index) => {
          const attr = Object.assign({}, attribute, nVal.attributes[index]);
          attr.values = attr.id ? attr.values : null;
          attr.disabled = !!attr.id;
          return attr;
        });
        this.form = Object.assign({}, this.form, nVal);
        this.form.categories = this.form.categories.map(c => c.id);
        for (const attribute of this.form.attributes) {
          if (attribute.id) {
            attribute.values = [
              ...new Set(
                this.form.variants
                  .filter(v => v[`option${attribute.position}`])
                  .map(v => v[`option${attribute.position}`])
              )
            ];
          }
        }
      }
    }
  },
  destroyed() {
    this.$store.dispatch("setCurrentActions", []);
    this.$store.state.productAttributes = [];
    this.$store.state.listThemeView = [];
    this.$store.state.customField = [];
  }
};
</script>

<style lang="scss">
.dialogModalVariant {
  .el-dialog {
    width: 400px;
  }
}
</style>
