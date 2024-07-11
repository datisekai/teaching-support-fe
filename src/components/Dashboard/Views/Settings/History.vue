<template>
  <div class="row">
    <div class="col-md-12 card p-0">
      <div class="card-body row p-0">
        <div class="col-sm-12">
          <my-filter :rules="rules" v-on:filter-change="updateFilter"></my-filter>
        </div>
        <div class="col-sm-12">
          <my-table
            :columnDefs="columnDefs"
            v-bind:data-rows="histories"
            :actions="actions"
            @sortChange="sortChange"
            :no-sort="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MyTable from 'src/components/UIComponents/Table.vue';
import MyFilter from 'src/components/UIComponents/Filter.vue';
import dtHelper from 'src/helpers/datatable';
import historySchemas from './history-schemas';

export default {
  components: {
    MyTable,
    MyFilter,
  },
  computed: {
    histories() {
      const self = this;
      const rows = this.$store.state.histories;
      if (rows.length) {
        rows.forEach((item) => {
          item.actionText = `${self.parseAction(item.action)} ${self.parseType(item.type)} <a href=/dashboard/#/${self.parseLink(item.type)}/${item.type_id}>${item.type_title}</a>`;
        });
      }
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
  },
  data() {
    return {
      filterOutput: [],
      columnDefs: dtHelper.buildColumDefs(historySchemas),
      actions: [],
      filter: {},
      rules: dtHelper.buildRules(historySchemas),
    };
  },
  mounted() {
    window.AP = this;
    this.$store.dispatch('fetchHistories');

    this.$store.dispatch('setPageTitle', 'lịch sử hoạt động');
  },
  methods: {
    parseAction(action) {
      switch (action) {
        case 'create': return 'tạo';
        case 'restore': return 'hồi phục';
        case 'update': return 'cập nhật';
        case 'delete': return 'xóa';
        case 'inactive': return 'ẩn';
        case 'active': return 'hiện';
        case 'logout': return 'đăng xuất';
        case 'login': return 'đăng nhập';
        default: return action;
      }
      return action;
    },
    parseType(type) {
      switch (type) {
        case 'menu': return 'menu';
        case 'attribute': return 'thuộc';
        case 'setting': return 'thiết lập chung';
        case 'product': return 'sản phẩm';
        case 'sale': return 'chương trình giảm giá';
        case 'collection': return 'nhóm sản phẩm';
        case 'blog': return 'nhóm bài viết';
        case 'article': return 'bài viết';
        case 'page': return 'trang nội dung';
        case 'coupon': return 'mã giảm giá';
        case 'role': return 'quyền';
        case 'client': return 'khách hàng tiêu biểu';
        case 'testimonial': return 'đối tác nói về chúng tôi';
        case 'order': return 'đơn hàng';
        case 'contact': return 'liên hệ';
        case 'gallery': return 'thư viện ảnh';
        default: return '';
      }
      return '';
    },
    parseLink(type){
      switch (type) {
        case 'menu': return 'menu';
        case 'product': return 'products';
        case 'sale': return 'sales';
        case 'collection': return 'collections';
        case 'blog': return 'blogs';
        case 'article': return 'articles';
        case 'page': return 'pages';
        case 'coupon': return 'coupons';
        case 'client': return 'clients';
        case 'testimonial': return 'testimonials';
        case 'order': return 'orders';
        case 'gallery': return 'galleries';
        default: return '';
      }
    },
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    sortChange(data) {
      const prop = data.prop;
      const order = data.order == 'ascending' ? 'asc' : 'desc';
      this.$store.dispatch('fetchHistories', {
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
