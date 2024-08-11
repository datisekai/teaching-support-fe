<template lang="html">
  <div class="row">
    <div class="col-lg-8 col-md-8 col-sm-12">
      <form-card
        v-for="(group, index) of centerGroups"
        :key="'groupleft' + index"
        :group="group"
        v-model="form"
        @updateHandle="updateHandle"
      ></form-card>
      <custom-field
        v-if="customField.length > 0"
        :group="customField"
        :value="custom_field"
        v-model="custom_field"
      ></custom-field>
      <div class="card" v-if="articles && articles.length">
        <div class="card-header">
          <h6 class="title">Danh sách bài viết</h6>
        </div>
        <div class="card-body form-card p-0">
          <my-table
            :columnDefs="columnDefs"
            v-bind:data-rows="articles"
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
            <div class="col-sm-12 p-0">
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
import CustomField from "src/components/UIComponents/CustomField.vue";
import { Message, MessageBox, Input, Button } from "element-ui";
import MySelect from "src/components/UIComponents/Select";
import MyTable from "src/components/UIComponents/Table.vue";
import { mapState } from "vuex";
import util from "@/helpers/util";
import dtHelper from "src/helpers/datatable";
import dataFrom from "./blog-form";
import articleSchemas from "./article-blog-schemas";

const _form = {};
let _custom_field = {};
let firstGroups;
let secondGroups;

export default {
  components: {
    FormCard,
    ElInput: Input,
    ElButton: Button,
    Message,
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
    this.$store.dispatch("getCustomField", { type: "blog", id });
    this.$store.dispatch("getListThemeView", "blog");
  },
  data() {
    return {
      centerGroups: firstGroups,
      sideGroups: secondGroups,
      custom_field: _custom_field,
      show_fields: [],
      actions: [
        {
          type: "danger",
          icon: "fa-solid fa-xmark",
          callback: this.removeArticle
        }
      ],
      columnDefs: dtHelper.buildColumDefs(articleSchemas)
    };
  },
  computed: {
    ...mapState({
      originalForm: state => state.blogDetail
    }),
    articles() {
      return this.$store.state.articles;
    },
    form: {
      get() {
        let hashSeo = {};
        if (this.originalForm.seo) {
          hashSeo = util.hashFlatten({ seo: this.originalForm.seo });
        }
        const _originalForm = Object.assign({}, this.originalForm, hashSeo);
        return _originalForm;
      },
      set(value) {}
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
    this.$store.dispatch("fetchBlogDetail", id);
    this.$store.dispatch("fetchBlogArticles", id);

    this.$store.dispatch("setPageTitle", "Cập nhật nhóm bài viết");
    this.$store.dispatch("setCurrentActions", [
      {
        label: "Xem trên web",
        type: "default",
        icon: "",
        callback: this.view
      },
      {
        label: "Xóa",
        type: "danger",
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
    removeArticle(index, row) {
      const self = this;
      MessageBox.confirm("Xóa bài viết", "Warning", {
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$store.dispatch("removeBlogArticles", row.id).then(res => {
            Message({
              type: "success",
              message: "Đã xóa"
            });
            let id = this.$route.params.id;
            this.$store.dispatch("fetchBlogArticles", id);
          });
        })
        .catch(() => {});
    },
    changeTreeArticle(node, targetTree, oldTree) {
      const self = this;
      const articles = [];
      const data = targetTree.data;
      data.forEach((element, index) => {
        articles.push(element.id);
      });
      this.$store
        .dispatch("updatePriorityArticle", {
          listArticle: articles,
          blogID: self.form.id
        })
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
    cancel() {
      this.$router.push({ name: "AllBlogs" });
    },
    updateHandle() {
      const self = this;
      const data = {
        handle: self.$util.createHandle(self.form.title),
        lang: "vi"
      };
      self.$store.dispatch("checkHandle", data).then(result => {
        self.$store.state.blogDetail = self.form;
        self.$store.state.blogDetail.handle = result;
      });
    },
    remove() {
      const self = this;
      MessageBox.confirm(
        "Bạn có chắc chắn xóa nhóm bài viết không?",
        "Warning",
        {
          confirmButtonText: "Đồng ý",
          cancelButtonText: "Hủy bỏ",
          type: "warning",
          center: true
        }
      )
        .then(() => {
          self.$store.dispatch("removeBlog", self.form.id).then(res => {
            Message({
              type: "success",
              message: "Đã xóa nhóm bài viết"
            });
            setTimeout(() => {
              self.$router.push({ name: "AllBlogs" });
            }, 1000);
          });
        })
        .catch(() => {
          Message({
            type: "info",
            message: "Hủy bỏ"
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
    save() {
      const self = this;
      this.$validator.validateAll().then(result => {
        if (result) {
          if (self.form.parent) {
            self.form.parent_id = self.form.parent.id;
          }
          self.$store.dispatch("updateBlog", self.form).then(
            res => {
              self.$store.dispatch(
                "storeCustomField",
                self.$util.parseDataCustomfield(
                  self.customField,
                  self.custom_field,
                  "blog",
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
      const ctx = this.$util.getContext(this.form, { module: "blogs" });
      this.$store.state.ctx = ctx;
      return ctx;
    }
  },
  watch: {
    form: {
      handler(newVal, oldVal) {
        const ctx = this.getContext();
        const output = window.__FUNC.CustomField(ctx);
        this.show_fields = output;
      },
      deep: true
    }
  },
  destroyed() {
    this.$store.dispatch("setCurrentActions", []);
    this.$store.state.blogDetail = [];
    this.$store.state.listThemeView = [];
    this.$store.state.customField = [];
  }
};
</script>
