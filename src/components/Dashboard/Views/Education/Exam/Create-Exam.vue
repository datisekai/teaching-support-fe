<template lang="html">
  <div class="row">
    <div class="col-md-6 col-12">
      <form-card :group="group" v-model="form"> </form-card>
    </div>
    <div class="col-md-6 col-12">
      <div class="card">
        <div
          class="card-header d-flex justify-content-between align-items-center"
          style="padding-bottom: 15px"
        >
          <h6 class="title">Danh sách câu hỏi</h6>
          <el-button
            type="primary"
            size="small"
            @click="dialogVisible.create = true"
            >Thêm câu hỏi</el-button
          >
        </div>
        <div
          class="card-body form-card"
          style="height: 90vh; overflow: auto;"
          v-if="form"
        >
          <div
            class="question"
            v-for="(question, index) of form.questions"
            :key="question.id"
          >
            <div class="question-content">
              <div class="mb-2">
                <strong>Câu {{ index + 1 }}:</strong>
                <div v-html="question.content"></div>
              </div>
              <div>
                <div class="answer" v-for="(ans, index) of question.answers">
                  <span
                    :class="{ 'text-primary': ans.label === question.solution }"
                    >{{ ans.label }}.</span
                  >
                  <div v-html="ans.content"></div>
                </div>
              </div>
            </div>
            <div style="flex: 0 0 100px; text-align: right">
              <p-button
                size="sm"
                icon
                type="primary"
                :title="'Chỉnh sửa'"
                @click="showUpdateQuestion(index, question)"
              >
                <i class="fa-solid fa-pen-to-square"></i>
              </p-button>
              <p-button
                size="sm"
                icon
                type="danger"
                :title="'Xóa'"
                @click="removeQuestion(index, question)"
              >
                <i class="fa-solid fa-xmark"></i>
              </p-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="Thêm câu hỏi"
      :visible.sync="dialogVisible.create"
      class="dialog-question"
      width="800px"
    >
      <div class="dialog-scroll">
        <label>Câu hỏi</label>
        <my-editor v-model="questionForm.content" height="100"></my-editor>
        <hr />
        <div
          style="margin-top: 15px"
          v-for="(answer, index) of questionForm.answers"
          :key="index"
        >
          <div class="d-flex justify-content-between align-items-center mb-2">
            <el-radio v-model="questionForm.solution" :label="getLabel(index)"
              >Đáp án {{ getLabel(index) }}:</el-radio
            >
            <el-button
              @click="removeAnswer(questionForm, index)"
              v-if="questionForm.answers.length > 1"
              size="mini"
              type="danger"
              >Xóa</el-button
            >
          </div>
          <my-editor height="80" v-model="answer.content"></my-editor>
          <hr />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAnswer">Thêm câu trả lời</el-button>
        <el-button @click="dialogVisible.create = false">Hủy</el-button>
        <el-button type="primary" @click="createQuestion">Thêm</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Chỉnh sử câu hỏi"
      :visible.sync="dialogVisible.update"
      class="dialog-question"
      width="800px"
    >
      <div class="dialog-scroll update" v-if="selectedQuestion">
        <label>Câu hỏi</label>
        <my-editor v-model="selectedQuestion.content" height="100"></my-editor>
        <hr />
        <div
          style="margin-top: 15px"
          v-for="(answer, index) of selectedQuestion.answers"
          :key="index"
        >
          <div class="d-flex justify-content-between align-items-center mb-2">
            <el-radio
              v-model="selectedQuestion.solution"
              :label="getLabel(index)"
              >Đáp án {{ getLabel(index) }}:</el-radio
            >
            <el-button
              @click="removeAnswer(selectedQuestion, index)"
              v-if="selectedQuestion.answers.length > 1"
              size="mini"
              type="danger"
              >Xóa</el-button
            >
          </div>
          <my-editor height="80" v-model="answer.content"></my-editor>
          <hr />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAnswerToSelectedQuestion"
          >Thêm câu trả lời</el-button
        >
        <el-button @click="dialogVisible.update = false">Hủy</el-button>
        <el-button type="primary" @click="updateQuestion()">Cập nhật</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import examForm from "./exam-form.js";
import FormCard from "src/components/UIComponents/FormCard.vue";
import {
  Dialog,
  MessageBox,
  Message,
  Notification,
  Select,
  Option,
  Input,
  DatePicker,
  Radio,
  Button
} from "element-ui";
import MyEditor from "src/components/UIComponents/Editor";
import jQuery from "jquery";

export default {
  components: {
    MyEditor,
    Notification,
    MessageBox,
    Message,
    ElSelect: Select,
    ElOption: Option,
    ElInput: Input,
    ElButton: Button,
    ElDatePicker: DatePicker,
    ElDialog: Dialog,
    ElRadio: Radio,
    FormCard
  },
  data() {
    return {
      form: {
        questions: []
      },
      group: examForm,
      dialogVisible: {
        create: false,
        update: false
      },
      selectedQuestion: {
        content: "",
        answers: [
          {
            label: "A",
            content: ""
          }
        ],
        solution: ""
      },
      selectedQuestionIndex: 0,
      questionForm: {
        content: "",
        answers: [
          {
            label: "A",
            content: ""
          }
        ],
        solution: ""
      }
    };
  },
  computed: {
    exam() {
      const detail = this.$store.state.examDetail;
      return detail;
    }
  },
  watch: {
    exam(nVal, oVal) {
      if (nVal.id) {
        this.form = Object.assign({}, nVal);
      }
    }
  },
  mounted() {
    this.$store.dispatch("setCurrentActions", [
      {
        label: "Tạo",
        type: "primary",
        icon: "",
        callback: this.save
      }
    ]);
  },
  methods: {
    getLabel(index) {
      return String.fromCharCode(65 + index);
    },
    removeAnswer(form, index) {
      form.answers.splice(index, 1);
      form.solution = "";
    },
    nextChar(c) {
      var i = (parseInt(c, 36) + 1) % 36;
      return (!i * 10 + i).toString(36);
    },
    async createQuestion() {
      if (!this.questionForm.solution) {
        return Notification({
          title: "Error",
          message: "Vui lòng chọn đáp án đúng cho câu hỏi này",
          position: "bottom-right",
          type: "error"
        });
      }
      this.questionForm.answers = this.questionForm.answers.map((i, index) => {
        i.label = this.getLabel(index);
        return i;
      });
      this.form.questions.push(Object.assign({}, this.questionForm));
      this.questionForm = Object.assign(
        {},
        {
          content: "",
          answers: [
            {
              label: "A",
              content: ""
            }
          ],
          solution: ""
        }
      );
      this.dialogVisible.create = false;
    },
    async updateQuestion() {
      const html = jQuery("<div></div>").html(this.selectedQuestion.content);
      const imgs = html.find("img");
      for (let i = 0; i < imgs.length; i++) {
        const element = imgs[i];
        const src = jQuery(element).attr("src");
        const base64 = await this.$util.getBase64Image(src);
        jQuery(element).attr("src", base64);
      }
      this.selectedQuestion.content = html.prop("outerHTML");
      if (!this.selectedQuestion.solution) {
        return Notification({
          title: "Error",
          message: "Vui lòng chọn đáp án đúng cho câu hỏi này",
          position: "bottom-right",
          type: "error"
        });
      }
      for (let i = 0; i < this.form.questions.length; i++) {
        if (i === this.selectedQuestionIndex) {
          this.form.questions[i] = JSON.parse(
            JSON.stringify(this.selectedQuestion)
          );
          this.form.questions[i].answers = this.form.questions[i].answers.map(
            (i, index) => {
              i.label = this.getLabel(index);
              return i;
            }
          );
        }
      }
      this.dialogVisible.update = false;
      this.selectedQuestion = null;
    },
    addAnswer() {
      const last = this.questionForm.answers[
        this.questionForm.answers.length - 1
      ];
      this.questionForm.answers.push({
        label: this.nextChar(last.label).toUpperCase(),
        content: ""
      });
      setTimeout(() => {
        jQuery(".dialog-scroll").animate(
          { scrollTop: jQuery(".dialog-scroll").prop("scrollHeight") },
          300
        );
      }, 0);
    },

    addAnswerToSelectedQuestion() {
      const last = this.selectedQuestion.answers[
        this.selectedQuestion.answers.length - 1
      ];
      this.selectedQuestion.answers.push({
        label: this.nextChar(last.label).toUpperCase(),
        content: ""
      });
      setTimeout(() => {
        jQuery(".dialog-scroll.update").animate(
          { scrollTop: jQuery(".dialog-scroll.update").prop("scrollHeight") },
          300
        );
      }, 0);
    },

    showUpdateQuestion(index, question) {
      this.selectedQuestionIndex = index;
      this.selectedQuestion = JSON.parse(JSON.stringify(question));
      this.dialogVisible.update = true;
    },
    removeQuestion(index, question) {
      this.form.questions.splice(index, 1);
      this.$store.dispatch("removeQuestion", question.id);
    },
    async save() {
      try {
        const result = await this.$validator.validateAll();
        if (result) {
          this.form.duration = parseInt(this.form.duration);
          let res = await this.$store.dispatch(
            "createExam",
            Object.assign({}, this.form)
          );
          this.$router.push("/education/exam/" + res.id);
          Notification({
            title: "Success",
            message: "Create succeeded",
            position: "bottom-right",
            type: "success"
          });
        }
      } catch (e) {
        Notification({
          title: "Error",
          message: e.message,
          position: "bottom-right",
          type: "error"
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog-question {
  .el-dialog__body {
    border: 1px solid #ccc;
    border-left: 0;
    border-right: 0;
  }
  .dialog-scroll {
    height: 55vh;
    overflow: auto;
    padding-right: 10px;
  }
  label {
    font-weight: bold;
    color: #444;
    margin-bottom: 0;
  }
}
.question {
  display: flex;
  padding: 15px 0;
  border-top: 1px solid #ddd;
  .question-content {
    flex: 1;

    .answer {
      padding-left: 20px;
      display: flex;
      margin-bottom: 5px;
      p {
        margin-bottom: 0 !important;
      }
      > div {
        flex: 1;
        margin-left: 10px;
        word-break: break-all;
      }
    }
  }
}
</style>
