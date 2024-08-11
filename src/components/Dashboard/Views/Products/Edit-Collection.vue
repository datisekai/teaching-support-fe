<template lang="html">
  <div class="row">
    <div class="col-lg-8 col-md-8 col-sm-12">
      <div v-for="(group, index) of centerGroups">
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
        >
        </form-card>
      </div>
      <custom-field
        v-if="customField.length > 0"
        :group="customField"
        :value="custom_field"
        v-model="custom_field"
      ></custom-field>
      <div class="card" v-if="products.length > 0">
        <div class="card-header">
          <h6 class="title">Danh sách sản phẩm</h6>
        </div>
        <div class="card-body form-card p-0">
          <my-table
            :columnDefs="columnDefs"
            v-bind:data-rows="products"
            :actions="actions"
            :actionsTable="[]"
          />
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-md-4 col-sm-12">
      <form-card
        v-for="(group, index) of sideGroups"
        :key="'groupright' + index"
        hasTop="true"
        :group="group"
        v-model="form"
      >
      </form-card>
      <div class="card" v-if="listView">
        <div class="card-header">
          <h6 class="title">Giao diện</h6>
        </div>
        <div class="card-body form-card">
          <div class="row">
            <div class="col-sm-12">
              <my-select
                class="full-width"
                :attribute="listView"
                placeholder="Giao diện"
                v-model="form.template"
              >
              </my-select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="page-action">
        <el-button @click="cancel">Hủy</el-button>
        <el-button type="primary" @click="save">Cập nhật</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import FormCard from "src/components/UIComponents/FormCard.vue";
import FormCardMultiLang from "src/components/UIComponents/FormCardMultiLang.vue";
import CustomField from "src/components/UIComponents/CustomField.vue";
import { Message, MessageBox, Input, Button } from "element-ui";
import MySelect from "src/components/UIComponents/Select";
import MyTable from "src/components/UIComponents/Table.vue";
import { mapState } from "vuex";
import util from "@/helpers/util";
import dtHelper from "src/helpers/datatable";
import dataFrom from "./collection-form";
import productSchemas from "./product-collection-schemas";

const _form = {};
let _custom_field = {};
let firstGroups;
let secondGroups;

export default {
  components: {
    FormCard,
    FormCardMultiLang,
    ElInput: Input,
    ElButton: Button,
    MySelect,
    CustomField,
    MyTable
  },
  beforeCreate() {
    firstGroups = dataFrom[0].groups;
    secondGroups = dataFrom[1].groups;

    if (this.$store.state.customFieldDefine) {
      _custom_field = this.$store.state.customFieldDefine.reduce(
        (result, item) => {
          result[item.handle] = "";
          return result;
        },
        {}
      );
    }

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

    let id = this.$route.params.id;
    this.$store.dispatch("getCustomField", { type: "collection", id });
    this.$store.dispatch("getListThemeView", "collection");
  },
  data() {
    return {
      centerGroups: firstGroups,
      sideGroups: secondGroups,
      custom_field: _custom_field,
      form: _form,
      show_fields: [],
      actions: [
        {
          type: "danger",
          icon: "fa-solid fa-xmark",
          callback: this.removeProduct
        }
      ],
      columnDefs: dtHelper.buildColumDefs(productSchemas)
    };
  },
  computed: {
    ...mapState({
      originalForm: state => state.collectionDetail,
      products: state => state.products
    }),
    languages() {
      return this.$store.state.languages;
    },
    customField: {
      get() {
        const data = this.$util.filterByHandle(
          this.$store.state.customField,
          this.show_fields
        );
        for (const item of data) {
          if (item.value) {
            _custom_field[item.handle] = item.value;
          } else {
            _custom_field[item.handle] = "";
          }
        }
        return data || "";
      },
      set(value) {}
    },
    listView() {
      const self = this;
      const listTheme = self.$store.state.listThemeView;
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
    this.getContext();
    const id = this.$route.params.id;
    this.$store.dispatch("fetchCollectionDetail", id);
    this.$store.dispatch("fetchCollectProducts", id);
    this.$store.dispatch("setPageTitle", "Cập nhật nhóm sản phẩm");
    this.$store.dispatch("setCurrentActions", [
      {
        label: "Xem trên web",
        type: "default",
        icon: "",
        callback: this.view
      },
      {
        label: "Xóa",
        type: "warning",
        icon: "",
        callback: this.remove
      },
      {
        label: "Cập nhật",
        type: "primary",
        icon: "",
        callback: this.save
      }
    ]);
  },
  methods: {
    removeProduct(index, row) {
      let self = this;
      MessageBox.confirm("Xóa sản phẩm ra khỏi nhóm sản phẩm?", "Warning", {
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ",
        type: "warning",
        center: true
      }).then(() => {
        this.$store.dispatch("deleteCollectProducts", row.id).then(res => {
          Message({
            type: "success",
            message: "Đã xóa"
          });
          let id = self.$route.params.id;
          self.$store.dispatch("fetchCollectProducts", id);
        });
      });
    },
    changeTreeProduct(node, targetTree, oldTree) {
      const self = this;
      const arr_product = [];
      const data = targetTree.data;
      const rootID = this.form.id;
      data.forEach((element, index) => {
        const temp = {};
        temp.id = element.id;
        temp.parent_id = rootID;
        arr_product.push(temp);
        self.getDataUpdateProduct(element.children, arr_product);
      });
      this.$store
        .dispatch("", { arr_product })
        .then(result => {
          Message({
            type: "success",
            message: "Cập nhật thành công"
          });
        })
        .catch(error => {
          Message({
            type: "warning",
            message: "Có lỗi xảy ra"
          });
        });
    },
    getDataUpdateProduct(children, menus) {
      const self = this;
      if (children.length) {
        children.forEach((element, index) => {
          const temp = {};
          temp.id = element.id;
          temp.parent_id = element.parent.id;
          menus.push(temp);
          self.getDataUpdateProduct(element.children, menus);
        });
      }
    },
    cancel() {
      this.$router.push({ name: "AllCollections" });
    },
    remove() {
      const self = this;
      MessageBox.confirm("Bạn có chắc chắn xóa không?", "Warning", {
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ",
        type: "warning",
        center: true
      }).then(() => {
        self.$util
          .updateStatusAll("collection", [self.form], "delete")
          .then(result => {
            self.$store.dispatch("fetchCollections");
            Message({
              type: "success",
              message: "Xóa thành công"
            });
            self.$router.push({ name: "AllCollections" });
          })
          .catch(error => {
            Message({
              type: "error",
              message: error.message
            });
          });
      });
    },
    view() {
      const self = this;
      const win = window.open(self.form.url, "_blank");
      if (win) {
        win.focus();
      } else {
        Message({
          message: "Please allow popups for this website",
          type: "error"
        });
      }
    },
    updateHandle(prop, lang) {
      let self = this;
      let title = self.form.title;
      if (lang != "vi") title = self.form["title_" + lang];
      const data = {
        handle: self.$util.createHandle(title),
        lang: lang
      };
      self.$store.dispatch("checkHandle", data).then(result => {
        self.$store.state.collectionDetail = self.form;
        self.$store.state.collectionDetail[prop] = result;
      });
    },
    save() {
      const self = this;
      this.$validator.validateAll().then(result => {
        if (result) {
          if (self.form.parent) {
            self.form.parent_id = self.form.parent.id;
          }
          self.$store.dispatch("updateCollection", self.form).then(
            res => {
              self.$store.dispatch(
                "storeCustomField",
                self.$util.parseDataCustomfield(
                  self.customField,
                  self.custom_field,
                  "collection",
                  self.form.id
                )
              );

              Message({
                message: "Cập nhật thành công",
                type: "success"
              });
            },
            res => {
              Message({
                message: res.message,
                type: "error"
              });
            }
          );
        }
      });
    },
    getContext() {
      const ctx = this.$util.getContext(this.form, { module: "collections" });
      this.$store.state.ctx = ctx;
      return ctx;
    }
  },
  watch: {
    originalForm(newVal) {
      let hashSeo = {};
      if (this.originalForm.seo) {
        hashSeo = util.hashFlatten({ seo: this.originalForm.seo });
      }
      const _originalForm = Object.assign({}, this.originalForm, hashSeo);
      this.form = { ...this.form, ..._originalForm };
    },
    form: {
      handler(newVal, oldVal) {
        const ctx = this.getContext();
        const output = window.__FUNC.CustomField(ctx);
        this.show_fields = output;
      },
      deep: true
    },
    "form.title": function(newVal, oldVal) {
      const self = this;
      const data = {
        handle: self.$util.createHandle(newVal),
        lang: "vi"
      };
      self.$store.dispatch("checkHandle", data).then(result => {
        self.form.handle = result;
      });
    },
    "form.title_en": function(newVal, oldVal) {
      let data = {
        handle: this.$util.createHandle(newVal),
        lang: "en"
      };
      this.$store.dispatch("checkHandle", data).then(result => {
        this.form.handle_en = result;
      });
    },
    "form.title_jp": function(newVal, oldVal) {
      let data = {
        handle: this.$util.createHandle(newVal),
        lang: "jp"
      };
      this.$store.dispatch("checkHandle", data).then(result => {
        this.form.handle_jp = result;
      });
    }
  },
  destroyed() {
    this.$store.dispatch("setCurrentActions", []);
    this.$store.state.collectionDetail = [];
    this.$store.state.listThemeView = [];
    this.$store.state.customField = [];
  }
};
</script>
