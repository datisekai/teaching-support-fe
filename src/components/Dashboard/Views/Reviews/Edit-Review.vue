<template>
  <div class="">
    <my-card raised class="form-card">
      <h6 slot="header">{{$t('el.formCard.reviewDetail')}}</h6>
      <div class="mb-4">
        <label for="">{{$t('el.formCard.reviewContent')}}</label>
        <div v-html="review.content"></div>
      </div>
      <div class="mb-4">
        <label for="">{{$t('el.formCard.status')}}</label>
        <span 
          class="p-badge badge-pill" 
          :class="{'badge-success': review.status === 'approved', 'badge-danger': review.status === 'rejected', 'badge-default': review.status === 'pending'}"
          >
          {{review.status}}
        </span>
      </div>
      <div class="mb-4">
        <label for="">{{$t('el.formCard.rating')}}: </label>
        <i v-for="(item, index) in Array.from({length: review.rating})" :key="index" class="fa fa-star rating-star"></i>
      </div>
      <div class="mb-4" v-if="review.images && review.images.length">
        <label for="">{{$t('el.formCard.images')}}</label>
        <ul class="image-list">
          <li v-for="(reviewImage, index) in review.images" :key="index">
            <a target="_blank" :href="reviewImage.src" :style="{backgroundImage: 'url(' + reviewImage.large + ')'}"></a>
          </li>
        </ul>
      </div>
    </my-card>
    <my-card raised>
      <h6 slot="header">{{$t('el.formCard.replies')}}</h6>
      <div class="row">
        <div class="col-lg-3 col-md-6 col-sm-6 col-6">
          <column-toggle
            v-model="columnDefs"
            @input="cols => this.$refs['table'].updateColumns(cols)"
          ></column-toggle>
        </div>
      </div>
      <div class="">
        <my-table
          ref="table"
          :columnDefs="columnDefs"
          v-bind:data-rows="replyRows"
          :actions="actions"
          :actionsTable="actionsTable"
          :selectable="filterSelect"
        />
      </div>
    </my-card>
    

    <el-dialog
      :title="$t('el.pageTitle.reviewReply')"
      :visible.sync="dialogFormReply.visible"
      width="765px"
      @keyup.enter.native="createReply"
    >
      <el-form :model="dialogFormReply.form" label-width="140px" data-vv-scope="dialogFormReply.form">
        <el-form-item :label="$t('el.formCard.content')">
          <el-input
            type="textarea"
            class="full-width"
            data-vv-name="dialogFormReply.form.content"
            v-model="dialogFormReply.form.content"
            v-validate="'required|min:5'"
            :placeholder="$t('el.formCard.content')"
            :class="errors.has('content')?'border-danger':''"
            :data-vv-as="$t('el.formCard.content')"
          >
          </el-input>
          <span class="text-danger" v-if="errors.has('dialogFormReply.form.content')">{{ errors.first('dialogFormReply.form.content') }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormReply.visible = false">{{$t('el.button.cancel')}}</el-button>
        <el-button type="primary" @click="createReply">{{$t('el.button.submit')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { MessageBox, Notification, Input, Dialog, Form, FormItem, Button } from 'element-ui';
import MyTable from 'src/components/UIComponents/Table.vue';
import MyCard from "src/components/UIComponents/Cards/Card";
import MyFilter from 'src/components/UIComponents/Filter.vue';
import dtHelper from 'src/helpers/datatable';
import ColumnToggle from 'src/components/UIComponents/ColumnToggle';
import reviewSchemas from './review-reply-schemas';

export default {
  components: {
    MyTable,
    MyFilter,
    ColumnToggle,
    MyCard,
    ElInput: Input,
    ElDialog: Dialog,
    ElForm: Form,
    ElFormItem: FormItem,
    ElButton: Button,
  },
  computed: {
    replyRows() {
      const replies = this.$store.state.reviewReplies || [];
      const rows = replies.map(reply => {
        return Object.assign({}, reply, {userFullName: reply.user && reply.user.fullname, reviewStatus: reply.status});
      });
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
    review() {
      const review = this.$store.state.reviewDetail;
      return Object.assign({}, review, {userFullName: review.user && review.user.fullname});
    },
    actionsTable() {
      const defaultActionsTable = [
        {
          title: 'approve',
          callback: this.approveAll,
        },
        {
          title: 'reject',
          color: 'text-danger',
          callback: this.rejectAll,
        },
      ];
      const hasPendingReply = !!this.$store.state.reviewReplies.find(reply => reply.status === 'pending');
      return hasPendingReply && this.review.status === 'approved' ? defaultActionsTable : [];
    }
  },
  data() {
    const initFiledArrays = ['id', 'content', 'userFullName', 'status', 'createdAt'];
    return {
      filterOutput: [],
      columnDefs: dtHelper.buildInitFields(reviewSchemas, initFiledArrays),
      dialogFormReply: {
        visible: false,
        form: {
          content: '',
        },
      },
      actions: [
        {
          type: 'primary',
          icon: 'fa fa-check',
          title: 'approve',
          disabled: this.disableApproved,
          callback: this.approve,
        },
        {
          type: 'danger',
          icon: 'nc-icon nc-simple-remove',
          title: 'reject',
          disabled: this.disableRejected,
          callback: this.reject,
        },
      ],
      filter: {},
      rules: dtHelper.buildRules(reviewSchemas),
    };
  },
  async mounted() {
    await this.reloadReview();
    this.$store.dispatch('setPageTitle', 'review detail');
  },
  methods: {
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    filterSelect(row) {
      return row.status === 'pending';
    },
    async updateReviewStatus(action) {
      try {
        await this.$store.dispatch(`${action}Review`, this.$route.params.id);
        this.reloadReview();
        Notification ({
          title: 'Success',
          message: `${action} successfully`,
          position: 'bottom-right',
          type: 'success',
        });
      } catch (error) {
        Notification ({
          title: 'Error',
          message: `${action} failed`,
          position: 'bottom-right',
          type: 'error',
        });
      }
    },
    async createReply() {
      try {
        await this.$store.dispatch(
          `createReviewReply`,
          {
            reviewId: this.$route.params.id,
            content: this.dialogFormReply.form.content,
          });
        await this.reloadReview();
        this.dialogFormReply.visible = false;
        this.dialogFormReply.content = '';
        Notification ({
          title: 'Success',
          message: `Reply successfully`,
          position: 'bottom-right',
          type: 'success',
        });
      } catch (error) {
        Notification ({
          title: 'Error',
          message: `Reply failed: ${error.message}`,
          position: 'bottom-right',
          type: 'error',
        });
      }
    },
    disableApproved(index, row) {
      return !(this.review.status === 'approved' && row.status === 'pending');
    },
    approve(index, row) {
      this.approveAll([row], 'approve');
    },
    disableRejected(index, row) {
      return !(this.review.status === 'approved' && row.status === 'pending');
    },
    reject(index, row) {
      this.rejectAll([row], 'reject');
    },
    rejectAll(rows) {
      this.batchAction(rows, 'reject');
    },
    approveAll(rows) {
      this.batchAction(rows, 'approve');
    },
    async batchAction(rows, action) {
      try {
        await Promise.all(rows.map(r => this.$store.dispatch(`${action}ReviewReply`, {reviewId: this.$route.params.id, replyId: r.id})));
        this.dialogFormReply.content = '';
        this.dialogFormReply.visible = false;
        await this.reloadReview();
        Notification ({
          title: 'Success',
          message: `${action} success`,
          position: 'bottom-right',
          type: 'success',
        });
      } catch (error) {
        Notification ({
          title: 'Error',
          message: `${action} failed: ${error.message}`,
          position: 'bottom-right',
          type: 'error',
        });
      }
    },
    async reloadReview() {
      await this.$store.dispatch('fetchReviewDetail', this.$route.params.id);
      await this.$store.dispatch('fetchReviewReplies', this.$route.params.id);
      const actions = [{
        label: 'Reply',
        type: 'primary',
        icon: '',
        callback: () => this.dialogFormReply.visible = true,
      }];

      if (this.review.status === 'approved') {
        actions.push({
          label: 'Reject',
          type: 'danger',
          icon: '',
          callback: () => this.updateReviewStatus('reject'),
        });
      }

      if (this.review.status === 'pending') {
        actions.push({
          label: 'Approve',
          type: 'primary',
          icon: '',
          callback: () => this.updateReviewStatus('approve'),
        });
      }
      this.$store.dispatch('setCurrentActions', actions);
    }
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

  .rating-star {
    color: #fbc658;
    font-size: 20px;
    margin-left: 5px;
  }
</style>
