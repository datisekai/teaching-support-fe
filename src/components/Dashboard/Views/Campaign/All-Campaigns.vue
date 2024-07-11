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
            v-bind:data-rows="campaigns"
            :actions="actions"
            :actionsTable="actionsTable"
            @sortChange="sortChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { MessageBox, Notification } from 'element-ui';
import MyTable from 'src/components/UIComponents/Table.vue';
import MyFilter from 'src/components/UIComponents/Filter.vue';
import dtHelper from 'src/helpers/datatable';
import ColumnToggle from 'src/components/UIComponents/ColumnToggle';
import campaignSchemas from './campaign-schemas';

export default {
  components: {
    MyTable,
    MyFilter,
    ColumnToggle,
  },
  computed: {
    campaigns() {
      const rows = this.$store.getters.campaigns.map(r => {
        let value = '';
        switch (r.discountType) {
          case 'percentage':
            value = this.$util.formatMoney(r.discountValue) + ' %';
            break;
          case 'fixed_amount':
            value = this.$util.formatMoney(r.discountValue) + ' VNĐ';
            break;
          case 'free_shipping':
          default:
            value = 'N/A';
            break;
        }
        r.value = value;
        r.isProgressing = !r.isCompleted;
        return r;
      });
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
  },
  data() {
    const initFiledArrays = ['image', 'title', 'discountType', 'value', 'startDate', 'expiredDate', 'isActive', 'isExpired'];
    campaignSchemas.forEach(s => {
      if (s.prop == 'isActive') {
        s.callback = this.disableCampaign
      }
    })
    return {
      filterOutput: [],
      columnDefs: dtHelper.buildInitFields(campaignSchemas, initFiledArrays),
      actions: [
        {
          type: 'primary',
          icon: 'nc-icon nc-ruler-pencil',
          title: 'edit',
          callback: this.edit,
        },
        {
          type: 'danger',
          icon: 'nc-icon nc-simple-remove',
          title: 'delete',
          callback: this.remove,
        },
      ],
      actionsTable: [
        // {
        //   title: 'Ẩn',
        //   callback: this.inactiveAll,
        // },
        // {
        //   title: 'Hiện',
        //   callback: this.activeAll,
        // },
        // {
        //   title: 'delete',
        //   color: 'text-danger',
        //   callback: this.removeAll,
        // },
      ],
      filter: {},
      rules: dtHelper.buildRules(campaignSchemas),
    };
  },
  mounted() {
    this.$store.dispatch('fetchCampaigns');
    this.$store.dispatch('setPageTitle', 'campaign');
    this.$store.dispatch('setCurrentActions', [{
      label: 'create',
      type: 'primary',
      icon: '',
      callback: this.create,
    }]);
  },
  methods: {
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    sortChange(data) {
      const prop = data.prop;
      const order = data.order == 'ascending' ? 'asc' : 'desc';
      this.$store.dispatch('fetchCampaigns', {
        order: `${prop}=${order}`,
      });
    },
    edit(index, row) {
      this.$router.push(`/campaign/${row.id}`);
    },
    create() {
      this.$router.push('/campaign/create');
    },
    remove(index, row) {
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        this.$store.dispatch('removeCampaign', row.id).then((res) => {
          Notification ({
            title: 'Success',
            message: 'Delete completed',
            position: 'bottom-right',
            type: 'success',
          });
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
    inactiveAll(rows) {
      this.updateStatus(rows, 'inactive');
    },
    activeAll(rows) {
      this.updateStatus(rows, 'active');
    },
    removeAll(rows) {
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        this.updateStatus(rows, 'delete');
      });
    },
    updateStatus(rows, status) {
      const self = this;
      this.$util.updateStatusAll('campaign', rows, status).then((result) => {
        self.$store.dispatch('fetchCampaigns');
        Notification ({
          title: 'Success',
          message: 'Update succeeded',
          position: 'bottom-right',
          type: 'success',
        });
      }).catch((err) => {
        Notification ({
          title: 'Error',
          message: err.message,
          position: 'bottom-right',
          type: 'error',
        });
      });
    },
    exportExcel(){
      let self = this;
      return Notification ({
        title: 'Warning',
        message: 'Tính năng chưa hiện thực',
        position: 'bottom-right',
        type: 'warning'
      }); 
      this.$util.exportExcel('campaign', self.$store.state.campaigns);
    },
    disableCampaign(index, row) {
      let text = row.isActive ? 'enable' : 'disable';
      let Text = row.isActive ? 'Enable' : 'Disable';
      MessageBox.confirm(`Are you sure to ${text}?`, `${Text}`, {
        confirmButtonText: `${Text}`,
        cancelButtonText: 'Cancel',
        type: 'warning',
        center: true
      }).then(() => {
        const isActive = text == 'enable';
        const action = isActive ? 'enableCampaign' : 'disableCampaign';
        this.$store.dispatch(action, row.id).then(res => {
          row.isActive = isActive;
          Notification ({
            title: 'Success',
            message: `${Text} completed`,
            position: 'bottom-right',
            type: 'success',
          });
        }, (err) => {
          row.isActive = !isActive;
          Notification ({
            title: 'Error',
            message: err.message,
            position: 'bottom-right',
            type: 'error',
          });
        })
      }).catch(() => {
        row.isActive = text == 'disable';
        Notification ({
          title: 'Canceled',
          message: `${Text} canceled`,
          position: 'bottom-right',
          type: 'info',
        });
      })
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
</style>
