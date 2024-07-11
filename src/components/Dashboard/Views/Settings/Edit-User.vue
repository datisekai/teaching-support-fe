<template lang="html">
  <div class="row">
    <div class="col-lg-8 col-md-8 col-sm-12">
      <form-card
        v-for="(group, index) of centerGroups"
        :key="'groupleft' + index"
        :group="group"
        v-model="form"
      ></form-card>
      <div class="card" v-if="$util.checkChangePassword($route.params.id)">
        <div class="card-header">
          <h6 class="title pull-left">{{$t('el.formCardTitle.changePassword')}}</h6>
          <div class="pull-right">
            <a class="btn-link" @click="changePassword = !changePassword">{{$t('el.button.clickToChangePassword')}}</a>
          </div>
        </div>
        <div class="card-body form-card" v-if="changePassword">
          <div v-if="!isAdmin() || isOwned()" class="row">
            <div class="col-sm-12 p-0">
              <label class="required">{{$t('el.formCard.oldPassword')}}</label>
            </div>
            <div class="col-sm-12 p-0">
              <el-input
                type="password"
                class="full-width"
                data-vv-name="oldPassword"
                v-model="oldPassword"
                v-validate="'required'"
                :data-vv-as="$t('el.formCard.oldPassword')"
                :placeholder="$t('el.formCard.oldPassword')"
                :class="errors.has('oldPassword')?'border-danger':''"
              ></el-input>
              <span class="text-danger" v-if="errors.has('oldPassword')">{{ errors.first('oldPassword') }}</span>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12 p-0">
              <label class="required">{{$t('el.formCard.newPassword')}}</label>
            </div>
            <div class="col-sm-12 p-0">
              <el-input
                type="password"
                class="full-width"
                data-vv-name="newPassword"
                v-model="newPassword"
                v-validate="'required'"
                :placeholder="$t('el.formCard.newPassword')"
                :data-vv-as="$t('el.formCard.newPassword')"
                :class="errors.has('newPassword')?'border-danger':''"
              ></el-input>
              <span class="text-danger" v-if="errors.has('newPassword')">{{ errors.first('newPassword') }}</span>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12 p-0">
              <label class="required">{{$t('el.formCard.repeatPassword')}}</label>
            </div>
            <div class="col-sm-12 p-0">
              <el-input
                type="password"
                class="full-width"
                autocomplete="off"
                data-vv-name="repeatPassword"
                v-model="repeatPassword"
                v-validate="'required|checkpassword'"
                :placeholder="$t('el.formCard.repeatPassword')"
                :data-vv-as="$t('el.formCard.repeatPassword')"
                :class="errors.has('repeatPassword')?'border-danger':''"
              ></el-input>
              <span class="text-danger" v-if="errors.has('repeatPassword')">{{ errors.first('repeatPassword') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-md-4 col-sm-12">
      <div class="card">
        <div class="card-header">
          <h6 class="title">{{$t('el.formCardTitle.role')}}</h6>
        </div>
        <div class="card-body form-card">
          <my-select
            class="full-width"
            data-vv-name="role"
            v-model="form.role"
            v-validate="'required'"
            :disabled="!isAdmin()"
            :data-vv-as="$t('el.formCard.role')"
            :placeholder="$t('el.formCard.role')"
            :attribute="{options: $util.getOptions('role')}"
            :class="errors.has('role')?'border-danger':''"
          >
          </my-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FormCard from 'src/components/UIComponents/FormCard.vue';
import { MessageBox, Input, Button, Notification } from 'element-ui';
import { mapState } from 'vuex';
import MySelect from 'src/components/UIComponents/Select';
import dataFrom from './user-form';

const _form = {}; let firstGroups;

export default {
  components: {
    ElInput: Input,
    ElButton: Button,
    FormCard,
    MySelect,
  },
  beforeCreate() {
    firstGroups = dataFrom[0].groups;
    firstGroups.forEach((group) => {
      group.attributes.forEach((attr) => {
        if (attr.multiple && _form[attr.prop]) {
          _form[attr.prop] = [];
        } else {
          _form[attr.prop] = '';
        }
        attr.value = _form[attr.prop];
      });
    });
  },
  created() {
    const self = this;
    this.$validator.extend('checkpassword', {
      getMessage(field, val) {
        return self.$t('el.translate.passwordNotMatch');
      },
      validate(value, field) {
        const newPassword = self.newPassword;
        const repeatPassword = self.repeatPassword;
        return newPassword == repeatPassword;
      },
    });
  },
  data() {
    return {
      form: _form,
      centerGroups: firstGroups,
      oldPassword: '',
      newPassword: '',
      repeatPassword: '',
      changePassword: false,
      userId: null
    };
  },
  computed: {
    ...mapState(['userDetail', 'user'])
  },
  mounted() {
    this.userId = this.$route.params.id;
    this.$store.dispatch('fetchUserDetail', this.userId);
    this.$store.dispatch('setPageTitle', 'accountUpdate');
    this.$store.dispatch('setCurrentActions', [{
      label: 'delete',
      type: 'danger',
      icon: '',
      callback: this.remove,
    }, {
      label: 'update',
      type: 'primary',
      icon: '',
      callback: this.save,
    }]);
    window.user = this.user;
  },
  methods: {
    remove() {
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        if (this.isOwned()) {
          return Notification({
            title: 'Delete canceled',
            message: 'Can not delete yourself!',
            position: 'bottom-right',
            type: 'error',
          });
        }
        this.$store.dispatch('removeUser', this.userId).then((res) => {
          Notification ({
            title: 'Success',
            message: 'Delete completed',
            position: 'bottom-right',
            type: 'success',
          });
          this.$router.push({ name: 'AllUsers' });
        });
      }).catch(() => {
        Notification ({
          title: 'Canceled',
          message: 'Delete canceled',
          position: 'bottom-right',
          type: 'info',
        });
      });
    },
    save() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          if (this.changePassword) {
            this.form.password = this.password;
          }
          this.$store.dispatch('updateUser', this.form).then((result) => {
            Notification({
              title: 'Success',
              message: 'Update succeeded',
              position: 'bottom-right',
              type: 'success',
            });
          }).catch((error) => {
            Notification({
              title: 'Error',
              message: error.message,
              position: 'bottom-right',
              type: 'error',
            });
          });
        }
      });
    },
    isOwned() {
      return this.userId == this.user.id;
    },
    isAdmin() {
      return this.user.role === 'admin';
    }
  },
  watch: {
    userDetail(newValue, oldValue) {
      if (newValue) {
        this.form = {
          ...this.form,
          ...newValue
        };
      }
    },
  },
  destroyed() {
    this.$store.dispatch('setCurrentActions', []);
  },
};
</script>
