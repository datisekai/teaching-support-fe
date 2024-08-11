<template lang="html">
  <div class="card">
    <div class="card-header">
      <h6 class="title">Thông tin</h6>
    </div>
    <div class="card-body form-card">
      <div class="row">
        <div class="col-sm-12 p-0">
          <label>Tiêu đề</label>
        </div>
        <div class="col-sm-12 p-0">
          <el-input v-model="form.name"></el-input>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 p-0">
          <label>Mô tả</label>
        </div>
        <div class="col-sm-12 p-0">
          <el-input type="textarea" v-model="form.description"></el-input>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-6 p-0">
          <label>Khoảng thời gian</label>
        </div>
      </div>

      <div class="row">
        <el-date-picker
          class="col-sm-12"
          v-model="form.rangeDate"
          type="datetimerange"
          :picker-options="pickerOptions"
          start-placeholder="Thời gian bắt đầu"
          end-placeholder="Thời gian kết thúc"
        >
        </el-date-picker>
      </div>

      <div class="row">
        <div class="col-sm-12 p-0">
          <el-checkbox v-model="hasCoupon">Coupon</el-checkbox>
          <select-ajax
            :disabled="!hasCoupon"
            key="coupons"
            data-vv-name="couponId"
            v-model="form.couponId"
            :attribute="{
              type: 'coupons',
              field: 'code',
              key: 'id',
              valueKey: 'id',
              initOptions: initOptionsCoupon,
              extraQuery: { department: 'education' }
            }"
          >
          </select-ajax>
        </div>
      </div>

      <hr />
      <div class="row">
        <div class="col-sm-12 p-0">
          <label>Danh sách câu hỏi</label>
          <div class="col-sm-12 p-0">
            <ul>
              <li
                v-for="(question, index) in form.questions"
                :key="index"
                class="each-question"
              >
                <div>
                  <div>
                    <strong>Câu {{ index + 1 }}:</strong> {{ question.content }}
                  </div>
                  <div
                    v-if="question.type == 'radio' || 'checkbox'"
                    style="padding-left: 15px"
                  >
                    <div v-for="ans in question.answerLines">
                      <div>
                        <strong>{{ ans.label }}:</strong> {{ ans.content }}
                      </div>
                    </div>
                  </div>
                </div>
                <div style="flex: 0 0 100px; text-align: right;">
                  <p-button
                    size="sm"
                    icon
                    type="primary"
                    :title="'Chỉnh sửa'"
                    @click="showEditQuestion(index, question)"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </p-button>
                  <p-button
                    size="sm"
                    icon
                    type="danger"
                    :title="'Chỉnh sửa'"
                    @click="removeQuestion(index, question)"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </p-button>
                </div>
              </li>
            </ul>
            <el-button type="text" @click="dialogVisible.create = true"
              >Thêm câu hỏi</el-button
            >
            <el-dialog
              title="Thêm câu hỏi"
              :visible.sync="dialogVisible.create"
              width="30%"
            >
              <div class="el-form-item">
                <label class="d-block">Thể loại câu hỏi</label>
                <el-select
                  v-model="selectedType"
                  default-first-option
                  placeholder="Chọn thể loại câu hỏi"
                >
                  <el-option
                    v-for="q in questionTypes"
                    :key="q.value"
                    :label="q.label"
                    :value="q.value"
                  >
                  </el-option>
                </el-select>
              </div>

              <div class="el-form-item">
                <label>Nhập nội dung câu hỏi</label>
                <el-input
                  type="textarea"
                  v-model="newQuestion.content"
                  placeholder="Nhập câu hỏi vào đây!"
                ></el-input>
              </div>

              <div v-if="selectedType == 'text'">
                <div>You chosed text!</div>
              </div>
              <div v-else>
                <div v-for="line in answerLines">
                  <label>{{ line.label }}</label>
                  <el-input
                    type="textarea"
                    v-model="line.content"
                    placeholder="Nhập câu trả lời"
                  ></el-input>
                </div>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible.create = false">Hủy</el-button>
                <el-button type="primary" @click="createQuestion"
                  >Xác nhận</el-button
                >
              </span>
            </el-dialog>
            <el-dialog
              title="Chỉnh sửa câu hỏi"
              :visible.sync="dialogVisible.edit"
              width="30%"
            >
              <el-input
                type="textarea"
                v-model="selectedQuestion.content"
                placeholder="Nhập câu hỏi vào đây!"
              ></el-input>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible.edit = false"
                  >Cancel</el-button
                >
                <el-button type="primary" @click="updateQuestion"
                  >Confirm</el-button
                >
              </span>
            </el-dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Dialog,
  MessageBox,
  Message,
  Notification,
  Select,
  Option,
  Input,
  DatePicker,
  Checkbox,
  Button
} from "element-ui";
import SelectAjax from "src/components/UIComponents/SelectAjax";

export default {
  components: {
    Notification,
    MessageBox,
    Message,
    ElSelect: Select,
    ElOption: Option,
    ElInput: Input,
    ElButton: Button,
    ElDatePicker: DatePicker,
    ElCheckbox: Checkbox,
    ElDialog: Dialog,
    SelectAjax
  },
  data() {
    return {
      hasCoupon: false,
      form: {
        questions: []
      },
      typeCoupons: [
        {
          value: "percentage",
          label: "Theo phần trăm"
        },
        {
          value: "flat",
          label: "Theo giá trị"
        }
      ],
      dialogVisible: {
        create: false,
        edit: false
      },
      dialogUpdateVisible: false,
      newQuestion: {
        content: ""
      },
      selectedQuestion: {
        index: null,
        content: ""
      },
      selectedType: "text",
      questionTypes: [
        {
          label: "Văn bản",
          value: "text"
        },
        {
          label: "Trắc nghiệm một đáp án",
          value: "radio"
        },
        {
          label: "Trắc nghiệm nhiều đáp án",
          value: "checkbox"
        }
      ],
      answerLines: [
        {
          label: "A",
          content: ""
        },
        {
          label: "B",
          content: ""
        },
        {
          label: "C",
          content: ""
        },
        {
          label: "D",
          content: ""
        },
        {
          label: "E",
          content: ""
        }
      ],
      pickerOptions: {
        disabledDate(time) {
          const date = new Date(time);
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          return date < now;
        }
      }
    };
  },
  computed: {
    survey() {
      return this.$store.state.surveyDetail;
    },
    initOptionsCoupon() {
      if (!this.$store.state.couponDetail.id) return null;
      return [this.$store.state.couponDetail];
    }
  },
  watch: {
    survey(nVal, oVal) {
      if (nVal.id) {
        this.form = Object.assign({}, nVal);
        if (this.form.couponId) {
          this.hasCoupon = true;
          this.$store.dispatch("fetchCouponDetail", this.form.couponId);
        }
      }
    }
  },
  mounted() {
    this.$store.dispatch("setPageTitle", "Quản lý khảo sát giáo dục");
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
    showEditQuestion(index, question) {
      this.selectedQuestion.index = index;
      this.selectedQuestion.content = question.content;
      this.dialogVisible.edit = true;
    },
    async createQuestion() {
      const question = Object.assign({}, this.newQuestion);
      question.type = this.selectedType;
      if (["radio", "checkbox"].includes(question.type)) {
        question.answerLines = this.answerLines;
      }
      this.form.questions.push(question);
      this.newQuestion = {
        content: ""
      };
      (this.selectedType = "text"),
        (this.answerLines = [
          {
            label: "A",
            content: ""
          },
          {
            label: "B",
            content: ""
          },
          {
            label: "C",
            content: ""
          },
          {
            label: "D",
            content: ""
          },
          {
            label: "E",
            content: ""
          }
        ]),
        (this.dialogVisible.create = false);
    },
    updateQuestion() {
      for (let index = 0; index < this.form.questions.length; index++) {
        if (index === this.selectedQuestion.index) {
          this.form.questions[index].content = this.selectedQuestion.content;
        }
      }
      this.selectedQuestion = {
        index: null,
        content: ""
      };
      this.dialogVisible.edit = false;
    },
    removeQuestion(index, question) {
      MessageBox.confirm("Bạn có chắc chắn xóa câu hỏi không?", "Warning", {
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ",
        type: "warning",
        center: true
      })
        .then(() => {
          this.form.questions.splice(index, 1);
        })
        .catch(() => {});
    },
    async save() {
      const result = await this.$validator.validateAll();
      if (!result) return;
      const [startDate, expiredDate] = this.form.rangeDate;
      delete this.form.rangeDate;
      const form = Object.assign({}, this.form);
      form.startDate = startDate;
      form.expiredDate = expiredDate;
      if (!this.hasCoupon) {
        delete form.couponId;
      }
      try {
        let res = await this.$store.dispatch(
          "createSurvey",
          Object.assign({}, form, { department: "customer_service" })
        );
        for (const question of form.questions) {
          await this.$store.dispatch(
            "createQuestionSurvey",
            Object.assign({}, { surveyId: res.id }, question)
          );
        }
        Notification({
          title: "Success",
          message: "Create succeeded",
          position: "bottom-right",
          type: "success"
        });
        this.$router.push("/education/survey/" + res.id);
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
.el-dialog .el-select {
  width: 100%;
}
.survey-questions {
  margin: 10px;
}
.each-question {
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
}
</style>
