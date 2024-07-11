<template>
  <div class="row">
    <div class="col-sm-12 col-md-8 offset-md-2">
       <div class="card form-card">
        <div class="card-header">
          <h6 class="title">{{$t('el.formCardTitle.notification')}} </h6>
        </div>
        <div class="card-body">
          <el-form :disabled="!canEdit" :model="formNotification" label-width="140px" data-vv-scope="formNotification">
            <el-form-item :label="$t('el.formCard.type')" :required="true">
              <my-select
                class="full-width"
                data-vv-name="type"
                v-validate="'required'"
                v-model="formNotification.type"
                :disabled="true"
                :placeholder="$t('el.formCard.type')"
                :class="errors.has('type')?'border-danger':''"
                :data-vv-as="$t('el.formCard.type')"
                :attribute="{options: $util.getOptions('notificationType')}"
              >
              </my-select>
              <span class="text-danger" v-if="errors.has('formNotification.type')">{{ errors.first('formNotification.type') }}</span>
            </el-form-item>
            <el-form-item v-if="formNotification.referenceId" :label="$t('el.formCard.reference')">
              <template v-if="formNotification.referenceId">
                <div>
                  <router-link v-if="!notificationRef.error" :to="notificationRef.link">
                    {{notificationRef.title}}
                  </router-link>
                  <div v-else class="alert alert-danger">
                    {{notificationRef.error}}
                  </div>      
                </div>
              </template>
            </el-form-item>
             <el-form-item :label="$t('el.formCard.topic')" :required="true">
              <my-select
                class="full-width"
                data-vv-name="topic"
                v-validate="'required'"
                v-model="formNotification.topic"
                :attribute="{options: $util.getOptions('notificationTopic')}"
                :placeholder="$t('el.formCard.topic')"
                :class="errors.has('topic')?'border-danger':''"
                :data-vv-as="$t('el.formCard.topic')"
              >
              </my-select>
              <span class="text-danger" v-if="errors.has('formNotification.topic')">{{ errors.first('formNotification.topic') }}</span>
            </el-form-item>
            <el-form-item :required="true" :label="$t('el.formCard.title')">
              <el-input
                type="text"
                v-model="formNotification.title"
                data-vv-name="title"
                v-validate="'required|min:10'"
                :placeholder="$t('el.formCard.title')"
                :class="errors.has('title')?'border-danger':''"
                :data-vv-as="$t('el.formCard.title')"
              ></el-input>
              <span class="text-danger" v-if="errors.has('formNotification.title')">{{ errors.first('formNotification.title') }}</span>
            </el-form-item>
            <el-form-item :required="true" :label="$t('el.formCard.content')">
              <el-input
                type="textarea"
                v-model="formNotification.content"
                data-vv-name="content"
                v-validate="'required|min:10'"
                :placeholder="$t('el.formCard.content')"
                :class="errors.has('content')?'border-danger':''"
                :data-vv-as="$t('el.formCard.content')"
                rows="5"
              >
              </el-input>
              <span class="text-danger" v-if="errors.has('formNotification.content')">{{ errors.first('formNotification.content') }}</span>
            </el-form-item>
            <el-form-item :required="true" :label="$t('el.formCard.sendAt')">
              <el-date-picker
                type="datetime"
                class="full-width"
                v-model="formNotification.sendAt"
                v-validate="'required'"
                :placeholder="$t('el.formCard.sendAt')"
                :picker-options="pickerOptions"
                data-vv-name="sendAt"
                :data-vv-as="$t('el.formCard.sendAt')"
              >
              </el-date-picker>
              <span class="text-danger" v-if="errors.has('formNotification.sendAt')">{{ errors.first('formNotification.sendAt') }}</span>
            </el-form-item>
            <el-form-item v-if="notificationDetail.isProcessed" :label="$t('el.formCard.processedAt')">
              {{$util.formatDateTime(notificationDetail.processedAt)}}
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <div v-if="canEdit" class="container-fluid">
      <div class="page-action">
        <el-button type="primary" @click="save">{{$t('el.button.update')}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { 
  Form,
  FormItem,
  Select, 
  Option, 
  Button, 
  Input, 
  DatePicker, 
  Radio, 
  RadioGroup, 
  Switch, 
  MessageBox, 
  Notification, 
} from 'element-ui';
import SelectAjax from "src/components/UIComponents/SelectAjax";
import MySelect from "src/components/UIComponents/Select";

export default {
  components: {
    ElButton: Button,
    ElInput: Input,
    ElRadio: Radio,
    ElSelect: Select,
    ElOption: Option,
    ElSwitch: Switch,
    ElDatePicker: DatePicker,
    ElForm: Form,
    ElFormItem: FormItem,
    SelectAjax,
    MySelect,
  },
  computed: {
    ...mapState(['notificationDetail']),
    canEdit() {
      // return !this.notificationDetail.isProcessed;
      return true;
    },
    selectAjaxAttribute() {
      return {
        type: this.formNotification.type, 
        field: 'title', 
        multiple: false,
        valueKey: 'id',
      };
    }
  },
  data() {
    return {
      notificationRef: {
        link: '',
        title: '',
        error: ''
      },
      formNotification: {
        id: null,
        title: '',
        content: '',
        type: '',
        sendAt: null,
        isBroadcast: true,
      },
      notificationTypes: ['news', 'campaign', 'flashsale'],
      pickerOptions: {
        disabledDate(time) {
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          return time.getTime() < now.getTime();
        },
      },
    };
  },
  async mounted() {
    await this.reloadNotification();
    await this.$store.dispatch('fetchNotificationDetail', this.$route.params.id);
    this.$store.dispatch('setPageTitle', 'notification detail');
    const actions = [{
      label: 'Send',
      type: 'warning',
      icon: 'nc-icon nc-send',
      callback: this.send,
    },{
      label: 'delete',
      type: 'danger',
      icon: '',
      callback: this.remove,
    }];
    if (this.canEdit) {
      actions.push({
        label: 'update',
        type: 'primary',
        icon: '',
        callback: this.save,
      });
    }

    this.$store.dispatch('setCurrentActions', actions);
  },
  methods: {
    async fetchNotificationReference() {
      const ref = this.notificationRef;
      if (this.formNotification.type === 'campaign') {
        try {
          const campaign = await this.$store.dispatch(`fetchCampaignDetail`, this.formNotification.referenceId);
          ref.link = '/campaign/' + campaign.id;
          ref.title = campaign.title;
        } catch (error) {
          ref.error = 'Chiến dịch không tồn tại hoặc đã bị xóa';
        }
      } else if (this.formNotification.type === 'flashsale') {
        try {
          const flashsale = await this.$store.dispatch(`fetchFlashsaleDetail`, this.formNotification.referenceId);
          ref.link = '/flashsale/' + flashsale.id;
          ref.title = flashsale.title;
          
        } catch (error) {
          ref.error = 'Flashsale không tồn tại hoặc đã bị xóa'
        }
      }
    },
    async send() {
      MessageBox.confirm('Thông báo sẽ được gửi cho tất cả người sử dụng trong hệ thống.\nBạn có chắc chắn muốn gửi không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(async () => {
        try {
          const sendingResult = await this.$store.dispatch('sendNotification', this.$route.params.id);
          Notification ({
            title: 'Success',
            message: `Send succeeded`,
            position: 'bottom-right',
            type: 'success',
          });
        } catch (error) {
          Notification ({
            title: 'Error',
            message: `Failed: ${error.message}`,
            position: 'bottom-right',
            type: 'error',
          });
        }

      });
    },
    async save() {
      const validateResult = await this.$validator.validateAll();
      if (!validateResult) {
        return Notification ({
          title: 'Error',
          message: 'Validate failed',
          position: 'bottom-right',
          type: 'error',
        });
      }
      const formData = {...this.formNotification};
      if (this.formNotification.referenceId) {
        formData.referenceId = formData.referenceId + '';
      } else {
        delete formData.referenceId;
      }
      await this.$store.dispatch('updateNotification', formData);
      Notification({
        title: 'Success',
        message: 'Update succeeded',
        position: 'bottom-right',
        type: 'success',
      });
    },
    async remove() {
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        return this.$store.dispatch(`deleteNotification`, this.$route.params.id);
      }).then(() => {
        this.$router.push({ name: 'AllNotifications' });
      });
    },
    async reloadNotification() {
      await this.$store.dispatch('fetchNotificationDetail', this.$route.params.id);
    }
  },
  watch: {
    notificationDetail: function(newVal, oldVal) {
      if (newVal) {
        this.formNotification = {...newVal, referenceId: parseInt(newVal.referenceId)};
      }
    },
    'formNotification.type': function(newVal, oldVal) {
      if (newVal) {
        this.formNotification.reference = null;
        this.formNotification.title = '';
      }
    },
    'formNotification.referenceId': function(newVal) {
      if (newVal) {
        this.fetchNotificationReference();
      }
    },
  },
  destroyed() {
    this.$store.dispatch('setCurrentActions', []);
  },
};
</script>
<style lang="scss">
  .el-table .td-actions{
    button.btn {
      margin-right: 5px;
    }
  }

  ul.image-list {
    max-width: 100%;
    padding-left: 0;
    overflow-x: auto;
    li {
      display: inline-block;
      margin-right: 5px;
    }
    a {
      display: block;
      width: 100px;
      height: 100px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      border: 1px solid gray;
      border-radius: 3px;
    }
  }
</style>
