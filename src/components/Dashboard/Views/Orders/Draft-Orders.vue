<template>
  <div class="row">
    <div class="col-md-12 card p-0">
      <div class="card-body">
        <div class="row">
          <div class="col-lg-9 col-md-6 col-sm-6 col-6">
            <my-filter
              :rules="rules"
              v-on:filter-change="updateFilter"
            ></my-filter>
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
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { MessageBox, Message } from "element-ui";
import MyTable from "src/components/UIComponents/Table.vue";
import MyFilter from "src/components/UIComponents/Filter.vue";
import dtHelper from "src/helpers/datatable";
import ColumnToggle from "src/components/UIComponents/ColumnToggle";
import orderSchemas from "./draft-order-schemas";

export default {
  components: {
    MyTable,
    MyFilter,
    ColumnToggle
  },
  computed: {
    orders() {
      return this.$store.state.orders;
    }
  },
  data() {
    const initFiledArrays = [
      "id",
      "name",
      "order_status",
      "payment_status",
      "shipping_status",
      "total",
      "created_at"
    ];
    const columnDefs = dtHelper.buildInitFields(orderSchemas, initFiledArrays);

    return {
      filterOutput: [],
      columnDefs,
      actions: [
        {
          type: "primary",
          icon: "fa-solid fa-pen-to-square",
          callback: this.edit
        }
      ],
      filter: {},
      rules: dtHelper.buildRules(orderSchemas),
      actionsTable: [
        {
          title: "Mới",
          callback: this.statusOrderNew
        },
        {
          title: "Đã xác nhận",
          callback: this.statusOrderConfirm
        },
        {
          title: "Chưa thanh toán",
          callback: this.statusPaymentNew
        },
        {
          title: "Đã thanh toán chưa gửi hàng",
          callback: this.statusPaymentDone
        },
        {
          title: "Hoàn tất",
          callback: this.statusOrderDone
        },
        {
          title: "Bị hoàn trả",
          callback: this.statusOrderReturn
        },
        {
          title: "Bị hủy",
          callback: this.statusOrderCancel
        },
        {
          title: "Nháp",
          callback: this.statusOrderDraft
        }
      ]
    };
  },
  mounted() {
    this.$store.dispatch("fetchOrders", {
      status: "draft"
    });

    this.$store.dispatch("setPageTitle", "đơn hàng nháp");
    this.$store.dispatch("setCurrentActions", [
      {
        label: "Xuất excel",
        type: "default",
        icon: "",
        callback: this.exportExcel
      },
      {
        label: "Tạo đơn hàng",
        type: "primary",
        icon: "",
        callback: this.createOrder
      }
    ]);
  },
  methods: {
    updateFilter(filterOutput) {
      const filterString = dtHelper.buildQueryString(filterOutput);
      this.$store.dispatch("fetchOrders", {
        status: "draft",
        filterString
      });
    },
    sortChange(data) {
      const prop = data.prop;
      const order = data.order == "ascending" ? "asc" : "desc";
      this.$store.dispatch("fetchOrders", {
        status: "draft",
        order: `${prop}=${order}`
      });
    },
    createOrder() {
      this.$router.push("/orders/create");
    },
    edit(index, row) {
      this.$router.push(`/orders/${row.id}`);
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
              self.$store.dispatch("fetchOrders", {
                status: "draft"
              });
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
              self.$store.dispatch("fetchOrders", {
                status: "draft"
              });
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
