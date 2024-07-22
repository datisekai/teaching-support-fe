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
import CustomField from "src/components/UIComponents/CustomField.vue";
import { Message, Input, Button } from "element-ui";
import MySelect from "src/components/UIComponents/Select";
import dataForm from "./department-form";

const _form = {};

export default {
  components: {
    FormCard,
    ElInput: Input,
    ElButton: Button,
    Message,
    MySelect,
    CustomField
  },

  data() {
    return {
      dataForm: dataForm,
      form: _form
    };
  },
  computed: {},
  mounted() {
    this.$store.dispatch("setPageTitle", "Tạo department");
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
          console.log("form", this.form);
          self.$store.dispatch("createDepartment", self.form).then(
            res => {
              Message({
                message: "Tạo thành công",
                type: "success"
              });
              this.$router.push({ name: "AllDepartments" });
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
    }
  },
  watch: {},
  destroyed() {}
};
</script>
