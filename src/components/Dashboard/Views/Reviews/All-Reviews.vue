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
            v-bind:data-rows="reviewRows"
            :actions="actions"
            :actionsTable="actionsTable"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { MessageBox, Notification } from "element-ui";
import MyTable from "src/components/UIComponents/Table.vue";
import MyFilter from "src/components/UIComponents/Filter.vue";
import dtHelper from "src/helpers/datatable";
import ColumnToggle from "src/components/UIComponents/ColumnToggle";
import reviewSchemas from "./review-schemas";

export default {
  components: {
    MyTable,
    MyFilter,
    ColumnToggle
  },
  computed: {
    reviewRows() {
      const rows = this.$store.getters.reviews.map(r => {
        const product = this.products.find(p => p.id === r.productId);
        r.productName = product && product.name;
        r.content = r.content
          .split(" ")
          .slice(0, 50)
          .join(" ");
        const replyStat = r.replies.reduce(
          (stat, reply) => {
            stat[reply.status]++;
            return stat;
          },
          { approved: 0, pending: 0 }
        );
        r.replyStat = `${replyStat.pending}/${r.replies.length}`;
        r.reviewStatus = r.status;
        return r;
      });
      return dtHelper.filterByRules(rows, this.filterOutput);
    },
    ...mapGetters(["products", "reviews"])
  },
  data() {
    const initFiledArrays = [
      "id",
      "productName",
      "content",
      "replyStat",
      "reviewStatus",
      "updatedAt"
    ];
    return {
      filterOutput: [],
      columnDefs: dtHelper.buildInitFields(reviewSchemas, initFiledArrays),
      actions: [
        {
          type: "primary",
          icon: "fa fa-check",
          title: "approve",
          disabled: this.disableApproved,
          callback: this.approve
        },
        {
          type: "danger",
          icon: "fa-solid fa-xmark",
          title: "reject",
          disabled: this.disableRejected,
          callback: this.reject
        }
      ],
      actionsTable: [
        {
          title: "approve",
          callback: this.approveAll
        },
        {
          title: "reject",
          color: "text-danger",
          callback: this.rejectAll
        }
      ],
      filter: {},
      rules: dtHelper.buildRules(reviewSchemas)
    };
  },
  async mounted() {
    await this.$store.dispatch("fetchReviews");
    this.$store.dispatch("setPageTitle", "review");
    this.fetchReviewProducts(this.reviews);
  },
  methods: {
    updateFilter(filterOutput) {
      this.filterOutput = filterOutput;
    },
    disableApproved(index, row) {
      return row.status == "approved";
    },
    approve(index, row) {
      this.approveAll([row], "approve");
    },
    disableRejected(index, row) {
      return row.status == "rejected";
    },
    reject(index, row) {
      this.rejectAll([row], "reject");
    },
    rejectAll(rows) {
      this.batchAction(rows, "reject");
    },
    approveAll(rows) {
      this.batchAction(rows, "approve");
    },
    async batchAction(rows, action) {
      try {
        await Promise.all(
          rows.map(r => this.$store.dispatch(`${action}Review`, r.id))
        );
        await this.$store.dispatch("fetchReviews");
        Notification({
          title: "Success",
          message: `${action} success`,
          position: "bottom-right",
          type: "success"
        });
      } catch (error) {
        Notification({
          title: "Error",
          message: `${action} failed`,
          position: "bottom-right",
          type: "error"
        });
      }
    },
    async fetchReviewProducts(reviews) {
      const productIds = reviews.map(r => r.productId);
      this.$store.dispatch(`fetchProducts`, { ids: productIds });
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
