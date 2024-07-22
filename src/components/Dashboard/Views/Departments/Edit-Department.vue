<template lang="html">
  <div class="row">
    <div class="col-lg-8 col-md-8 col-sm-12">
      <form-card
        v-for="(group, index) of dataForm.groups"
        :key="'groupleft' + index"
        :group="group"
        v-model="form"
      ></form-card>
    </div>

    <div class="container-fluid">
      <div class="page-action">
        <el-button @click="cancel">Hủy</el-button>
        <el-button type="primary" @click="save">Lưu lại</el-button>
      </div>
    </div>
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
import dataForm from "./department-form";
// import photoSchemas from './photo-schemas';

const _form = {};

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
  data() {
    return {
      dataForm,
      is_edit_photo: false,
      // columnDefs: dtHelper.buildColumDefs(photoSchemas),
      actions: [],
      actionsTable: [],
      form: _form,
      show_fields: []
    };
  },
  computed: {
    ...mapState(["department"])
  },

  mounted() {
    const id = this.$route.params.id;
    this.$store.dispatch("fetchDepartment", id);
    this.$store.dispatch("setPageTitle", "Chỉnh sửa department");
    this.$store.dispatch("setCurrentActions", [
      {
        label: "Lưu lại",
        type: "primary",
        icon: "",
        callback: this.save
      }
    ]);
  },
  methods: {
    cancel() {
      this.$router.push({ name: "AllDepartments" });
    },

    save() {
      const self = this;
      this.$validator.validateAll().then(result => {
        if (result) {
          self.$store
            .dispatch("updateDepartment", self.form)
            .then(result => {
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
    }
  },
  watch: {
    department(newVal, oldValue) {
      console.log("department", newVal);
      this.form = newVal;
    }
  },
  destroyed() {
    this.$store.dispatch("setCurrentActions", []);
  }
};
</script>
