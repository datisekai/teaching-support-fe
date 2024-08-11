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
import dataForm from "./group-form";

const _form = {};
const _custom_field = {};
let firstGroups;
let secondGroups;

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
      dataForm,
      form: _form,
      show_fields: [],
      is_disabled: false
    };
  },
  computed: {},
  mounted() {
    this.$store.dispatch("setPageTitle", "Tạo course");
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
      this.$router.push({ name: "AllCourses" });
    },
    save() {
      const self = this;
      this.$validator.validateAll().then(result => {
        if (result) {
          if (self.form.course) {
            self.form.course_id = self.form.course.id;
          }

          if (self.form.teacher) {
            self.form.teacher_id = self.form.teacher.id;
          }
          self.$store.dispatch("createGroup", self.form).then(
            res => {
              Message({
                message: "Tạo thành công",
                type: "success"
              });
              setTimeout(() => {
                self.$router.push({ name: "AllGroups" });
              }, 1000);
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
  destroyed() {
    this.$store.dispatch("setCurrentActions", []);
  }
};
</script>
