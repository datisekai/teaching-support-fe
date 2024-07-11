<template>
  <div class="row">
    <div class="col-md-12 card p-0">
      <div class="card-body p-0">
        <div class="row">
          <div class="col-lg-9 col-md-6 col-sm-6 col-6">
            <!-- <my-filter
              :rules="rules"
              v-on:filter-change="updateFilter"
              :availableFilters="availableFilters"
            ></my-filter> -->
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
            v-bind:data-rows="orders"
            :actions="actions"
            :actionsTable="actionsTable"
            @sortChange="sortChange"
          />
          <!-- <table-ajax
            ref="table"
            :columnDefs="columnDefs"
            v-bind:data-rows="articles"
            :actions="actions"
            :no-sort="true"
            :filters="filters"
            :remote-method="remoteMethod"
          /> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { MessageBox, Message, Button } from "element-ui";
import MyTable from "src/components/UIComponents/Table.vue";
import MyFilter from "src/components/UIComponents/Filter.vue";
import dtHelper from "src/helpers/datatable";
import ColumnToggle from "src/components/UIComponents/ColumnToggle";
import orderSchemas from "./order-schemas";
// import TableAjax from "src/components/UIComponents/TableAjax.vue";

export default {
  components: {
    MyTable,
    MyFilter,
    ElButton: Button,
    ColumnToggle
    // TableAjax
  },
  computed: {
    orders() {
      console.log("orders", this.$store.state.orders);
      let _orders = this.$store.state.orders;
      return _orders;
    }
  },
  data() {
    const initFiledArrays = [
      "send_username",
      "send_server",
      "amount",
      "order_status",
      "multiplier",
      "transfer_type",
      "created_at"
    ];
    const columnDefs = dtHelper.buildInitFields(orderSchemas, initFiledArrays);
    // const availableFilters = [
    //   {
    //     name: 'Stock',
    //     prop: 'product_line',
    //     type: 'text',
    //     ope: 'for',
    //     opeValue: '&=',
    //     value: 'sticker',
    //     key: 'Productlinecontainssticker'
    //   },
    //   {
    //     name: 'Stock',
    //     prop: 'product_line',
    //     type: 'text',
    //     ope: 'for',
    //     opeValue: '&=',
    //     value: 'case',
    //     key: 'Productlinecontainscase'
    //   },
    //   {
    //     name: 'Stock',
    //     prop: 'product_line',
    //     type: 'text',
    //     ope: 'for',
    //     opeValue: '&=',
    //     value: 'button',
    //     key: 'Productlinecontainsbutton'
    //   },
    //   {
    //     name: 'Stock',
    //     prop: 'product_line',
    //     type: 'text',
    //     ope: 'for',
    //     opeValue: '&=',
    //     value: 'wall art',
    //     key: 'Productlinecontainswallart'
    //   },
    //   {
    //     name: 'Stock',
    //     prop: 'product_line',
    //     type: 'text',
    //     ope: 'for',
    //     opeValue: '&=',
    //     value: 'tote bag',
    //     key: 'Productlinecontainstotebag'
    //   },
    //   {
    //     name: 'Product',
    //     prop: 'product_created',
    //     type: 'text',
    //     ope: 'not created',
    //     opeValue: 'empty',
    //     value: null,
    //     key: 'Productcreatedisempty'
    //   }
    // ];
    return {
      filterOutput: [],
      availableFilters: [],
      columnDefs,
      actions: [
        // {
        //   type: "primary",
        //   icon: "nc-icon nc-ruler-pencil",
        //   title: "Chỉnh sửa",
        //   callback: this.edit
        // }
      ],
      filter: {},
      rules: dtHelper.buildRules(orderSchemas),
      actionsTable: []
    };
  },
  mounted() {
    this.$store.dispatch("fetchOrder");
    this.$store.dispatch("setPageTitle", "Danh sách đơn hàng");
    this.$store.dispatch("setCurrentActions", [
      // {
      //   label: "Xuất excel",
      //   type: "default",
      //   icon: "",
      //   callback: this.exportExcel
      // },
      {
        label: "Tạo đơn hàng",
        type: "primary",
        icon: "",
        callback: this.createOrder
      }
    ]);
  },
  methods: {
    remoteMethod(params) {
      return this.$store.dispatch("fetchOrder", params);
    },
    updateFilter(filterOutput) {
      const filterString = dtHelper.buildQueryString(filterOutput);
      this.$store.dispatch("fetchOrders", {
        filterString
      });
    },
    sortChange(data) {
      const prop = data.prop;
      const order = data.order == "ascending" ? "asc" : "desc";
      this.$store.dispatch("fetchOrders", {
        order: `${prop}=${order}`
      });
    },
    createOrder() {
      this.$router.push("/orders/create");
    },
    edit(index, row) {
      this.$router.push(`/orders/${row._id}`);
    },
    statusOrderNew(rows) {
      this.updateOrderStatus(rows, "new", "order");
    },
    statusOrderConfirm(rows) {
      this.updateOrderStatus(rows, "confirm", "order");
    },
    statusOrderDone(rows) {
      this.updateOrderStatus(rows, "done", "order");
    },
    statusOrderReturn(rows) {
      this.updateOrderStatus(rows, "return", "order");
    },
    statusOrderCancel(rows) {
      this.updateOrderStatus(rows, "cancel", "order");
    },
    statusOrderDraft(rows) {
      this.updateOrderStatus(rows, "draft", "order");
    },
    statusPaymentNew(rows) {
      this.updateOrderStatus(rows, 0, "payment");
    },
    statusPaymentDone(rows) {
      this.updateOrderStatus(rows, 1, "payment");
    },
    updateOrderStatus(rows, status, type) {
      MessageBox.confirm(
        "Bạn có chắc chắn đổi trạng thái đơn hàng không?",
        "Warning",
        {
          confirmButtonText: "Đồng ý",
          cancelButtonText: "Hủy bỏ",
          type: "warning",
          center: true
        }
      ).then(() => {
        const self = this;
        const arrID = [];
        for (const row of rows) {
          arrID.push(row.id);
        }

        const data = {
          arrId: arrID,
          status
        };
        if (type == "order") {
          this.$store
            .dispatch("updateStatusOrder", data)
            .then(result => {
              self.$store.dispatch("fetchOrders");
              Message({
                type: "success",
                message: "Cập nhật thành công"
              });
            })
            .catch(error => {
              Message({
                type: "error",
                message: error.message
              });
            });
        } else {
          this.$store
            .dispatch("updateStatusPayment", data)
            .then(result => {
              self.$store.dispatch("fetchOrders");
              Message({
                type: "success",
                message: "Cập nhật thành công"
              });
            })
            .catch(error => {
              Message({
                type: "error",
                message: error.message
              });
            });
        }
      });
    },
    exportExcel() {
      let self = this;
      this.$util.exportExcel("order", self.$store.state.orders);
    }
  },
  destroyed() {
    this.$store.dispatch("setCurrentActions", []);
  }
};
</script>
<style lang="scss">
.el-table .td-actions {
  button.btn {
    margin-right: 5px;
  }
}
</style>
