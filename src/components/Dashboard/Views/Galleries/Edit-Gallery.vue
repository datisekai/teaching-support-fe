<template lang="html">
  <div class="row">
    <div class="col-lg-8 col-md-8 col-sm-12">
      <form-card
        v-for="(group, index) of centerGroups"
        :key="'groupleft' + index"
        :group="group"
        v-model="gallery"
        @updateHandle="updateHandle"
      ></form-card>
      <custom-field
        v-if="customField.length > 0"
        :group="customField"
        :value="custom_field"
        v-model="custom_field"
      ></custom-field>
    </div>
    <div class="col-lg-4 col-md-4 col-sm-12">
      <form-card
        v-for="(group, index) of sideGroups"
        :key="'groupright' + index"
        hasTop="true"
        :group="group"
        v-model="gallery"
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
    <div class="col-12 col-sm-12">
      <div class="card">
        <div class="card-header">
          <h6 class="title pull-left">Danh sách hình ảnh</h6>
          <el-button type="primary" class="pull-right" @click="showModalPhoto"
            >Thêm hình ảnh</el-button
          >
        </div>
        <div class="card-body form-card p-0">
          <my-table
            :columnDefs="columnDefs"
            v-bind:data-rows="photos"
            :actions="actions"
            :actionsTable="actionsTable"
          />
        </div>
      </div>
    </div>
    <el-dialog
      :title="is_edit_photo ? 'Chỉnh sửa hình ảnh' : 'Thêm hình ảnh'"
      :visible.sync="dialogAddPhotoVisible"
      width="60%"
    >
      <image-gallery
        multiple="true"
        v-model="list_photos"
        :editPhoto="is_edit_photo"
        hasTitle="1"
        hasLink="1"
      >
      </image-gallery>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddPhotoVisible = false">Đóng</el-button>
        <el-button v-if="is_edit_photo" type="primary" @click="updatePhoto"
          >Cập nhật</el-button
        >
        <el-button v-else type="primary" @click="addPhotosToGallery"
          >Thêm hình ảnh</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FormCard from "src/components/UIComponents/FormCard.vue";
import MyTable from "src/components/UIComponents/Table.vue";
import CustomField from "src/components/UIComponents/CustomField.vue";
import dtHelper from "src/helpers/datatable";
import {
  MessageBox,
  Message,
  Input,
  Button,
  Dialog,
  Form,
  FormItem
} from "element-ui";
import MyImage from "src/components/UIComponents/Image.vue";
import ImageGallery from "src/components/UIComponents/ImageGallery.vue";
import MySelect from "src/components/UIComponents/Select";
import Editor from "@tinymce/tinymce-vue";
import { mapState } from "vuex";
import dataFrom from "./gallery-form";
import photoSchemas from "./photo-schemas";

const _form = {};
let _custom_field = {};
let firstGroups;
let secondGroups;

export default {
  components: {
    FormCard,
    ElInput: Input,
    ElButton: Button,
    ElForm: Form,
    ElFormItem: FormItem,
    ElDialog: Dialog,
    MyTable,
    MyImage,
    ImageGallery,
    Editor,
    MySelect,
    CustomField
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
    this.$store.dispatch("getCustomField", { type: "gallery", id });
    this.$store.dispatch("getListThemeView", "gallery");
  },
  data() {
    return {
      centerGroups: firstGroups,
      sideGroups: secondGroups,
      is_edit_photo: false,
      columnDefs: dtHelper.buildColumDefs(photoSchemas),
      actions: [
        {
          type: "primary",
          icon: "fa-solid fa-pen-to-square",
          callback: this.editPhoto
        },
        {
          type: "danger",
          icon: "fa-solid fa-xmark",
          callback: this.removePhoto
        }
      ],
      actionsTable: [
        {
          title: "Ẩn",
          callback: this.inactiveAll
        },
        {
          title: "Hiện",
          callback: this.activeAll
        },
        {
          title: "Xóa",
          color: "text-danger",
          callback: this.removeAll
        }
      ],
      form: _form,
      gallery: [],
      list_photos: [],
      dialogAddPhotoVisible: false,
      custom_field: _custom_field,
      show_fields: [],
      listType: {
        multiple: false,
        options: [
          {
            title: "Địa chỉ web",
            value: "custom"
          },
          {
            title: "Nhóm sản phẩm",
            value: "collection"
          },
          {
            title: "Sản phẩm",
            value: "product"
          },
          {
            title: "Nhóm bài viết",
            value: "blog"
          },
          {
            title: "Bài viết",
            value: "article"
          },
          {
            title: "Trang nội dung",
            value: "page"
          },
          {
            title: "Gallery",
            value: "gallery"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      originalForm: state => state.galleryDetail,
      photos: state => state.photos
    }),
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
    },
    galleries() {
      const data = this.$store.state.galleries;
      const arr = {};
      arr.options = [];
      for (const item of data) {
        arr.options.push({
          value: item.id,
          title: item.title
        });
      }
      return arr;
    }
  },

  mounted() {
    this.getContext();
    const id = this.$route.params.id;
    this.$store.dispatch("fetchGalleryDetail", id);
    this.$store.dispatch("fetchGalleries");
    this.$store.dispatch("setPageTitle", "Chỉnh sửa gallery");
    this.$store.dispatch("setCurrentActions", [
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
    showModalPhoto() {
      this.dialogAddPhotoVisible = true;
      this.list_photos = [];
      this.is_edit_photo = false;
    },
    cancel() {
      this.$router.push({ name: "Allgalleries" });
    },
    remove() {
      const self = this;
      MessageBox.confirm("Xóa gallery", "Warning", {
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ",
        type: "warning",
        center: true
      })
        .then(() => {
          self.$store.dispatch("removeGallery", self.gallery.id).then(res => {
            Message({
              type: "success",
              message: "Đã xóa gallery"
            });
            self.$router.push({ name: "Allgalleries" });
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
      const win = window.open(self.gallery.url, "_blank");
      if (win) {
        win.focus();
      } else {
        Message({
          message: "Please allow popups for this website",
          type: "error"
        });
      }
    },
    editPhoto(index, row) {
      this.list_photos = [];
      this.list_photos.push(row);
      this.dialogAddPhotoVisible = true;
      this.is_edit_photo = true;
    },
    removePhoto(index, row) {
      const self = this;
      MessageBox.confirm("Xóa hình ảnh?", "Warning", {
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$store.dispatch("removePhoto", row.id).then(res => {
            Message({
              type: "success",
              message: "Đã xóa"
            });
            const id = self.$route.params.id;
            self.$store.dispatch("fetchGalleryDetail", id);
          });
        })
        .catch(() => {});
    },

    addPhotosToGallery() {
      let data = {};
      data.gallery_id = this.$route.params.id;
      data.photos = this.list_photos;
      var self = this;
      this.$store.dispatch("addPhotosToGallery", data).then(
        res => {
          if (res.success) {
            Message({
              type: "success",
              message: "Thêm hình ảnh thành công"
            });
            this.$store.dispatch("fetchGalleryDetail", data.gallery_id);
            this.dialogAddPhotoVisible = false;
          } else {
            Message({
              type: "error",
              message: res.message
            });
          }
        },
        error => {
          console.error(error);
        }
      );
    },
    inactiveAll(rows) {
      this.updateStatus(rows, "inactive");
    },
    activeAll(rows) {
      this.updateStatus(rows, "active");
    },
    removeAll(rows) {
      const self = this;
      rows.forEach((row, index) => {
        self.$store.dispatch("removePhoto", row.id).then(res => {
          Message({
            type: "success",
            message: "Đã xóa hình ảnh"
          });
        });
      });
      const id = self.$route.params.id;
      self.$store.dispatch("fetchGalleryDetail", id);
    },
    updateStatus(rows, status) {
      const self = this;
      this.$util
        .updateStatusAll("photo", rows, status)
        .then(result => {
          const id = self.$route.params.id;
          self.$store.dispatch("fetchGalleryDetail", id);
          Message({
            type: "success",
            message: "Cập nhật thành công"
          });
        })
        .catch(error => {
          Message({
            type: "error",
            message: error.message
          });
        });
    },
    updatePhoto() {
      const self = this;
      let photos = this.list_photos;
      if (photos && photos.length) {
        let data = {
          id: photos[0].id,
          title: photos[0].title,
          link: photos[0].link,
          link_type: photos[0].link_type,
          status: photos[0].status
        };
        self.$store
          .dispatch("updatePhoto", data)
          .then(res => {
            if (res.success) {
              Message({
                type: "success",
                message: "Thành công"
              });
              this.dialogAddPhotoVisible = false;
              this.is_edit_photo = false;
            } else {
              Message({
                type: "error",
                message: res.message
              });
            }
          })
          .catch(error => {
            Message({
              type: "error",
              message: error.message
            });
          });
      }
    },
    updateHandle() {
      const self = this;
      const data = {
        handle: self.$util.createHandle(self.gallery.title),
        lang: "vi"
      };
      self.$store.dispatch("checkHandle", data).then(result => {
        self.$store.state.galleryDetail = self.gallery;
        self.$store.state.galleryDetail.handle = result;
      });
    },
    save() {
      const self = this;
      this.$validator.validateAll().then(result => {
        if (result) {
          if (self.gallery.parent) {
            self.gallery.parent_id = self.gallery.parent.id;
          }
          self.$store
            .dispatch("updateGallery", self.gallery)
            .then(result => {
              self.$store.dispatch(
                "storeCustomField",
                self.$util.parseDataCustomfield(
                  self.customField,
                  self.custom_field,
                  "gallery",
                  self.gallery.id
                )
              );

              Message({
                type: "success",
                message: "Cập nhật thành công"
              });
            })
            .catch(error => {
              Message({
                type: "error",
                message: error.message
              });
            });
        }
      });
    },
    getContext() {
      const ctx = this.$util.getContext(this.form, { module: "galleries" });
      this.$store.state.ctx = ctx;
      return ctx;
    }
  },
  watch: {
    originalForm(newVal, oldVal) {
      this.gallery = newVal;
    },
    gallery: {
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
    this.$store.state.galleryDetail = {};
    this.$store.state.listThemeView = [];
    this.$store.state.customField = [];
  }
};
</script>
