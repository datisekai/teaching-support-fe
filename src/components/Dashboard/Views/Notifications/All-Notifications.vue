<template>
  <div class="row">
    <div class="col-md-12 card p-0">
      <div class="card-body">
        <div class="row">
          <div class="col-lg-9 col-md-6 col-sm-6 col-6">
            <my-filter :rules="rules" v-on:filter-change="updateFilter"></my-filter>
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6 col-6">
            <column-toggle
              v-model="columnDefs"
              @input="cols => this.$refs['table'].updateColumns(cols)"
            ></column-toggle>
          </div>
        </div>
        <div class="col-sm-12 p-0">
          <my-table
            ref="table"
            :columnDefs="columnDefs"
            v-bind:data-rows="notificationRows"
            :actions="actions"
            :actionsTable="actionsTable"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { MessageBox, Notification } from 'element-ui';
import MyTable from 'src/components/UIComponents/Table.vue';
import MyFilter from 'src/components/UIComponents/Filter.vue';
import dtHelper from 'src/helpers/datatable';
import ColumnToggle from 'src/components/UIComponents/ColumnToggle';
import notificationSchemas from './notification-schemas';

export default {
  components: {
    MyTable,
    MyFilter,
    ColumnToggle,
  },
  computed: {
    notificationRows() {
      const rows = this.notifications.map(r => {
        r.notificationType = r.type;
        return r;
      });
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
    notifications() {
      return this.$store.state.notifications
    }    // ...mapGetters(['notifications'])
  },
  data() {
    const initFiledArrays = ['title', 'content', 'notificationType', 'sendAt', 'processedAt', 'updatedAt'];
    return {
      filterOutput: [],
      columnDefs: dtHelper.buildInitFields(notificationSchemas, initFiledArrays),
      actions: [
        {
          type: 'primary',
          icon: 'nc-icon nc-ruler-pencil',
          title: 'edit',
          callback: this.edit,
        },
        {
          type: 'warning',
          icon: 'nc-icon nc-send',
          title: 'send',
          callback: this.send,
        },
      ],
      actionsTable: [
      ],
      filter: {},
      rules: dtHelper.buildRules(notificationSchemas),
    };
  },
  async mounted() {
    this.$store.dispatch('setCurrentActions', [{
      label: 'create',
      type: 'primary',
      icon: '',
      callback: this.create,
    }]);
    await this.loadNotifications();
    this.$store.dispatch('setPageTitle', 'notification');
  },
  methods: {
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    async loadNotifications() {
      return this.$store.dispatch('fetchNotifications', {types: 'campaign,flashsale,news'});
    },
    edit(index, row) {
      this.$router.push(`/notification/${row.id}`);
    },
    create() {
      this.$router.push('/notification/create');
    },
    async send(index, row) {
      MessageBox.confirm('Thông báo sẽ được gửi cho tất cả người sử dụng trong hệ thống.\nBạn có chắc chắn muốn gửi không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(async () => {
        try {
          const sendingResult = await this.$store.dispatch('sendNotification', row.id);
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
    remove(index, row) {
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        this.batchAction([row], 'delete');
      });
    },
    removeAll(rows) {
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        return this.batchAction(rows, 'delete');
      });
    },
    async batchAction(rows, action) {
      try {
        await Promise.all(rows.map(r => this.$store.dispatch(`${action}Notification`, r.id)));
        await this.loadNotifications();
        Notification ({
          title: 'Success',
          message: `${action} success`,
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
</style>
