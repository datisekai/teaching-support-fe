<template lang="html">
  <div class="row">
    <!-- {{ course }} -->
    <!-- {{ form }} -->
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
          <h6 class="title pull-left">Danh sách nhóm học</h6>
          <el-button type="primary" class="pull-right" @click="showModalGroup"
            >Thêm nhóm học</el-button
          >
        </div>
        <div class="card-body form-card p-0">
          <my-table
            ref="table"
            :columnDefs="columnDefs"
            v-bind:data-rows="groups"
            :actions="actions"
            :actionsTable="[]"
          />
        </div>
      </div>
    </div>
    <el-dialog
      :title="is_edit_group ? 'Chỉnh sửa nhóm học' : 'Thêm nhóm học'"
      :visible.sync="dialogAddGroupVisible"
      width="60%"
    >
      <div>
        <form-card
          v-for="(group, index) of groupForm.groups"
          :key="'groupForm' + index"
          :group="group"
          v-model="current_group"
        ></form-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddGroupVisible = false">Đóng</el-button>
        <el-button v-if="is_edit_group" type="primary" @click="updateGroup"
          >Cập nhật</el-button
        >
        <el-button v-else type="primary" @click="addGroupToCourse"
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
import dataForm from "./course-form";
import groupForm from "./group-form";
import groupSchemas from "./group-schemas";

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
      groupForm,
      is_edit_group: false,
      actions: [
        {
          type: "secondary",
          icon: "fa-solid fa-clipboard-user",
          callback: this.createRoom
        },
        {
          type: "primary",
          icon: "fa-solid fa-pen-to-square",
          callback: this.editGroup
        }
        // {
        //   type: "danger",
        //   icon: "fa-solid fa-xmark",
        //   callback: this.removeGroup
        // }
      ],
      actionsTable: [],
      form: _form,
      show_fields: [],
      current_group: {},
      dialogAddGroupVisible: false,
      columnDefs: dtHelper.buildColumDefs(groupSchemas)
    };
  },
  computed: {
    ...mapState([, "user"]),
    groups() {
      const course = this.$store.state.course;
      return course.groups || [];
    },
    course() {
      return {
        ...this.$store.state.course
      };
    }
  },

  mounted() {
    const id = this.$route.params.id;
    this.$store.dispatch("fetchCourse", id);
    this.$store.dispatch("setPageTitle", "Chỉnh sửa course");
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
    createRoom(index, row) {
      this.$router.push(`/rooms/create?group_id=${row.id}`);
    },
    showModalGroup() {
      this.dialogAddGroupVisible = true;
      this.current_group = {};
      this.is_edit_group = false;
    },
    cancel() {
      this.$router.push({ name: "AllCourses" });
    },

    save() {
      const self = this;
      this.$validator.validateAll().then(result => {
        if (result) {
          self.$store
            .dispatch("updateCourse", self.form)
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
    editGroup(index, row) {
      this.current_group = row;
      this.dialogAddGroupVisible = true;
      this.is_edit_group = true;
    },
    removeGroup(index, row) {
      const self = this;
      MessageBox.confirm("Xóa môn học?", "Warning", {
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$store.dispatch("removeGroup", row.id).then(res => {
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
    updateGroup() {
      const self = this;
      if (this.current_group && Object.keys(this.current_group).length > 0) {
        let data = {
          id: this.current_group.id,
          name: this.current_group.name,
          description: this.current_group.description
        };
        self.$store
          .dispatch("updateGroup", data)
          .then(res => {
            Message({
              type: "success",
              message: "Thành công"
            });
            this.dialogAddGroupVisible = false;
            this.is_edit_group = false;
          })
          .catch(error => {
            Message({
              type: "error",
              message: error.message
            });
          });
      }
    },
    addGroupToCourse() {
      console.log(this.current_group);
      let is_validate = true;

      for (const key in this.current_group) {
        if (!this.current_group[key].trim()) {
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
      this.current_group.course_id = +this.$route.params.id;
      this.current_group.teacher_id = +this.user.id;

      this.$store.dispatch("createGroup", this.current_group).then(
        res => {
          Message({
            message: "Tạo thành công",
            type: "success"
          });
          this.$store.dispatch("fetchCourse", this.$route.params.id);
          this.dialogAddGroupVisible = false;
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
    course(newVal, oldValue) {
      this.form = newVal;
    }
  },
  destroyed() {
    this.$store.dispatch("setCurrentActions", []);
  }
};
</script>
