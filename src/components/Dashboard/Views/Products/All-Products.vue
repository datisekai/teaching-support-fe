<template>
  <div class="row">
    <div class="card">
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
            v-bind:data-rows="products"
            :actions="actions"
            :actionsTable="actionsTable"
            @sortChange="sortChange"
          />
        </div>
      </div>
    </div>
    <el-dialog
      :title="$t('el.pageTitle.productUpdate') + ': ' + dialogSpecialUpdate.title"
      :visible.sync="dialogSpecialUpdate.visible"
      width="500px"
    >
    <el-form :model="dialogSpecialUpdate.form">
      <el-form-item :label="$t('el.formCard.applyFor') + ':'">
        <el-radio v-model="dialogSpecialUpdate.form.name" label="best-seller">Best Seller</el-radio>
        <el-radio v-model="dialogSpecialUpdate.form.name" label="new-product">New Product</el-radio>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogSpecialUpdate.visible = false">{{$t('el.button.cancel')}}</el-button>
      <el-button type="primary" @click="updateSpecialList">{{$t('el.button.update')}}</el-button>
    </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  MessageBox, Button, Dialog, Form, FormItem, Radio, Col, CheckboxGroup, Checkbox, Notification
} from 'element-ui';
import MyTable from 'src/components/UIComponents/Table.vue';
import MyFilter from 'src/components/UIComponents/Filter.vue';
import dtHelper from 'src/helpers/datatable';
import ColumnToggle from 'src/components/UIComponents/ColumnToggle';
import { mapState } from 'vuex';
import productSchemas from './product-schemas';

export default {
  components: {
    ElButton: Button,
    ElCol: Col,
    ElFormItem: FormItem,
    ElDialog: Dialog,
    ElCheckbox: Checkbox,
    ElForm: Form,
    ElFormItem: FormItem,
    ElRadio: Radio,
    ElCheckboxGroup: CheckboxGroup,
    MyTable,
    MyFilter,
    ColumnToggle,
  },
  computed: {
    ...mapState(['collections']),
    products() {
      let rows = this.$store.getters.products.map(r => {
        r.image = r.images.length && r.images[0];
        const variants = r.variants || [];
        const minMaxPrice = variants.reduce((minMax, v) => {
          minMax[0] = Math.min(minMax[0], v.regularPrice);
          minMax[1] = Math.max(minMax[1], v.regularPrice);
          return minMax;
        }, [Infinity, -Infinity]);
        r.price = minMaxPrice[0];
        return r;
      });
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
  },
  data() {
    const initFiledArrays = ['id', 'image', 'name', 'price', 'status', 'createdAt'];
    const columnDefs = dtHelper.buildInitFields(productSchemas, initFiledArrays);
    return {
      dialogSpecialUpdate: {
        title: 'Add to Best Seller',
        visible: false,
        action: 'add', // remove
        form: {
          name: 'best-seller',
        },
        products: [],
      },
      dialogAddCollectionVisible: false,
      dialogRemoveCollectionVisible: false,
      sellectAddCollections: [],
      sellectRemoveCollections: [],
      currentSelectRow: [],
      filterOutput: [],
      columnDefs,
      actions: [
        {
          type: 'primary',
          title: 'sync',
          icon: 'nc-icon nc-refresh-69',
          callback: this.sync,
        },
        {
          type: 'primary',
          title: 'sync',
          icon: 'fa fa-external-link',
          callback: this.viewOnStore,
        }
      ],
      filter: {},
      rules: dtHelper.buildRules(productSchemas),
      actionsTable: [
        {
          title: 'sync',
          callback: this.syncMultiple,
        },
        {
          title: 'addToSpecialList',
          callback: this.showAddSpecialList,
        },
        {
          title: 'removeFromSpecialList',
          callback: this.showRemoveSpecialList,
        }
      ],
      storeUrl: '',
    };
  },
  async mounted() {
    const actions = [
      {
        type: "primary",
        title: "create",
        icon: "",
        callback: () => this.$router.push("/product/create"),
      },
    ];
    this.$store.dispatch('setPageTitle', 'product');
    try {
      this.$store.dispatch('fetchProducts');
      const metaData = await this.$store.dispatch('fetchMetaStoreUrl');
      this.storeUrl = metaData.metaValue;
    } catch (e) {
      console.error(e);
    }
    this.$store.dispatch('setCurrentActions', actions);
  },
  methods: {
    updateFilter(filterOutput) {
      const filterTitle = filterOutput.find(f => f.filter === 'name');
      if (filterTitle) {
        this.$store.dispatch('fetchProducts', {name: filterTitle.value, perpage: 100});
      } else if (filterOutput.length) {
        this.filterOutput = filterOutput;
      } else {
        this.$store.dispatch('fetchProducts');
      }
    },
    sortChange(data) {
      const prop = data.prop;
      const order = data.order == 'ascending' ? 'asc' : 'desc';
      this.$store.dispatch('fetchProducts', {
        order: `${prop}=${order}`,
      });
    },
    edit(index, row) {
      this.$router.push({name: 'ViewProduct', params: {id: row.id}});
    },
    showAddCollectionAll(rows) {
      this.currentSelectRow = rows;
      this.dialogAddCollectionVisible = true;
    },
    showRemoveCollectionAll(rows) {
      this.currentSelectRow = rows;
      this.dialogRemoveCollectionVisible = true;
    },
    showAddSpecialList(rows) {
      this.dialogSpecialUpdate.title = `Add to special list`;
      this.dialogSpecialUpdate.visible = true;
      this.dialogSpecialUpdate.products = rows;
      this.dialogSpecialUpdate.action = 'add';
    },
    showRemoveSpecialList(rows) {
      this.dialogSpecialUpdate.title = `Remove from special list`;
      this.dialogSpecialUpdate.visible = true;
      this.dialogSpecialUpdate.products = rows;
      this.dialogSpecialUpdate.action = 'remove';
    },
    async updateSpecialList() {
      const data = {
        name: this.dialogSpecialUpdate.form.name,
        add: [],
        remove: [],
      };
      const productIds = this.dialogSpecialUpdate.products.map(p => p.id);
      if (this.dialogSpecialUpdate.action === 'add') {
        data.add = productIds
      } else {
        data.remove = productIds;
      }

      try {
        await this.$store.dispatch(`updateSpecialList`, data);
        this.dialogSpecialUpdate.visible = false;
        Notification ({
          title: 'Success',
          message: 'Cập nhật thành công',
          position: 'bottom-right',
          type: 'success'
        });
      } catch (error) {
        Notification ({
          title: 'Error',
          message: error.message,
          position: 'bottom-right',
          type: 'error'
        });
      }
    },
    addCollectProducts() {
      let self = this;
      let collection_ids = this.sellectAddCollections;
      if (collection_ids && collection_ids.length) {
        Promise.all(collection_ids.map(collection_id => this.currentSelectRow.map(product => {
          return this.$store.dispatch('addCollectProducts', {
            collection_id: collection_id,
            product_id: product.id
          });
        })).reduce((a, b) => a.concat(b), [])).then(() => {
          Notification ({
            title: 'Success',
            message: 'Update succeeded',
            position: 'bottom-right',
            type: 'success',
          });
          self.dialogAddCollectionVisible = false;
          self.sellectAddCollections = [];
          self.$store.dispatch('fetchProducts');
        });
      }
    },
    removeCollectProducts() {
      let self = this;
      let collection_ids = this.sellectRemoveCollections;
      if (collection_ids && collection_ids.length) {
        Promise.all(collection_ids.map(collection_id => this.currentSelectRow.map(product => {
          return this.$store.dispatch('removeCollectProducts', {
            collection_id: collection_id,
            product_id: product.id
          });
        })).reduce((a, b) => a.concat(b), [])).then(() => {
          Notification ({
            title: 'Success',
            message: 'Update succeeded',
            position: 'bottom-right',
            type: 'success',
          });
          self.dialogRemoveCollectionVisible = false;
          self.sellectRemoveCollections = [];
          self.$store.dispatch('fetchProducts');
        });
      }
    },
    updateStatus(rows, status) {
      const self = this;
      this.$util.updateStatusAll('product', rows, status).then((result) => {
        self.$store.dispatch('fetchProducts');
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
      return Notification ({
        title: 'Warning',
        message: 'Tính năng chưa hiện thực',
        position: 'bottom-right',
        type: 'warning'
      });
      let self = this;
      this.$util.exportExcel('product', self.$store.state.products);
    },
    sync(index, row) {
      this.syncMultiple([row]);
    },
    async viewOnStore(index, row) {      
      if (this.storeUrl) {
        return window.open(this.storeUrl + '/products/' + row.slug, '_blank');
      }

      Notification.error('Không tìm thấy store url meta');
    },
    async syncMultiple(products){
      const messageBox = MessageBox('Cập nhật sản phẩm', 'Đang cập nhật...', 'alert');
      const syncResults = await Promise.all(products.map(async row => {
        try {
          await this.$store.dispatch(`syncProduct`, row.id);
          return true;
        } catch (error) {
          return false;
        }
      }));

      const {success: successCount, failed: failedCount} = syncResults.reduce((result, isSuccess) => {
        if (isSuccess) {
          result.success++;
        } else {
          result.failed++;
        }

        return result;
      }, {success: 0, failed: 0});

      MessageBox.close();
      Notification({
        title: 'Sync result',
        message: `${successCount}/${failedCount} success/failed`,
        position: 'bottom-right',
        type: 'info',
        duration: 10000,
      });

      this.$store.dispatch('fetchProducts');
    },
  },
  destroyed() {
    this.$store.dispatch('setCurrentActions', []);
  },
};
</script>
<style lang="scss">
  .el-table .td-actions {
    button.btn {
      margin-right: 5px;
    }
  }
</style>
