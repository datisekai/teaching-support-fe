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

    <div class="col-12 col-sm-12">
      <div class="card">
        <div class="card-header">
          <h6 class="title pull-left">Danh sách môn học</h6>
          <el-button type="primary" class="pull-right" @click="showModalCourse"
            >Thêm môn học</el-button
          >
        </div>
        <div class="card-body form-card p-0">
          <my-table
            ref="table"
            :columnDefs="columnDefs"
            v-bind:data-rows="courses"
            :actions="actions"
            :actionsTable="[]"
          />
        </div>
      </div>
    </div>
    <el-dialog
      :title="is_edit_course ? 'Chỉnh sửa môn học' : 'Thêm môn học'"
      :visible.sync="dialogAddCourseVisible"
      width="60%"
    >
      <div>
        <form-card
          v-for="(group, index) of courseForm.groups"
          :key="'courseform' + index"
          :group="group"
          v-model="current_course"
        ></form-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddCourseVisible = false">Đóng</el-button>
        <el-button v-if="is_edit_course" type="primary" @click="updateCourse"
          >Cập nhật</el-button
        >
        <el-button v-else type="primary" @click="addCourseToDepartment"
          >Thêm môn học</el-button
        >
      </span>
    </el-dialog>

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
import courseForm from "./course-form";
import courseSchemas from "./course-schemas";

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
      courseForm,
      is_edit_course: false,
      actions: [
        {
          type: "primary",
          icon: "fa-solid fa-pen-to-square",
          callback: this.editCourse
        }
        // {
        //   type: "danger",
        //   icon: "fa-solid fa-xmark",
        //   callback: this.removeCourse
        // }
      ],
      actionsTable: [],
      form: _form,
      show_fields: [],
      current_course: {},
      dialogAddCourseVisible: false,
      columnDefs: dtHelper.buildColumDefs(courseSchemas)
    };
  },
  computed: {
    ...mapState(["department"]),
    courses() {
      const department = this.$store.state.department;
      return department.courses || [];
    }
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
    showModalCourse() {
      this.dialogAddCourseVisible = true;
      this.current_course = {};
      this.is_edit_course = false;
    },
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
    },
    editCourse(index, row) {
      this.current_course = row;
      this.dialogAddCourseVisible = true;
      this.is_edit_course = true;
    },
    removeCourse(index, row) {
      const self = this;
      MessageBox.confirm("Xóa môn học?", "Warning", {
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$store.dispatch("removeCourse", row.id).then(res => {
            Message({
              type: "success",
              message: "Đã xóa"
            });
            const id = self.$route.params.id;
            self.$store.dispatch("fetchDepartment", id);
          });
        })
        .catch(() => {});
    },
    updateCourse() {
      const self = this;
      if (this.current_course && Object.keys(this.current_course).length > 0) {
        let data = {
          id: this.current_course.id,
          name: this.current_course.name,
          description: this.current_course.description
        };
        self.$store
          .dispatch("updateCourse", data)
          .then(res => {
            Message({
              type: "success",
              message: "Thành công"
            });
            this.dialogAddCourseVisible = false;
            this.is_edit_course = false;
          })
          .catch(error => {
            Message({
              type: "error",
              message: error.message
            });
          });
      }
    },
    addCourseToDepartment() {
      console.log(this.current_course);
      let is_validate = true;

      for (const key in this.current_course) {
        if (!this.current_course[key].trim()) {
          is_validate = false;
        }
      }

      if (!is_validate) {
        Message({
          type: "success",
          message: "Vui lòng điền đầy đủ thông tin"
        });

        return;
      }
      this.current_course.department_id = +this.$route.params.id;

      this.$store.dispatch("createCourse", this.current_course).then(
        res => {
          Message({
            message: "Tạo thành công",
            type: "success"
          });
          this.$store.dispatch("fetchDepartment", this.$route.params.id);
          this.dialogAddCourseVisible = false;
        },
        res => {
          Message({
            message: res.message,
            type: "error"
          });
        }
      );
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
