<template>
  <div class="row">
    <div class="col-sm-12 col-md-8 offset-md-2">
      <div class="card form-card">
        <div class="card-header">
          <h6 class="title">{{$t('el.formCardTitle.notification')}} </h6>
        </div>
        <div class="card-body">
          <el-form :model="formNotification" label-width="140px" data-vv-scope="formNotification">
            <el-form-item :label="$t('el.formCard.type')" :required="true">
              <my-select
                class="full-width"
                data-vv-name="type"
                v-validate="'required'"
                v-model="formNotification.type"
                :attribute="{options: $util.getOptions('notificationType')}"
                :placeholder="$t('el.formCard.type')"
                :class="errors.has('type')?'border-danger':''"
                :data-vv-as="$t('el.formCard.type')"
              >
              </my-select>
              <span class="text-danger" v-if="errors.has('formNotification.type')">{{ errors.first('formNotification.type') }}</span>
            </el-form-item>
            <el-form-item :required="true" :label="$t('el.formCard.reference')" v-if="formNotification.type !== 'news'">
              <select-ajax
                data-vv-name="reference"
                v-model="formNotification.reference"
                v-validate="'required'"
                :data-vv-as="$t('el.formCard.reference')"
                :class="errors.has('form.categoryIds')?'border-danger':''"
                :attribute="selectAjaxAttribute"
              ></select-ajax>
              <span class="text-danger" v-if="errors.has('formNotification.reference')">{{ errors.first('formNotification.reference') }}</span>
              <template v-if="formNotification.reference">
                <div class="mt-2">
                  <label>Chi tiết:</label>
                  <router-link v-if="!notificationRef.error" :to="notificationRef.link">
                    {{notificationRef.title}}
                  </router-link>
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
                class="full-width"
                type="datetime"
                v-model="formNotification.sendAt"
                v-validate="'required'"
                :placeholder="$t('el.formCard.sendAt')"
                :picker-options="pickerOptions"
                data-vv-name="sendAt"
                :data-vv-as="$t('el.formCard.sendAt')"
              >
              </el-date-picker>
              <p class="text-danger" v-if="errors.has('formNotification.sendAt')">{{ errors.first('formNotification.sendAt') }}</p>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <div class="page-action">
        <el-button @click="cancel">{{$t('el.button.cancel')}}</el-button>
        <el-button type="primary" @click="save">{{$t('el.button.create')}}</el-button>
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
import MySelect from "src/components/UIComponents/Select";
import SelectAjax from "src/components/UIComponents/SelectAjax";
import notificationGroups from './notification-form';

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
    selectAjaxAttribute() {
      return {
        type: this.formNotification.type, 
        field: 'title', 
        multiple: false,
      };
    }
  },
  data() {
    return {
      notificationRef: {
        link: '',
        title: '',
      },
      formGroup: {...notificationGroups.create},
      formNotification: {
        title: '',
        content: '',
        type: 'news',
        reference: null,
        referenceId: '',
        sendAt: null,
        isBroadcast: true,
        topic: 'mobile'
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
    this.$store.dispatch('setPageTitle', 'notificationCreate');
  },
  methods: {
    cancel() {
      this.$router.push({ name: 'AllNotifications' });
    },
    async save() {
      const validateResult = await this.$validator.validateAll('formNotification');
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

      try {
        const noti = await this.$store.dispatch('storeNotification', formData);
        Notification({
          title: 'Success',
          message: 'Create succeeded',
          position: 'bottom-right',
          type: 'success',
        });
        setTimeout(() => {
          this.$router.push({name: 'EditNotification', params: {id: noti.id}});
        }, 1000);
        
      } catch (error) {
        return Notification ({
          title: 'Error',
          message: 'Create failed: ' + error.message,
          position: 'bottom-right',
          type: 'error',
        });
      }
    },
  },
  watch: {
    'formNotification.type': function(newVal, oldVal) {
      if (newVal) {
        this.formNotification.reference = null;
        this.formNotification.title = '';
      }
    },
    'formNotification.reference': function(newVal) {
      if (newVal) {
        this.formNotification.referenceId = newVal.id + '';
        const ref = this.notificationRef;
        if (this.formNotification.type === 'campaign') {
          ref.link = '/campaign/' + newVal.id;
          ref.title = newVal.title + `: ${this.$util.formatDateTime(newVal.startDate)} - ${this.$util.formatDateTime(newVal.expiredDate)}`;
        }

        if (this.formNotification.type === 'flashsale') {
          ref.link = '/flashsale/' + newVal.id;
          ref.title = newVal.title + `: ${this.$util.formatDateTime(newVal.startDate)} - ${this.$util.formatDateTime(newVal.expiredDate)}`;
        }

        this.formNotification.title = newVal.title;
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
