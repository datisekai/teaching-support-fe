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
            v-bind:data-rows="articles"
            :actions="actions"
            :actionsTable="actionsTable"
            @sortChange="sortChange"/>
        </div>
      </div>
    </div>
    <el-dialog title="Thêm vào danh mục" :visible.sync="dialogAddBlogVisible" width="40%" @keyup.enter.native="addBlogAll">
      <el-checkbox-group v-model="sellectAddBlogs">
        <div v-for="(blog, index) of blogs" :key="index">
          <el-checkbox :label="blog.id" name="type">{{blog.title}}</el-checkbox>
        </div>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddBlogVisible = false">Đóng</el-button>
        <el-button type="primary" @click="addBlogAll">Thêm vào danh mục</el-button>
      </span>
    </el-dialog>
    <el-dialog title="Xóa khỏi danh mục" :visible.sync="dialogRemoveBlogVisible" width="40%" @keyup.enter.native="removeBlogAll">
      <el-checkbox-group v-model="sellectRemoveBlogs">
        <div v-for="(blog, index) of blogs" :key="index">
          <el-checkbox :label="blog.id" name="type">{{blog.title}}</el-checkbox>
        </div>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRemoveBlogVisible = false">Đóng</el-button>
        <el-button type="primary" @click="removeBlogAll">Xóa khỏi danh mục</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  MessageBox, Message, Button, Dialog, Form, FormItem, Col, CheckboxGroup, Checkbox,
} from 'element-ui';
import MyTable from 'src/components/UIComponents/Table.vue';
import MyFilter from 'src/components/UIComponents/Filter.vue';
import dtHelper from 'src/helpers/datatable';
import { mapState } from 'vuex';
import ColumnToggle from 'src/components/UIComponents/ColumnToggle';
import articleSchemas from './article-schemas';

export default {
  components: {
    MyTable,
    MyFilter,
    ElButton: Button,
    ElCol: Col,
    ElFormItem: FormItem,
    ElDialog: Dialog,
    ElForm: Form,
    ElCheckboxGroup: CheckboxGroup,
    ElCheckbox: Checkbox,
    ColumnToggle,
  },
  computed: {
    ...mapState({
      blogs: state => state.blogs,
    }),
    articles() {
      return this.$store.state.articles;
    },
  },
  data() {
    const initFiledArrays = ['id', 'image', 'title', 'createdAt'];
    const columnDefs = dtHelper.buildInitFields(articleSchemas, initFiledArrays);

    return {
      dialogAddBlogVisible: false,
      dialogRemoveBlogVisible: false,
      sellectAddBlogs: [],
      sellectRemoveBlogs: [],
      currentSelectRow: [],
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
        {
          title: 'Thêm vào danh mục',
          callback: this.showAddBlogAll,
        },
        {
          title: 'Xóa khỏi danh mục',
          color: 'text-danger',
          callback: this.showRemoveBlogAll,
        },
      ],
      filter: {},
      rules: dtHelper.buildRules(articleSchemas),
    };
  },
  mounted() {
    this.$store.dispatch('fetchArticles');
    this.$store.dispatch('setPageTitle', 'bài viết');
    this.$store.dispatch('setCurrentActions', [{
      label: 'Tạo mới',
      type: 'primary',
      icon: '',
      callback: this.createArticle,
    }]);
  },
  methods: {
    updateFilter(filterOutput) {
      const filterString = dtHelper.buildQueryString(filterOutput);
      this.$store.dispatch('fetchArticles', {
        filterString,
      });
    },
    sortChange(data) {
      const prop = data.prop;
      const order = data.order == 'ascending' ? 'asc' : 'desc';
      this.$store.dispatch('fetchArticles', {
        order: `${prop}=${order}`,
      });
    },
    edit(index, row) {
      this.$router.push(`/article/${row.id}`);
    },
    createArticle() {
      this.$router.push('/article/create');
    },
    remove(index, row) {
      MessageBox.confirm('Bạn có chắc chắn xóa bài viết không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      }).then(() => {
        this.$store.dispatch('removeArticle', row.id).then((res) => {
          Message({
            type: 'success',
            message: 'Đã xóa bài viết',
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
    showAddBlogAll(rows) {
      this.currentSelectRow = rows;
      this.dialogAddBlogVisible = true;
    },
    showRemoveBlogAll(rows) {
      this.currentSelectRow = rows;
      this.dialogRemoveBlogVisible = true;
    },
    addBlogAll() {
      let self = this;
      let blog_ids = this.sellectAddBlogs;
      if (blog_ids && blog_ids.length) {
        Promise.all(blog_ids.map(blog_id => this.currentSelectRow.map(article => {
          return this.$store.dispatch('addBlogArticles', {
            blog_id: blog_id,
            article_id: article.id
          });
        })).reduce((a,b) => a.concat(b), [])).then(() => {
          Message({
            type: 'success',
            message: 'Cập nhật thành công',
          });
          self.dialogAddBlogVisible = false;
          self.sellectAddBlogs = [];
          self.$store.dispatch('fetchArticles');
        });
      }
    },
    removeBlogAll() {
      let self = this;
      let blog_ids = this.sellectRemoveBlogs;
      if (blog_ids && blog_ids.length) {
        Promise.all(blog_ids.map(blog_id => this.currentSelectRow.map(article => {
          return this.$store.dispatch('deleteBlogArticles', {
            blog_id: blog_id,
            article_id: article.id
          });
        })).reduce((a,b) => a.concat(b), [])).then(() => {
          Message({
            type: 'success',
            message: 'Cập nhật thành công',
          });
          self.dialogRemoveBlogVisible = false;
          self.sellectRemoveBlogs = [];
          self.$store.dispatch('fetchArticles');
        });
      }
    },

    updateStatus(rows, status) {
      const self = this;
      this.$util.updateStatusAll('article', rows, status).then((result) => {
        self.$store.dispatch('fetchArticles');
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
