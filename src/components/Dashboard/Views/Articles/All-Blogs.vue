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
            v-bind:data-rows="blogs"
            :actions="actions"
            :actionsTable="actionsTable"
            @sortChange="sortChange"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { MessageBox, Message } from 'element-ui';
import MyTable from 'src/components/UIComponents/Table.vue';
import MyFilter from 'src/components/UIComponents/Filter.vue';
import dtHelper from 'src/helpers/datatable';
import ColumnToggle from 'src/components/UIComponents/ColumnToggle';
import blogSchemas from './blog-schemas';

export default {
  components: {
    MyTable,
    MyFilter,
    ColumnToggle,
  },
  computed: {
    blogs() {
      return this.$store.state.blogs;
    },
  },
  data() {
    const initFiledArrays = ['id', 'title', 'created_at', 'status'];
    const columnDefs = dtHelper.buildInitFields(blogSchemas, initFiledArrays);

    return {
      filterOutput: [],
      columnDefs,
      actions: [
        {
          type: 'primary',
          icon: 'nc-icon nc-ruler-pencil',
          callback: this.edit,
        },
        {
          type: 'danger',
          icon: 'nc-icon nc-simple-remove',
          callback: this.remove,
        },
      ],
      actionsTable: [
        {
          title: 'Ẩn',
          callback: this.inactiveAll,
        },
        {
          title: 'Hiện',
          callback: this.activeAll,
        },
        {
          title: 'Xóa',
          color: 'text-danger',
          callback: this.removeAll,
        },
      ],
      filter: {},
      rules: dtHelper.buildRules(blogSchemas),
    };
  },
  mounted() {
    this.$store.dispatch('fetchBlogs');

    this.$store.dispatch('setPageTitle', 'nhóm bài viết');
    this.$store.dispatch('setCurrentActions', [{
      label: 'Xuất excel',
      type: 'default',
      icon: '',
      callback: this.exportExcel,
    },{
      label: 'Tạo nhóm bài viết',
      type: 'primary',
      icon: '',
      callback: this.createBlog,
    }]);
  },
  methods: {
    updateFilter(filterOutput) {
      const filterString = dtHelper.buildQueryString(filterOutput);
      this.$store.dispatch('fetchBlogs', {
        filterString,
      });
    },
    sortChange(data) {
      const prop = data.prop;
      const order = data.order == 'ascending' ? 'asc' : 'desc';
      this.$store.dispatch('fetchBlogs', {
        order: `${prop}=${order}`,
      });
    },
    edit(index, row) {
      this.$router.push(`/blogs/${row.id}`);
    },
    createBlog() {
      this.$router.push('/blogs/create');
    },
    remove(index, row) {
      MessageBox.confirm('Bạn có chắc chắn xóa nhóm bài viết không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        this.$store.dispatch('removeBlog', row.id).then((res) => {
          Message({
            type: 'success',
            message: 'Đã xóa nhóm bài viết',
          });
        });
      }).catch(() => {
        Message({
          type: 'info',
          message: 'Hủy bỏ',
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
      this.$util.updateStatusAll('blog', rows, status).then((result) => {
        self.$store.dispatch('fetchBlogs');
        Message({
          type: 'success',
          message: 'Cập nhật thành công',
        });
      }).catch((error) => {
        Message({
          type: 'error',
          message: error.message,
        });
      });
    },
    exportExcel(){
      let self = this;
      this.$util.exportExcel('blog', self.$store.state.blogs);
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
