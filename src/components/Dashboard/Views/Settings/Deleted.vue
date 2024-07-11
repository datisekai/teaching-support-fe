<template>
  <div class="row">
    <el-tabs v-model="activeName" class="full-width">
      <el-tab-pane
        v-for="(tab, index) of tabs"
        :label="tab.title"
        :name="tab.id + ''"
        :key="'tab' + index"
      >
        <div class="col-md-12 card p-0">
          <div class="card-body row p-0">
            <div class="col-sm-12">
              <my-filter :rules="rules" v-on:filter-change="updateFilter"></my-filter>
            </div>
            <div class="col-sm-12">
              <my-table :columnDefs="columnDefs" v-bind:data-rows="deleted" :actions="actions" :actionsTable="actionsTable" @sortChange="sortChange"/>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { Tabs, TabPane, Message } from 'element-ui';
import MyTable from 'src/components/UIComponents/Table.vue';
import MyFilter from 'src/components/UIComponents/Filter.vue';
import dtHelper from 'src/helpers/datatable';
import deletedSchemas from './deleted-history';

export default {
  components: {
    ElTabs: Tabs,
    ElTabPane: TabPane,
    MyTable,
    MyFilter,
  },
  computed: {
    deleted() {
      if (!this.activeName) {
        const rows = this.$store.state.deleted;
        return dtHelper.filterByRules(rows, this.filterOutput);
      }
      const rows = this.$store.state.deletedDetail;
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
  },
  data() {
    return {
      filterOutput: [],
      columnDefs: dtHelper.buildColumDefs(deletedSchemas),
      actions: [],
      filter: {},
      rules: dtHelper.buildRules(deletedSchemas),
      activeName: 0,
      tabs: [{
        id: 0,
        title: 'Sản phẩm',
      }, {
        id: 1,
        title: 'Nhóm sản phẩm',
      }, {
        id: 2,
        title: 'Bài viết',
      }, {
        id: 3,
        title: 'Nhóm bài viết',
      }, {
        id: 4,
        title: 'Trang nội dung',
      }, {
        id: 5,
        title: 'Gallery',
      },
      ],
      actionsTable: [
        {
          title: 'Khôi phục',
          callback: this.restoreAll,
        },
      ],
      actions: [
        {
          type: 'primary',
          icon: 'el-icon-refresh',
          title: 'Khôi phục',
          callback: this.restore,
        },
      ],
    };
  },
  mounted() {
    this.$store.dispatch('fetchDeleted');
    this.$store.dispatch('setPageTitle', 'dữ liệu đã xóa');
  },
  methods: {
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    sortChange(data) {
      const self = this;
      const prop = data.prop;
      const order = data.order == 'ascending' ? 'asc' : 'desc';
      const list = ['product', 'collection', 'article', 'blog', 'page', 'gallery'];
      this.$store.dispatch('fetchDeletedDetail', {
        params: { order: `${prop}=${order}` },
        type: list[self.activeName],
      });
    },
    restore(index, row) {
      const self = this;
      const list = ['product', 'collection', 'article', 'blog', 'page', 'gallery'];
      this.$util.updateStatusAll(list[self.activeName], [row], 'active').then((result) => {
        if (!self.activeName) self.$store.dispatch('fetchDeleted');
        else self.$store.dispatch('fetchDeletedDetail', list[self.activeName]);
        Message({
          type: 'success',
          message: 'Khôi phục thành công',
        });
      }).catch((error) => {
        Message({
          type: 'error',
          message: error.message,
        });
      });
    },
    restoreAll(rows) {
      const self = this;
      const list = ['product', 'collection', 'article', 'blog', 'page', 'gallery'];
      this.$util.updateStatusAll(list[self.activeName], rows, 'active').then((result) => {
        if (!self.activeName) self.$store.dispatch('fetchDeleted');
        else self.$store.dispatch('fetchDeletedDetail', list[self.activeName]);
        Message({
          type: 'success',
          message: 'Khôi phục thành công',
        });
      }).catch((error) => {
        Message({
          type: 'error',
          message: error.message,
        });
      });
    },
  },
  watch: {
    activeName(newValue, oldValue) {
      const list = ['product', 'collection', 'article', 'blog', 'page', 'gallery'];
      this.$store.dispatch('fetchDeletedDetail', {
        type: list[newValue],
      });
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
