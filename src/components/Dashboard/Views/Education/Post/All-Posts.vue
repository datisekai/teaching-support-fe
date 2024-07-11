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
            v-bind:data-rows="educationPosts"
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
import { MessageBox, Message } from 'element-ui';
import MyTable from 'src/components/UIComponents/Table.vue';
import MyFilter from 'src/components/UIComponents/Filter.vue';
import dtHelper from 'src/helpers/datatable';
import ColumnToggle from 'src/components/UIComponents/ColumnToggle';
import educationPostSchemas from './education-post-schemas';

export default {
  components: {
    MyTable,
    MyFilter,
    ColumnToggle,
  },
  computed: {
    educationPosts() {
      const rows = this.$store.state.educationPosts;
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
  },
  data() {
    const initFiledArrays = ['title', 'createdAt', 'updatedAt'];
    const columnDefs = dtHelper.buildInitFields(educationPostSchemas, initFiledArrays);

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
      rules: dtHelper.buildRules(educationPostSchemas),
    };
  },
  mounted() {
    this.$store.dispatch('fetchEducationPosts');

    this.$store.dispatch('setPageTitle', 'Bài viết quản lý phòng giáo dục');
    this.$store.dispatch('setCurrentActions', [{
      label: 'Tạo mới',
      type: 'primary',
      icon: '',
      callback: this.create,
    }]);
  },
  methods: {
    create() {
      this.$router.push('/education/post/create');
    },
    edit(index, row) {
      this.$router.push(`/education/post/${row.id}`);
    },
    remove(index, row) {
      MessageBox.confirm('Bạn có chắc chắn xóa không?', 'Warning', {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
        center: true,
      })
      .then(() => {
          this.$store.dispatch('removeEducationPost', row.id)
          .then((res) => {
            Message({
              message: 'Đã xóa',
              type: 'success'
            });
          })
          .catch(err => {
            Message({
              type: 'error',
              message: err.message,
            });
          });
      })
      .catch((err) => {
        console.log(err);
      });
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
      this.$util.updateStatusAll('article', rows, status).then((result) => {
        self.$store.dispatch('fetchEducationPosts');
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
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    sortChange(data) {
      const prop = data.prop;
      const order = data.order == 'ascending' ? 'asc' : 'desc';
      this.$store.dispatch('fetchEducationPosts', {
        order: `${prop}=${order}`,
      });
    },
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
