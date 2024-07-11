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
            v-bind:data-rows="pages"
            :actions="actions"
            :actionsTable="actionsTable"
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
import pageSchemas from './page-schemas';
import dtHelper from 'src/helpers/datatable';
import ColumnToggle from 'src/components/UIComponents/ColumnToggle';

export default {
  components: {
    MyTable,
    MyFilter,
    ColumnToggle,
  },
  computed: {
    pages() {
      const rows = this.$store.getters.pages;
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
  },
  data() {
    const initFiledArrays = ['id', 'image', 'title', 'createdAt'];
    pageSchemas.forEach(s => {
      if (s.prop == 'isActive') {
        s.callback = this.disablePage;
      }
    })
    return {
      filterOutput: [],
      columnDefs:  dtHelper.buildInitFields(pageSchemas, initFiledArrays),
      actions: [
        {
          type: 'primary',
          title: 'edit',
          icon: 'nc-icon nc-ruler-pencil',
          callback: this.edit,
        },
        {
          type: 'danger',
          title: 'delete',
          icon: 'nc-icon nc-simple-remove',
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
        //   title: 'Xóa',
        //   color: 'text-danger',
        //   callback: this.removeAll,
        // },
      ],
      filter: {},
      rules: dtHelper.buildRules(pageSchemas),
    };
  },
  mounted() {
    this.$store.dispatch('fetchPages');
    this.$store.dispatch('setPageTitle', 'page');
    this.$store.dispatch('setCurrentActions', [{
      label: 'exportExcel',
      type: 'default',
      icon: '',
      callback: this.exportExcel,
    },{
      label: 'create',
      type: 'primary',
      icon: '',
      callback: this.createPage,
    }]);
  },
  methods: {
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    sortChange(data) {
      const prop = data.prop;
      const order = data.order == 'ascending' ? 'asc' : 'desc';
      this.$store.dispatch('fetchPages', {
        order: `${prop}=${order}`,
      });
    },
    edit(index, row) {
      this.$router.push({name: 'EditPage', params: {id: row.id}});
    },
    createPage() {
      this.$router.push({name: 'CreatePage'});
    },
    remove(index, row) {
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        this.$store.dispatch('removePage', row.id).then((res) => {
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
      this.$util.updateStatusAll('page', rows, status).then((result) => {
        this.$store.dispatch('fetchPages');
        Notification ({
          title: 'Success',
          message: 'Update succeeded',
          position: 'bottom-right',
          type: 'success',
        });
      }).catch((error) => {
        Notification ({
          title: 'Error',
          message: err.message,
          position: 'bottom-right',
          type: 'error',
        });
      });
    },
    exportExcel(){
      this.$util.exportExcel('page', this.$store.state.pages);
    },
    disablePage(index, row) {
      let text = row.isActive ? 'enable' : 'disable';
      let Text = row.isActive ? 'Enable' : 'Disable';
      MessageBox.confirm(`Are you sure to ${text}?`, `${Text}`, {
        confirmButtonText: `${Text}`,
        cancelButtonText: 'Cancel',
        type: 'warning',
        center: true
      }).then(() => {
        row.isActive = text == 'disable';
        return Notification ({
          title: 'Warning',
          message: 'Tính năng chưa hiện thực',
          position: 'bottom-right',
          type: 'warning'
        }); 
        this.$store.dispatch('disablePage', row.id).then(res => {
          Notification ({
            title: 'Success',
            message: `${Text} completed`,
            position: 'bottom-right',
            type: 'success',
          });
        }, err => {
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
