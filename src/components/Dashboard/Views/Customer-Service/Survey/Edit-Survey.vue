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
                    <el-input :disabled="disabledUpdate" v-model="form.name"></el-input>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12 p-0">
                    <label>Mô tả</label>
                </div>
                <div class="col-sm-12 p-0">
                    <el-input :disabled="disabledUpdate" type="textarea" v-model="form.description"></el-input>
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
                :disabled="survey.status !== 'new'"
                v-model="rangeDate"
                type="datetimerange"
                :picker-options="pickerOptions"
                start-placeholder="Thời gian bắt đầu"
                end-placeholder="Thời gian kết thúc">
                </el-date-picker>
            </div>

            <div class="row">
                <div class="col-sm-12 p-0">
                    <el-checkbox :disabled="disabledUpdate" v-model="hasCoupon">Coupon</el-checkbox>
                    <select-ajax
                        :disabled="!hasCoupon || disabledUpdate"
                        key="coupons"
                        data-vv-name="couponId"
                        v-model="form.couponId"
                        :attribute="{type: 'coupons', field: 'code', key: 'id', valueKey: 'id', initOptions: initOptionsCoupon, extraQuery: {department: 'customer_service'}}"
                    >
                    </select-ajax>
                </div>
            </div>

            <hr/>
            <div class="row">
                <div class="col-sm-12 p-0">
                    <label>Danh sách câu hỏi</label>
                    <div class="col-sm-12 p-0">
                        <div class="survey-questions">
                            <div class="each-question" v-for="(question, index) in form.questions" :key="index">
                                <div>
                                    <div><strong>Câu {{ index+1 }} </strong> ({{$t(`el.questionTypes.${question.type}`)}}): {{ question.content }}</div>
                                    <div v-if="question.type == 'radio' || 'checkbox'" style="padding-left: 15px">
                                        <div v-for="ans in question.answerLines">
                                            <div><strong>{{ ans.label }}:</strong> {{ans.content}}</div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p-button
                                        size="sm"
                                        icon
                                        type="primary"
                                        :title="'Chỉnh sửa'"
                                        @click="popupUpdateQuestion(index, question)">
                                        <i class="nc-icon nc-ruler-pencil"></i>
                                    </p-button>
                                    <p-button
                                        size="sm"
                                        icon
                                        type="danger"
                                        :title="'Xóa'"
                                        @click="removeQuestion(index, question)">
                                        <i class="nc-icon nc-simple-remove"></i>
                                    </p-button>
                                </div>
                            </div>
                        </div>
                        <el-button v-if="!disabledUpdate" type="text" @click="dialogVisible.create = true">Thêm câu hỏi</el-button>
                        <el-dialog
                            title="Thêm câu hỏi"
                            :visible.sync="dialogVisible.create"
                            width="30%">
                            <div class="el-form-item">
                                <label class="d-block">Thể loại câu hỏi</label>
                                <el-select
                                    v-model="formAddQuestion.type"
                                    default-first-option
                                    placeholder="Chọn thể loại câu hỏi">
                                    <el-option
                                    v-for="q in questionTypes"
                                    :key="q.value"
                                    :label="q.label"
                                    :value="q.value">
                                    </el-option>
                                </el-select>
                            </div>
                            
                            <div class="el-form-item">
                                <label>Nhập nội dung câu hỏi</label>
                                <el-input type="textarea" v-model="formAddQuestion.content" placeholder="Nhập câu hỏi vào đây!"></el-input>
                            </div>

                            <div v-if="formAddQuestion.type=='text'">
                                <div>You chosed text!</div>
                            </div>
                            <div v-else>
                                <div v-for="line in answerLines">
                                    <label>{{line.label}}</label>
                                    <el-input type="textarea" v-model="line.content" placeholder="Nhập câu trả lời"></el-input>
                                </div>
                            </div>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="dialogVisible.create = false">Hủy</el-button>
                                <el-button type="primary" @click="createQuestion">Xác nhận</el-button>
                            </span>
                        </el-dialog>
                        <el-dialog
                            title="Chỉnh sửa câu hỏi"
                            :visible.sync="dialogVisible.update"
                            width="30%">
                            <div class="el-form-item">
                                <label class="d-block">Thể loại câu hỏi</label>
                                <el-select
                                    v-model="formUpdateQuestion.type"
                                    default-first-option
                                    placeholder="Chọn thể loại câu hỏi">
                                    <el-option
                                    v-for="q in questionTypes"
                                    :key="q.value"
                                    :label="q.label"
                                    :value="q.value">
                                    </el-option>
                                </el-select>
                            </div>
                            
                            <div class="el-form-item">
                                <label>Nhập nội dung câu hỏi</label>
                                <el-input type="textarea" v-model="formUpdateQuestion.content" placeholder="Nhập câu hỏi vào đây!"></el-input>
                            </div>

                            <div v-if="formUpdateQuestion.type=='text'">
                            </div>
                            <div v-else>
                                <div v-for="line in formUpdateQuestion.answerLines">
                                    <label>{{line.label}}</label>
                                    <el-input type="textarea" v-model="line.content" placeholder="Nhập câu trả lời"></el-input>
                                </div>
                            </div>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="dialogVisible.update = false">Hủy</el-button>
                                <el-button type="primary" @click="updateQuestion">Cập nhật</el-button>
                            </span>
                        </el-dialog>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {Dialog, MessageBox, Message, Notification,Select, Option, Input, DatePicker, Checkbox, Button} from 'element-ui';
import SelectAjax from 'src/components/UIComponents/SelectAjax';
import moment from 'moment';

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
        form: {},
        typeCoupons: [{
            value: 'percentage',
            label: 'Theo phần trăm'
        }, {
            value: 'flat',
            label: 'Theo giá trị'
        }],
        dialogVisible: {
            create: false,
            edit: false
        },
        dialogUpdateVisible: false,
        formAddQuestion: {
            type: 'text',
            content: '',
        },
        questionTypes: [
            {
                label: 'Văn bản',
                value: 'text'
            },
            {
                label: 'Trắc nghiệm một đáp án',
                value: 'radio'
            },
            {
                label: 'Trắc nghiệm nhiều đáp án',
                value: 'checkbox'
            },
        ],
        answerLines: [
            {
                label: "A",
                content: '',
            },
            {
                label: "B",
                content: ''
            },
            {
                label: "C",
                content: ''
            },
            {
                label: "D",
                content: ''
            },
            {
                label: "E",
                content: ''
            }
        ],
        formUpdateQuestion: {
            type: '',
            content: '',
            answerLines: [
                {
                    label: "A",
                    content: ''
                },
                {
                    label: "B",
                    content: ''
                },
                {
                    label: "C",
                    content: ''
                },
                {
                    label: "D",
                    content: ''
                },
                {
                    label: "E",
                    content: ''
                }
            ],
        },
        selectedQuestion: {
            index: null,
            content: ''
        },
        pickerOptions: {
            disabledDate(time) {
                const date = new Date(time);
                const now = new Date();
                now.setHours(0,0,0,0);
                return date < now;
            }
        },
        rangeDate: null
    }
  },
  computed: {
      survey() {
          return this.$store.state.surveyDetail
      },
      initOptionsCoupon() {
          if (!this.$store.state.couponDetail.id) return null
          return [this.$store.state.couponDetail]
      },
       disabledUpdate() {
        const now = new Date();
        return now > new Date(this.survey.startDate)
      }
  },
  watch: {
      survey(nVal, oVal) {
          if (nVal.id) {
              this.form = Object.assign({}, nVal);
              this.rangeDate = [this.form.startDate, this.form.expiredDate];
              if (this.form.couponId) {
                this.hasCoupon = true
                this.$store.dispatch('fetchCouponDetail', this.form.couponId)
              }
               if (!this.disabledUpdate) {
                    this.$store.dispatch('setCurrentActions', [{
                        label: 'Cập nhật',
                        type: 'primary',
                        icon: '',
                        callback: this.save,
                    }]);
                } else {
                    this.$store.dispatch('setCurrentActions', []);
                }
          }
      }
  },
  mounted() {
    const id = this.$route.params.id;
    this.$store.dispatch('fetchSurveyDetail', id);
    this.$store.dispatch('setPageTitle', 'Quản lý khảo sát chăm sóc khách hàng');
    this.$store.dispatch('setCurrentActions', []);
  },
  methods: {
    popupUpdateQuestion(index, question) {
        this.dialogVisible.update = true;
        this.formUpdateQuestion.id = question.id;
        this.formUpdateQuestion.type = question.type;
        this.formUpdateQuestion.content = question.content;
        if(question.answerLines) {
            question.answerLines.forEach(line => {
                this.formUpdateQuestion.answerLines.forEach(ans => {
                    if(ans.label === line.label) {
                        ans.content = line.content;
                    }
                })
            })
        }
    },
    showEditQuestion(index, question) {
        this.selectedQuestion.index = index
        this.selectedQuestion.content = question.content
        this.dialogVisible.edit = true
    },
    async createQuestion() {
        try{
            if(this.formAddQuestion.type === 'radio' || this.formAddQuestion.type === 'checkbox') {
                this.formAddQuestion.answerLines = this.answerLines.filter(line => line.content != '');
            }
            let q =  await this.$store.dispatch('createSurveyQuestion', Object.assign({}, {
                form: this.formAddQuestion,
                surveyId: this.form.id
            }))     
            this.form.questions.push(Object.assign({}, this.formAddQuestion, {id: q.id}));
            this.formAddQuestion = {
                type: 'text',
                content: '',
            }
            this.answerLines = [
                {
                    label: "A",
                    content: '',
                },
                {
                    label: "B",
                    content: ''
                },
                {
                    label: "C",
                    content: ''
                },
                {
                    label: "D",
                    content: ''
                },
                {
                    label: "E",
                    content: ''
                }
            ]
            this.dialogVisible.create = false
            return  Notification({
            title: 'Success',
            message: 'Đã tạo câu hỏi',
            position: 'bottom-right',
            type: 'success',
        });
        } catch(e) {
            return  Notification({
                title: 'Error',
                message: e.message,
                position: 'bottom-right',
                type: 'error',
            });
        }
    },
    async updateQuestion(){
        try{
            if(this.formUpdateQuestion.type === 'radio' || this.formUpdateQuestion.type === 'checkbox') {
                this.formUpdateQuestion.answerLines = this.formUpdateQuestion.answerLines.filter(line => line.content != '');
            }
            this.formUpdateQuestion.surveyId = this.$route.params.id;
            let q =  await this.$store.dispatch('updateSurveyQuestion', Object.assign({}, this.formUpdateQuestion));
            
            //this.form.questions.push(Object.assign({}, this.formUpdateQuestion, {id: q.id}))
            this.$store.dispatch('fetchSurveyDetail', this.$route.params.id);

            //reset quesstion
            this.formUpdateQuestion = {
                type: '',
                content: '',
                answerLines: [
                    {
                        label: "A",
                        content: ''
                    },
                    {
                        label: "B",
                        content: ''
                    },
                    {
                        label: "C",
                        content: ''
                    },
                    {
                        label: "D",
                        content: ''
                    },
                    {
                        label: "E",
                        content: ''
                    }
                ],
            }
            //hide dialog
            this.dialogVisible.update = false
            return  Notification({
            title: 'Success',
            message: 'Cập nhật câu hỏi thành công',
            position: 'bottom-right',
            type: 'success',
        });
        } catch(e) {
            return  Notification({
                title: 'Error',
                message: e.message,
                position: 'bottom-right',
                type: 'error',
            });
        }
    },
    removeQuestion(index, question){
        MessageBox.confirm('Bạn có chắc chắn xóa câu hỏi không?', 'Warning', {
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy bỏ',
            type: 'warning',
            center: true,
        }).then(() => {
            this.$store.dispatch('removeSurveyQuestion', question.id).then((res) => {
            Message({
                message: 'Đã xóa',
                type: 'success'
                });
            }, error => {
            Message({
                message: res.message,
                type: 'error'
                });
            });
        }).catch(() => {
        });
    },
    async save() {
        try {
            const result = await this.$validator.validateAll()
            if (result) {
                const [startDate, expiredDate] = this.rangeDate;
                if (!this.hasCoupon) {
                    delete this.form.couponId
                }
                let res = await this.$store.dispatch('updateSurvey', Object.assign({}, this.form, {startDate, expiredDate}))
                const id = this.$route.params.id;
                await this.$store.dispatch('fetchSurveyDetail', id);
                Notification({
                    title: 'Success',
                    message: 'Update succeeded',
                    position: 'bottom-right',
                    type: 'success',
                });
            }
        } catch(e) {
            Notification({
                title: 'Error',
                message: e.message,
                position: 'bottom-right',
                type: 'error',
            });
        }
    }
  }
}

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